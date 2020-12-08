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
        commit('GET_SERVER_LIST', docs)
      }
    })
  },
  addServerList ({ commit }, val) {
    serverDB.insert({ ...val }, (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        console.log(docs)
      }
    })
  },
  editServerList ({ commit }, val) {
    serverDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
      if (err) {
        console.log(err)
      } else {
        console.log(numReplaced)
      }
    })
  },
  deleteServerList ({ commit }, id) {
    serverDB.remove({ _id: id }, { multi: false }, (err, numRemoved) => {
      if (err) {
        console.log(err)
      } else {
        console.log(numRemoved)
      }
    })
  }
}

export default {
  state,
  mutations,
  actions
}
