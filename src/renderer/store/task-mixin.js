import { mapState } from 'vuex'
const _ = require('lodash')

const taskMixin = {
  data () {
    return {
      logLevelOptions: {
        success: {
          color: '#67C23A'
        },
        info: {
          color: 'white'
        },
        warning: {
          color: '#E6A23C'
        },
        error: {
          color: '#F56C6C'
        }
      },
      taskStatusOptions: {
        passed: {
          color: 'green',
          desc: 'passed'
        },
        failed: {
          color: 'red',
          desc: 'failed'
        },
        running: {
          color: 'blue',
          desc: 'running'
        }
      }
    }
  },
  computed: {
    ...mapState({
      pendingTaskList: state => state.task.pendingTaskList,
      executingTaskQueue: state => state.task.executingTaskQueue
    }),
    executingTaskList () {
      return _.orderBy(this.executingTaskQueue, ['lastExecutedTime'], ['asc'])
    }
  },
  methods: {
    // pop up first task from pending task list
    _popPendingTaskList () {
      this.$store.commit('POP_PENDING_TASK_LIST')
    },
    // add task to pending task list
    _addPendingTaskList (val) {
      this.$store.commit('ADD_PENDING_TASK_LIST', JSON.parse(JSON.stringify(val)))
    },
    // add task to executing task queue
    _addExecutingTaskQueue (taskId, val) {
      this.$store.commit('ADD_EXECUTING_TASK_QUEUE', {
        taskId,
        task: JSON.parse(JSON.stringify(val))
      })
    },
    // remove task to executing task queue
    _removeExecutingTaskQueue (taskId) {
      this.$store.commit('REMOVE_EXECUTING_TASK_QUEUE', {
        taskId
      })
    },
    // add task log by task id
    _addTaskLogByTaskId (taskId, val, type = 'info') {
      this.$store.commit('ADD_TASK_LOG', {
        taskId,
        log: {
          msg: val,
          type
        }
      })
    },
    // change task status by task id
    _changeTaskStatusByTaskId (taskId, status = 'running') {
      this.$store.commit('CHANGE_TASK_STATUS', {
        taskId,
        status
      })
    },
    // ssh connect (ssh对象、ssh连接信息、taskId)
    _connectServe (ssh, sshInfo, taskId) {
      return new Promise((resolve, reject) => {
        this._addTaskLogByTaskId(taskId, '准备执行连接...')
        ssh.connect({ ...sshInfo }).then(async () => {
          this._addTaskLogByTaskId(taskId, `${sshInfo.host}连接成功`, 'success')
          resolve(true)
        }).catch(err => {
          this._addTaskLogByTaskId(taskId, `${sshInfo.host}连接失败`, 'error')
          this._addTaskLogByTaskId(taskId, err, 'error')
          reject(err)
        })
      })
    },
    // run linux shell (ssh对象、shell指令、执行路径、taskId)
    _runCommand (ssh, command, path = '/', taskId) {
      return new Promise((resolve, reject) => {
        this._addTaskLogByTaskId(taskId, command + ' 执行中...')
        ssh.execCommand(command, {
          cwd: path
        }).then((res) => {
          if (res.stdout) {
            this._addTaskLogByTaskId(taskId, command + ' 执行完成！', 'success')
            this._addTaskLogByTaskId(taskId, res.stdout)
            resolve(res.stdout)
          } else {
            this._addTaskLogByTaskId(taskId, command + ' 命令执行发生错误!', 'error')
            this._addTaskLogByTaskId(taskId, '请检查远端环境中该命令是否有效！', 'error')
            resolve(res.stderr)
          }
        }).catch(err => {
          reject(err)
        })
      })
    }
  }
}

export default taskMixin
