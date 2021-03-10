import { mapState, mapActions } from 'vuex'

const appMixin = {
  computed: {
    ...mapState({
      setting: state => state.app.setting
    })
  },
  methods: {
    ...mapActions([
      'getSetting',
      'initSetting',
      'updateSetting'
    ])
  }
}

export default appMixin
