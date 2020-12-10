<template>
  <div class="page-wrap">
    <!-- task log -->
    <a-collapse defaultActiveKey="0">
      <a-collapse-panel v-for="(item, index) in executingTaskList" :key="index"
        :header="`Task ${index + 1}`">
        <div class="task-log-wrap">
          <p v-for="(logItem, logIndex) in item.logs" :key="logIndex" :style="{ color: logLevelOptions[logItem.type].color }">
            {{ logItem.msg }}
          </p>
        </div>
      </a-collapse-panel>
    </a-collapse>
    <!-- action -->
  </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid'

import taskMixin from '@/store/task-mixin'
const { NodeSSH } = require('node-ssh')
export default {
  name: 'Task',
  mixins: [taskMixin],
  data () {
    return {
    }
  },
  watch: {
    pendingTaskList: {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          this.test(JSON.parse(JSON.stringify(newVal[0])))
          this._popPendingTaskList()
        }
      },
      immediate: true
    }
  },
  methods: {
    async test (task) {
      const taskId = uuidv4().replace(/-/g, '')
      this._addExecutingTaskQueue(task, taskId)
      const ssh = new NodeSSH()
      await this._connectServe(ssh, task.server, taskId)
      if (task.postCommond) this._runCommand(ssh, task.postCommond, taskId)
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
</style>
