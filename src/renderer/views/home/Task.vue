<template>
  <div class="page-wrap">
    <!-- task log -->
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
        <template #extra>
          <a-popconfirm
            title="Sure to save?"
            @confirm="() => saveDeployInstance(item)"
          >
            <a-icon @click.stop="" type="save" />
          </a-popconfirm>
          <a-popconfirm
            title="Sure to delete?"
            @confirm="() => onDelete(item.taskId)"
          >
            <a-icon @click.stop="" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
          </a-popconfirm>
        </template>
        <div class="task-log-wrap">
          <p v-for="(logItem, logIndex) in item.logs" :key="logIndex" :style="{ color: logLevelOptions[logItem.type].color }">
            {{ logItem.msg }}
          </p>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <a-empty v-else />
    <!-- action -->
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'

import taskMixin from '@/store/task-mixin'
import deployInstanceMixin from '@/store/deploy-instance-mixin'
const { NodeSSH } = require('node-ssh')
export default {
  name: 'Task',
  mixins: [taskMixin, deployInstanceMixin],
  data () {
    return {
    }
  },
  watch: {
    pendingTaskList: {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.handleTask(JSON.parse(JSON.stringify(newVal[0])))
          this._popPendingTaskList()
        }
      },
      immediate: true
    }
  },
  methods: {
    async handleTask (task) {
      const taskId = uuidv4().replace(/-/g, '')
      try {
        this._addExecutingTaskQueue(taskId, { ...task, taskId })
        const ssh = new NodeSSH()
        await this._connectServe(ssh, task.server, taskId)
        if (task.postCommond) await this._runCommand(ssh, task.postCommond, '/home/onpremise', taskId)
        this._addTaskLogByTaskId(taskId, '🎉恭喜，所有任务已执行完成！🎉', 'success')
        this._changeTaskStatusByTaskId(taskId, 'passed')
      } catch (error) {
        this._addTaskLogByTaskId(taskId, '❌任务执行中发生错误，请修改后再次尝试！❌', 'error')
        this._changeTaskStatusByTaskId(taskId, 'failed')
        console.log(error)
      }
    },
    saveDeployInstance (task) {
      const deployInstance = JSON.parse(JSON.stringify(task))
      if (deployInstance.logs) delete deployInstance.logs
      this._addDeployInstanceList(deployInstance)
    },
    onDelete (taskId) {
      if (taskId) this._removeExecutingTaskQueue(taskId)
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
