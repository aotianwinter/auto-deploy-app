<template>
  <div class="page-wrap">
    <!-- task log -->
    <div class="task-log-wrap">
      <p v-for="(item, index) in logs" :key="index">
        {{ item }}
      </p>
    </div>
    <!-- action -->
    <a-button @click="test">add</a-button>
  </div>
</template>
<script>
import terminalMixin from '@/store/terminal-mixin'
import taskMixin from '@/store/task-mixin'
const { NodeSSH } = require('node-ssh')
export default {
  name: 'Task',
  mixins: [terminalMixin, taskMixin],
  watch: {
    taskList: {
      handler (newVal, oldVal) {
        if (newVal.length > 0) {
          const sshInfo = JSON.parse(JSON.stringify(newVal[0].server))
          this._cleanTaskList()
          const ssh = new NodeSSH()
          this._connectServe(ssh, sshInfo)
        }
      },
      immediate: true

    }
  },
  methods: {
    test () {
      // if (this.taskList.length > 0) {
      //   const sshInfo = JSON.parse(JSON.stringify(this.taskList[0].server))
      //   // console.log(sshInfo)
      //   this._cleanTaskList()
      //   const ssh = new NodeSSH()
      //   this._connectServe(ssh, sshInfo)
      // }
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
