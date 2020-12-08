<template>
  <div class="page-wrap">
    <!-- task log -->
    <div class="task-log-wrap">
      <p v-for="(item, index) in taskLog" :key="index">
        {{ item }}
      </p>
    </div>
    <!-- action -->
    <a-button @click="test">add</a-button>
  </div>
</template>
<script>
import terminalMixin from '@/store/terminal-mixin'

export default {
  name: 'Task',
  mixins: [terminalMixin],
  methods: {
    test () {
      this._addTaskLog('aaa')
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
</style>
