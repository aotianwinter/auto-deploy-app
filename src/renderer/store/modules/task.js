const state = {
  pendingTaskList: [],
  /**
   * executingTaskQueue
   * {
   *   taskId: {
   *       status: 'running',
   *       logs: {
   *            type: 'info',
   *            msg: 'hello'
   *       },
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
  ADD_EXECUTING_TASK_QUEUE (state, { taskId, task }) {
    state.executingTaskQueue = Object.assign({}, state.executingTaskQueue,
      { [taskId]: { ...task, status: 'running' } })
  },
  REMOVE_EXECUTING_TASK_QUEUE (state, { taskId }) {
    if (state.executingTaskQueue[taskId]) {
      delete state.executingTaskQueue[taskId]
      state.executingTaskQueue = Object.assign({}, state.executingTaskQueue, {})
    }
  },
  UPDATE_TASK (state, { taskId, task }) {
    if (state.executingTaskQueue[taskId]) {
      state.executingTaskQueue = Object.assign({}, state.executingTaskQueue,
        { [taskId]: { ...task, status: 'running' } })
    }
  },
  UPDATE_TASK_STATUS (state, { taskId, status }) {
    if (state.executingTaskQueue[taskId]) {
      state.executingTaskQueue[taskId].status = status
    }
  },
  ADD_TASK_LOG (state, { taskId, log }) {
    if (state.executingTaskQueue[taskId]) {
      if (state.executingTaskQueue[taskId].logs && state.executingTaskQueue[taskId].logs.constructor === Array) {
        state.executingTaskQueue[taskId].logs.push(log)
      } else {
        state.executingTaskQueue[taskId] = Object.assign({}, state.executingTaskQueue[taskId], { logs: [log] })
      }
    }
  },
  CLEAN_TASK_LOG (state, { taskId }) {
    if (state.executingTaskQueue[taskId]) {
      if (state.executingTaskQueue[taskId].logs && state.executingTaskQueue[taskId].logs.constructor === Array) {
        state.executingTaskQueue[taskId] = Object.assign({}, state.executingTaskQueue[taskId], { logs: [] })
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
