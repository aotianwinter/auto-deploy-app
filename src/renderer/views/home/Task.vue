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

export default {
  name: 'Task',
  mixins: [terminalMixin, taskMixin],
  watch: {
    taskList () {
      if (this.taskList.length) {
        console.log(this.taskList)
      }
    }
  },
  methods: {
    test () {
      this._addLogs('aaa')
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
