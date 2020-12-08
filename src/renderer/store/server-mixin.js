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
    },
    _addServerList (val) {
      this.$store.dispatch('addServerList', JSON.parse(JSON.stringify(val)))
    },
    _editServerList (val) {
      this.$store.dispatch('editServerList', JSON.parse(JSON.stringify(val)))
    },
    _deleteServerList (id) {
      this.$store.dispatch('deleteServerList', id)
    }
  }
}

export default serverMixin
