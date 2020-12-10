const state = {
  pendingTaskList: [],
  /**
   * executingTaskQueue
   * {
   *   taskId: {
   *       logs: {
   *            type: 'info',
   *            msg: 'hello'
   *         },
   *       postCommand: ''
   *   }
   * }
   */
  executingTaskQueue: {}
}

const mutations = {
  POP_PENDING_TASK_LIST (state) {
    state.pendingTaskList.shift()
  },
  ADD_PENDING_TASK_LIST (state, val) {
    state.pendingTaskList.push(val)
  },
  ADD_EXECUTING_TASK_QUEUE (state, val) {
    // state.executingTaskQueue[val.taskId] = val.task
    state.executingTaskQueue = Object.assign({}, state.executingTaskQueue, { [val.taskId]: val.task })
  },
  ADD_TASK_LOG (state, val) {
    // TODO 无法触发更新
    if (state.executingTaskQueue[val.taskId]) {
      if (state.executingTaskQueue[val.taskId].logs && state.executingTaskQueue[val.taskId].logs.constructor === Array) {
        state.executingTaskQueue[val.taskId].logs.push(val.log)
      } else {
        // task.logs = []
        state.executingTaskQueue[val.taskId] =
          Object.assign({}, state.executingTaskQueue[val.taskId], { logs: [val.log] })
        // task.logs.push(val.log)
        // console.log(state.executingTaskQueue[val.taskId])
      }
    }
  }
}

const actions = {
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
