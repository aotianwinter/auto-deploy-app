<template>
  <div class="page-wrap">
    <a-collapse defaultActiveKey="0" v-if="executingTaskList.length > 0">
      <a-collapse-panel v-for="(item, index) in executingTaskList" :key="index">
        <template #header>
          {{ `Task ${index + 1}` }}
          <a-tag :color="taskStatusOptions[item.status].color">
            {{ taskStatusOptions[item.status].desc }}
          </a-tag>
          {{ item.server.name }}
          <a-icon type="clock-circle" />
          {{ `${item.lastExecutedTime}` }}
        </template>
        <!-- action -->
        <template #extra>
          <a-popconfirm
            placement="left"
            title="Sure to save?"
            @confirm="() => saveDeployInstance(item)"
          >
            <a-icon @click.stop="" type="save" />
          </a-popconfirm>
          <a-icon @click.stop="showEditForm(item)" type="edit" />
          <a-popconfirm
            placement="left"
            title="Sure to delete?"
            @confirm="() => onDelete(item.taskId)"
          >
            <a-icon @click.stop="" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
          </a-popconfirm>
        </template>
        <!-- task log -->
        <div class="task-log-wrap">
          <p v-for="(logItem, logIndex) in item.logs" :key="logIndex" :style="{ color: logLevelOptions[logItem.type].color }">
            {{ logItem.msg }}
          </p>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-empty v-else />
    <!-- modal -->
    <DeployAction :data="curTask" :visible="deployActionVisible"
      @cancel="closeAddForm" @submit="onSubmit" />
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'

import taskMixin from '@/store/task-mixin'
import deployInstanceMixin from '@/store/deploy-instance-mixin'
import DeployAction from './DeployAction'

const { NodeSSH } = require('node-ssh')
export default {
  name: 'Task',
  mixins: [taskMixin, deployInstanceMixin],
  components: {
    DeployAction
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
      try {
        const ssh = new NodeSSH()
        await this._connectServe(ssh, task.server, taskId)
        if (task.postCommond) await this._runCommand(ssh, task.postCommond, '/home/onpremise', taskId)
        this._addTaskLogByTaskId(taskId, '🎉恭喜，所有任务已执行完成！🎉', 'success')
        this._changeTaskStatusByTaskId(taskId, 'passed')
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this._editDeployInstanceList({
            ...task,
            status: 'passed'
          })
        }
      } catch (error) {
        this._addTaskLogByTaskId(taskId, '❌任务执行中发生错误，请修改后再次尝试！❌', 'error')
        this._changeTaskStatusByTaskId(taskId, 'failed')
        console.log(error)
        // if task in deploy instance list finshed then update status
        if (task._id) {
          this._editDeployInstanceList({
            ...task,
            status: 'failed'
          })
        }
      }
    },
    saveDeployInstance (task) {
      const deployInstance = JSON.parse(JSON.stringify(task))
      if (deployInstance.logs) delete deployInstance.logs
      this._addDeployInstanceList(deployInstance)
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
      this._addTaskLogByTaskId(taskId, '⚡即将执行更新后的任务...⚡', 'primary')
      this.handleTask(taskId, task)
    }
  }
}
</script>
<style lang="stylus" scoped>
.page-wrap
  .task-log-wrap
    color white
    background black
    height 500px
    overflow-y auto
    padding 1rem

.anticon
  margin-left 6px
</style>
