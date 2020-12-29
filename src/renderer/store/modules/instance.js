import { instanceDB } from '@/core/datastore'

const state = {
  instanceList: [] // saved deploy instance list
}

const mutations = {
  GET_INSTANCE_LIST (state, array) {
    state.instanceList = array
  }
}

const actions = {
  getInstanceListByName ({ commit }, val) {
    return new Promise((resolve, reject) => {
      instanceDB.find({ name: val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          resolve(docs)
        }
      })
    })
  },
  getInstanceList ({ commit }) {
    return new Promise((resolve, reject) => {
      instanceDB.find({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          commit('GET_INSTANCE_LIST', docs)
          resolve()
        }
      })
    })
  },
  addInstanceList ({ commit }, val) {
    if (val.logs) delete val.logs
    return new Promise((resolve, reject) => {
      instanceDB.insert({ ...val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          console.log(docs)
          resolve()
        }
      })
    })
  },
  editInstanceList ({ commit }, val) {
    if (val.logs) delete val.logs
    return new Promise((resolve, reject) => {
      instanceDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
        if (err) {
          reject(err)
        } else {
          console.log(numReplaced)
          resolve()
        }
      })
    })
  },
  deleteInstanceList ({ commit }, id) {
    return new Promise((resolve, reject) => {
      instanceDB.remove({ _id: id }, { multi: false }, (err, numRemoved) => {
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
