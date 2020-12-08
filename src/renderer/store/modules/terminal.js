const state = {
  taskLog: []
}

const mutations = {
  CLEAN_TASK_LOG (state) {
    state.taskLog = []
  },
  ADD_TASK_LOG (state, val) {
    state.taskLog.push(val)
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
