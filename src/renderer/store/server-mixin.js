import { mapState } from 'vuex'

const serverMixin = {
  computed: {
    ...mapState({
      serverList: state => state.server.serverList
    })
  },
  methods: {
    _getServerList () {
      this.$store.dispatch('getServerList')
    }
  }
}

export default serverMixin
