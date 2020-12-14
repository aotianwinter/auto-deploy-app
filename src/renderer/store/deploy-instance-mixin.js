import { mapState } from 'vuex'

const deployInstanceMixin = {
  computed: {
    ...mapState({
      deployInstanceList: state => state.deployInstance.deployInstanceList
    })
  },
  methods: {
    _getDeployInstanceList () {
      this.$store.dispatch('getDeployInstanceList')
    },
    _addDeployInstanceList (val) {
      this.$store.dispatch('addDeployInstanceList', JSON.parse(JSON.stringify(val)))
    },
    _editDeployInstanceList (val) {
      this.$store.dispatch('editDeployInstanceList', JSON.parse(JSON.stringify(val)))
    },
    _deleteDeployInstanceList (id) {
      this.$store.dispatch('deleteDeployInstanceList', id)
    }
  }
}

export default deployInstanceMixin
