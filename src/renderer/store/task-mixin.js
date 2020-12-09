import { mapState } from 'vuex'

const taskMixin = {
  computed: {
    ...mapState({
      taskList: state => state.task.taskList
    })
  },
  methods: {
    _cleanTaskList () {
      this.$store.commit('CLEAN_TASK_LIST')
    },
    _addTaskList (val) {
      this.$store.commit('ADD_TASK_LIST', val)
    }
  }
}

export default taskMixin
