import { mapState, mapActions } from 'vuex'

const instanceMixin = {
  computed: {
    ...mapState({
      instanceList: state => state.instance.instanceList
    })
  },
  methods: {
    ...mapActions([
      'getInstanceList',
      'addInstanceList',
      'editInstanceList',
      'deleteInstanceList'
    ])
  }
}

export default instanceMixin
