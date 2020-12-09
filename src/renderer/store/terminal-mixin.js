import { mapState } from 'vuex'

const terminalMixin = {
  computed: {
    ...mapState({
      logs: state => state.terminal.logs
    })
  },
  methods: {
    _cleanLogs () {
      this.$store.commit('CLEAN_LOGS')
    },
    _addLogs (val) {
      this.$store.commit('ADD_LOGS', val)
    }
  }
}

export default terminalMixin
