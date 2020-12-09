const state = {
  taskList: []
}

const mutations = {
  CLEAN_TASK_LIST (state) {
    state.taskList = []
  },
  ADD_TASK_LIST (state, val) {
    state.taskList.push(val)
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
