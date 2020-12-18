import { mapState, mapActions } from 'vuex'

const serverMixin = {
  computed: {
    ...mapState({
      serverList: state => state.server.serverList
    })
  },
  methods: {
    ...mapActions([
      'getServerList',
      'addServerList',
      'editServerList',
      'deleteServerList'
    ])
  }
}

export default serverMixin
