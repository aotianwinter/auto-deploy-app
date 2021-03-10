import { appDB } from '@/core/datastore'

const state = {
  setting: {} // app setting
}

const mutations = {
  GET_SETTING (state, obj) {
    state.setting = obj
  }
}

const actions = {
  getSetting ({ commit }) {
    return new Promise((resolve, reject) => {
      appDB.findOne({}, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          console.log()
          if (docs) commit('GET_SETTING', docs)
          resolve(docs)
        }
      })
    })
  },
  initSetting ({ commit }, val) {
    if (val.logs) delete val.logs
    return new Promise((resolve, reject) => {
      appDB.insert({ ...val }, (err, docs) => {
        if (err) {
          reject(err)
        } else {
          console.log(docs)
          resolve()
        }
      })
    })
  },
  updateSetting ({ commit }, val) {
    if (val.logs) delete val.logs
    return new Promise((resolve, reject) => {
      appDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
        if (err) {
          reject(err)
        } else {
          console.log(numReplaced)
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
