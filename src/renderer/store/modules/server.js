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
  getServerListByName ({ commit }, val) {
    return new Promise((resolve, reject) => {
      serverDB.find({ name: val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  },
  getServerList ({ commit }) {
    return new Promise((resolve, reject) => {
      serverDB.find({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          commit('GET_SERVER_LIST', docs)
          resolve()
        }
      })
    })
  },
  addServerList ({ commit }, val) {
    return new Promise((resolve, reject) => {
      serverDB.insert({ ...val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          console.log(docs)
          resolve()
        }
      })
    })
  },
  editServerList ({ commit }, val) {
    return new Promise((resolve, reject) => {
      serverDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
        if (err) {
          reject(err)
        } else {
          console.log(numReplaced)
          resolve()
        }
      })
    })
  },
  deleteServerList ({ commit }, id) {
    return new Promise((resolve, reject) => {
      serverDB.remove({ _id: id }, { multi: false }, (err, numRemoved) => {
        if (err) {
          reject(err)
        } else {
          console.log(numRemoved)
          resolve()
        }
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
