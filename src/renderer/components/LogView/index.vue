<template>
  <div class="log-wrap">
    <template v-for="(logItem, logIndex) in logs">
      <p :style="{ 'white-space': 'pre', color: logLevelOptions[logItem.type].color }" :key="logIndex"
        >{{ logItem.msg }}</p>
    </template>
  </div>
</template>
<script>
export default {
  name: 'TerminalView',
  props: {
    logs: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      logLevelOptions: {
        success: {
          color: '#67C23A'
        },
        info: {
          color: 'white'
        },
        primary: {
          color: '#409EFF'
        },
        warning: {
          color: '#E6A23C'
        },
        error: {
          color: '#F56C6C'
        }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.log-wrap
  color white
  background black
  height 700px
  overflow-y auto
  padding 1rem
</style>

