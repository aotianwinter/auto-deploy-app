import { mapState } from 'vuex'

const terminalMixin = {
  computed: {
    ...mapState({
      taskLog: state => state.terminal.taskLog
    })
  },
  methods: {
    _cleanTaskLog () {
      this.$store.commit('CLEAN_TASK_LOG')
    },
    _addTaskLog (val) {
      this.$store.commit('ADD_TASK_LOG', val)
    }
  }
}

export default terminalMixin
