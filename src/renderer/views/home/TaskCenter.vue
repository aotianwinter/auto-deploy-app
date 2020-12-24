<template>
  <div class="page-wrap">
    <a-collapse defaultActiveKey="0" v-if="executingTaskList.length > 0">
      <a-collapse-panel v-for="(item, index) in executingTaskList" :key="index">
        <template #header>
          {{ `Task ${item.name}` }}
          <a-tag :color="taskStatusOptions[item.status].color">
            {{ taskStatusOptions[item.status].desc }}
          </a-tag>
          {{ item.server && item.server.name }}
          <a-icon type="clock-circle" />
          {{ `${item.lastExecutedTime}` }}
        </template>
        <!-- action -->
        <template #extra>
          <a-popconfirm
            v-show="item.status !== 'running'"
            placement="left"
            title="Sure to save?"
            @confirm="() => saveDeployInstance(item)"
          >
            <a-icon title="save" @click.stop="" type="save" theme="twoTone" two-tone-color="#67C23A" />
          </a-popconfirm>
          <a-popconfirm
            placement="left"
            title="Sure to clear logs and retry?"
            @confirm="() => onRetry(item)"
          >
            <a-icon title="retry" @click.stop="" type="reload" style="color: #409EFF" />
          </a-popconfirm>
          <a-icon title="edit" @click.stop="showEditForm(item)" type="edit" />
          <a-popconfirm
            placement="left"
            title="Sure to delete?"
            @confirm="() => onDelete(item.taskId)"
          >
            <a-icon title="delete" @click.stop="" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
          </a-popconfirm>
        </template>
        <!-- task log -->
        <LogView :logs="item.logs" />
      </a-collapse-panel>
    </a-collapse>
    <a-empty description="No Task" v-else />
    <!-- modal -->
    <InstanceForm title="Update Deploy Task " :data="curTask" :visible="deployActionVisible"
      @cancel="closeAddForm" @submit="onSubmit" />
  </div>
</template>
<script>
import { remote } from 'electron'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'

import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
import InstanceForm from './InstanceForm'
import LogView from '@/components/LogView'

const { NodeSSH } = require('node-ssh')
const { join } = require('path')
export default {
  name: 'TaskCenter',
  mixins: [taskMixin, instanceMixin],
  components: {
    InstanceForm,
    LogView
  },
  data () {
    return {
      curTask: {},
      deployActionVisible: false
    }
  },
  watch: {
    pendingTaskList: {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          const task = JSON.parse(JSON.stringify(newVal[0]))
          const taskId = uuidv4().replace(/-/g, '')
          this._addExecutingTaskQueue(taskId, { ...task, taskId })
          this.handleTask(taskId, task)
          this._popPendingTaskList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 处理任务
    async handleTask (taskId, task) {
      const { name, server, preCommandList, isUpload } = task
      try {
        this._addTaskLogByTaskId(taskId, '⚡开始执行任务...', 'primary')
        const ssh = new NodeSSH()
        // ssh connect
        await this._connectServe(ssh, server, taskId)
        // run post command in preCommandList
        if (preCommandList && preCommandList instanceof Array) {
          for (const { path, command } of preCommandList) {
            if (path && command) await this._runCommand(ssh, command, path, taskId)
          }
        }
        // is upload
        if (isUpload) {
          const { projectPath, releasePath, backup, postCommandList } = task
          const deployDir = releasePath.replace(new RegExp(/([/][^/]+)$/), '') || '/'
          const releaseDir = releasePath.match(new RegExp(/([^/]+)$/))[1]
          // compress dir and upload file
          const localFile = join(remote.app.getPath('userData'), '/' + 'dist.zip')
          if (projectPath) {
            await this._compress(projectPath, localFile, [], 'dist/', taskId)
          }
          // backup check
          if (backup) {
            this._addTaskLogByTaskId(taskId, '已开启远端备份', 'success')
            await this._runCommand(ssh,
              `
              if [ -d ${releaseDir} ];
              then mv ${releaseDir} ${releaseDir}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}
              fi
              `, deployDir, taskId)
          } else {
            this._addTaskLogByTaskId(taskId, '提醒：未开启远端备份', 'warning')
            await this._runCommand(ssh,
              `
              if [ -d ${releaseDir} ];
              then mv ${releaseDir} /tmp/${releaseDir}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}
              fi
              `, deployDir, taskId)
          }
          // upload unzip and clear
          await this._uploadFile(ssh, localFile, deployDir + '/dist.zip', taskId)
          await this._runCommand(ssh, 'unzip dist.zip', deployDir, taskId)
          await this._runCommand(ssh, 'mv dist ' + releaseDir, deployDir, taskId)
          await this._runCommand(ssh, 'rm -f dist.zip', deployDir, taskId)
          // run post command in postCommandList
          if (postCommandList && postCommandList instanceof Array) {
            for (const { path, command } of postCommandList) {
              if (path && command) await this._runCommand(ssh, command, path, taskId)
            }
          }
        }
        this._addTaskLogByTaskId(taskId, `🎉恭喜，所有任务已执行完成，${name} 执行成功！`, 'success')
        this._changeTaskStatusByTaskId(taskId, 'passed')
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this.editInstanceList({
            ...task,
            status: 'passed'
          })
        }
        // system notification
        const myNotification = new Notification('✔ Success', {
          body: `🎉恭喜，所有任务已执行完成，${name} 执行成功！`
        })
        console.log(myNotification)
      } catch (error) {
        this._addTaskLogByTaskId(taskId, `❌ ${name} 执行中发生错误，请修改后再次尝试！`, 'error')
        this._changeTaskStatusByTaskId(taskId, 'failed')
        console.log(error)
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this.editInstanceList({
            ...task,
            status: 'failed'
          })
        }
        // system notification
        const myNotification = new Notification('❌Error', {
          body: `🙃 ${name} 执行中发生错误，请修改后再次尝试！`
        })
        console.log(myNotification)
      }
    },
    // 保存
    async saveDeployInstance (task) {
      const instance = JSON.parse(JSON.stringify(task))
      if (instance.logs) delete instance.logs
      task._id ? await this.editInstanceList(instance) : await this.addInstanceList(instance)
      this.$message.success('save success!')
      this.$emit('switchTab', '3')
    },
    // 重新执行
    onRetry (task) {
      const { taskId } = task
      if (taskId) {
        this._cleanTaskLogByTaskId(taskId)
        this.handleTask(taskId, task)
      }
    },
    onDelete (taskId) {
      if (taskId) this._removeExecutingTaskQueue(taskId)
    },
    // 展示编辑表单
    showEditForm (val) {
      this.curTask = JSON.parse(JSON.stringify(val))
      this.deployActionVisible = true
    },
    // 关闭表单
    closeAddForm () {
      this.deployActionVisible = false
    },
    // 提交表单
    onSubmit (val) {
      const task = JSON.parse(JSON.stringify(val))
      const { taskId } = task
      this.deployActionVisible = false
      this._changeTaskByTaskId(taskId, task)
      this._addTaskLogByTaskId(taskId, '⚡即将执行更新后的任务...', 'primary')
      this.handleTask(taskId, task)
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
