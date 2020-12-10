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
      }
    }
  },
  computed: {
    ...mapState({
      pendingTaskList: state => state.task.pendingTaskList,
      executingTaskQueue: state => state.task.executingTaskQueue
    }),
    executingTaskList () {
      return _.orderBy(this.executingTaskQueue, ['createdTime'], ['asc'])
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
    _addExecutingTaskQueue (val, taskId) {
      this.$store.commit('ADD_EXECUTING_TASK_QUEUE', {
        taskId,
        task: JSON.parse(JSON.stringify(val))
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
    // ssh connect (ssh对象、ssh连接信息、taskId)
    _connectServe (ssh, sshInfo, taskId) {
      return new Promise((resolve, reject) => {
        this._addTaskLogByTaskId(taskId, '准备执行连接...')
        ssh.connect({ ...sshInfo }).then(async () => {
          // console.log(`${sshInfo.host}连接成功`)
          this._addTaskLogByTaskId(taskId, `${sshInfo.host}连接成功`, 'success')
          resolve(true)
        }).catch(err => {
          // console.log(err, `${sshInfo.host}连接失败`)
          this._addTaskLogByTaskId(taskId, `${sshInfo.host}连接失败`, 'error')
          this._addTaskLogByTaskId(taskId, err, 'error')
          reject(err)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    // run linux shell (ssh对象、shell指令、执行路径、taskId)
    _runCommand (ssh, command, path = '/', taskId) {
      return new Promise((resolve, reject) => {
        ssh.execCommand(command, {
          cwd: path
        }).then((res) => {
          if (res.stdout) {
            // console.log(command + ' 执行完成！')
            this._addTaskLogByTaskId(taskId, command + ' 执行完成！', 'success')
            this._addTaskLogByTaskId(taskId, res.stdout)
            // console.log('stdout', res.stdout)
            resolve(res.stdout)
          } else {
            // console.log('stderr', res.stderr)
            this._addTaskLogByTaskId(taskId, command + ' 命令执行发生错误!', 'error')
            this._addTaskLogByTaskId(taskId, '请检查远端环境中该命令是否有效！', 'error')
            // console.log(command + ' 命令执行发生错误!')
            // console.log('请检查远端环境中该命令是否有效！')
            resolve(res.stderr)
          }
        }).catch(err => {
          reject(err)
        })
      }).catch(e => {
        console.log(e)
      })
    }
  }
}

export default taskMixin
