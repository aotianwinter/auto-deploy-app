import { serverDB } from '@/core/datastore'

const state = {
  serverList: []
}

const mutations = {
  GET_SERVER_LIST (state, array) {
    state.serverList = array
  }
}

const actions = {
  getServerList ({ commit }) {
    serverDB.find({}, (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        console.log(docs)
        commit('GET_SERVER_LIST', docs)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
