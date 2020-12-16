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
    deployInstanceDB.find({}, (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        commit('GET_DEPLOY_INSTANCE_LIST', docs)
      }
    })
  },
  addDeployInstanceList ({ commit }, val) {
    deployInstanceDB.insert({ ...val }, (err, docs) => {
      if (err) {
        console.log(err)
      } else {
        console.log(docs)
      }
    })
  },
  editDeployInstanceList ({ commit }, val) {
    deployInstanceDB.update({ _id: val._id }, { ...val }, (err, numReplaced) => {
      if (err) {
        console.log(err)
      } else {
        console.log(numReplaced)
      }
    })
  },
  deleteDeployInstanceList ({ commit }, id) {
    deployInstanceDB.remove({ _id: id }, { multi: false }, (err, numRemoved) => {
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
