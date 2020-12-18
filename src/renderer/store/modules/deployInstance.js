import { deployInstanceDB } from '@/core/datastore'

const state = {
  deployInstanceList: [] // saved deploy instance list
}

const mutations = {
  GET_DEPLOY_INSTANCE_LIST (state, array) {
    state.deployInstanceList = array
  }
}

const actions = {
  getDeployInstanceList ({ commit }) {
    return new Promise((resolve, reject) => {
      deployInstanceDB.find({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          commit('GET_DEPLOY_INSTANCE_LIST', docs)
          resolve()
        }
      })
    })
  },
  addDeployInstanceList ({ commit }, val) {
    return new Promise((resolve, reject) => {
      deployInstanceDB.insert({ ...val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          console.log(docs)
          resolve()
        }
      })
    })
  },
  editDeployInstanceList ({ commit }, val) {
    return new Promise((resolve, reject) => {
      deployInstanceDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
        if (err) {
          reject(err)
        } else {
          console.log(numReplaced)
          resolve()
        }
      })
    })
  },
  deleteDeployInstanceList ({ commit }, id) {
    return new Promise((resolve, reject) => {
      deployInstanceDB.remove({ _id: id }, { multi: false }, (err, numRemoved) => {
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
