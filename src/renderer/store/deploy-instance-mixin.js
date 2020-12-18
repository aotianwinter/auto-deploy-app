import { mapState, mapActions } from 'vuex'

const deployInstanceMixin = {
  computed: {
    ...mapState({
      deployInstanceList: state => state.deployInstance.deployInstanceList
    })
  },
  methods: {
    ...mapActions([
      'getDeployInstanceList',
      'addDeployInstanceList',
      'editDeployInstanceList',
      'deleteDeployInstanceList'
    ])
  }
}

export default deployInstanceMixin
