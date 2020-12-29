<template>
  <div class="page-wrap">
    <!-- task switch tab -->
    <a-tabs type="card" v-if="executingTaskList.length > 0" animated>
      <a-tab-pane v-for="(item, index) in executingTaskList" :key="index" :tab="`Task ${index + 1} ${item.name}`">
        <a-card>
          <template #title>
            <a-tag :color="taskStatusOptions[item.status].color">
              {{ taskStatusOptions[item.status].desc }}
            </a-tag>
            <a-icon type="database" />
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
          <LogView :logs="item.logs" />
        </a-card>
      </a-tab-pane>
    </a-tabs>
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
      const startTime = new Date().getTime() // 计时开始
      let endTime = 0 // 计时结束
      this._addTaskLogByTaskId(taskId, '⚡开始执行任务...', 'primary')
      try {
        const ssh = new NodeSSH()
        // ssh connect
        await this._connectServe(ssh, server, taskId)
        // run post command in preCommandList
        if (preCommandList && preCommandList instanceof Array) {
          for (const { path, command } of preCommandList) {
            if (path && command) await this._runCommand(ssh, command, path, taskId)
          }
        }
        // TODO 区分上传文件 文件夹
        // is upload
        if (isUpload) {
          const { projectType, localPreCommand, projectPath, localPostCommand,
            releasePath, backup, postCommandList } = task
          // run local pre command
          if (localPreCommand) {
            const { path, command } = localPreCommand
            if (path && command) await this._runLocalCommand(command, path, taskId)
          }
          let deployDir = '' // 部署目录
          let releaseDir = '' // 发布目录或文件
          let localFile = '' // 待上传文件
          if (projectType === 'dir') {
            deployDir = releasePath.replace(new RegExp(/([/][^/]+)$/), '') || '/'
            releaseDir = releasePath.match(new RegExp(/([^/]+)$/))[1]
            // compress dir and upload file
            localFile = join(remote.app.getPath('userData'), '/' + 'dist.zip')
            if (projectPath) {
              await this._compress(projectPath, localFile, [], 'dist/', taskId)
            }
          } else {
            deployDir = releasePath
            releaseDir = projectPath.match(new RegExp(/([^/]+)$/))[1]
            localFile = projectPath
          }
          // backup check
          let checkFileType = projectType === 'dir' ? '-d' : '-f' // check file type
          if (backup) {
            this._addTaskLogByTaskId(taskId, '已开启远端备份', 'success')
            await this._runCommand(ssh,
              `
              if [ ${checkFileType} ${releaseDir} ];
              then mv ${releaseDir} ${releaseDir}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}
              fi
              `, deployDir, taskId)
          } else {
            this._addTaskLogByTaskId(taskId, '提醒：未开启远端备份', 'warning')
            await this._runCommand(ssh,
              `
              if [ ${checkFileType} ${releaseDir} ];
              then mv ${releaseDir} /tmp/${releaseDir}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}
              fi
              `, deployDir, taskId)
          }
          // upload file or dir (dir support unzip and clear)
          if (projectType === 'dir') {
            await this._uploadFile(ssh, localFile, deployDir + '/dist.zip', taskId)
            await this._runCommand(ssh, 'unzip dist.zip', deployDir, taskId)
            await this._runCommand(ssh, 'mv dist ' + releaseDir, deployDir, taskId)
            await this._runCommand(ssh, 'rm -f dist.zip', deployDir, taskId)
          } else {
            await this._uploadFile(ssh, localFile, deployDir + '/' + releaseDir, taskId)
          }
          // run local post command
          if (localPostCommand) {
            const { path, command } = localPostCommand
            if (path && command) await this._runLocalCommand(command, path, taskId)
          }
          // run post command in postCommandList
          if (postCommandList && postCommandList instanceof Array) {
            for (const { path, command } of postCommandList) {
              if (path && command) await this._runCommand(ssh, command, path, taskId)
            }
          }
        }
        this._addTaskLogByTaskId(taskId, `🎉恭喜，所有任务已执行完成，${name} 执行成功！`, 'success')
        // 计时结束
        endTime = new Date().getTime()
        const costTime = ((endTime - startTime) / 1000).toFixed(2)
        this._addTaskLogByTaskId(taskId, `总计耗时 ${costTime}s`, 'primary')
        this._changeTaskStatusAndCostTimeByTaskId(taskId, 'passed', costTime)
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this.editInstanceList({
            ...task
          })
        }
        // system notification
        const myNotification = new Notification('✔ Success', {
          body: `🎉恭喜，所有任务已执行完成，${name} 执行成功！`
        })
        console.log(myNotification)
      } catch (error) {
        this._addTaskLogByTaskId(taskId, `❌ ${name} 执行中发生错误，请修改后再次尝试！`, 'error')
        // 计时结束
        endTime = new Date().getTime()
        const costTime = ((endTime - startTime) / 1000).toFixed(2)
        this._addTaskLogByTaskId(taskId, `总计耗时 ${costTime}s`, 'primary')
        this._changeTaskStatusAndCostTimeByTaskId(taskId, 'failed', costTime)
        console.log(error)
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this.editInstanceList({
            ...task
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
      // check instance name is exist when add
      if (!task._id) {
        const res = await this.getInstanceListByName(task.name)
        if (res && res.length) {
          this.$message.warning(`Exist the same instance's name, please edit and save again`)
          return
        }
      }
      const instance = JSON.parse(JSON.stringify(task))
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
      this._initTaskByTaskId(taskId, task)
      this._addTaskLogByTaskId(taskId, '⚡即将执行更新后的任务...', 'primary')
      this.handleTask(taskId, task)
    }
  }
}
</script>
<style lang="stylus" scoped>
.anticon
  margin-left 6px
</style>
