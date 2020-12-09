const state = {
  logs: []
}

const mutations = {
  CLEAN_LOGS (state) {
    state.logs = []
  },
  ADD_LOGS (state, val) {
    state.logs.push(val)
  }
}

const actions = {
}

export default {
  state,
  mutations,
  actions
}
