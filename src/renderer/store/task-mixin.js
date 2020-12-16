import { mapState } from 'vuex'
const _ = require('lodash')
const fs = require('fs')
const join = require('path').join
const archiver = require('archiver')

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
        primary: {
          color: '#409EFF'
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
    // change task by task id
    _changeTaskByTaskId (taskId, val) {
      this.$store.commit('UPDATE_TASK', {
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
    // clean task log by task id
    _cleanTaskLogByTaskId (taskId) {
      this.$store.commit('CLEAN_TASK_LOG', { taskId })
    },
    // change task status by task id
    _changeTaskStatusByTaskId (taskId, status = 'running') {
      this.$store.commit('UPDATE_TASK_STATUS', {
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
        this._addTaskLogByTaskId(taskId, command + '执行中...')
        ssh.execCommand(command, {
          cwd: path
        }).then((res) => {
          console.log(11, res)
          if (res.stderr) {
            this._addTaskLogByTaskId(taskId, command + '命令执行发生错误!', 'error')
            this._addTaskLogByTaskId(taskId, '请检查远端环境中该命令是否有效！', 'warning')
            resolve(res.stderr)
          } else {
            this._addTaskLogByTaskId(taskId, res.stdout)
            this._addTaskLogByTaskId(taskId, command + '执行完成！', 'success')
            resolve(res.stdout)
          }
        }).catch(err => {
          reject(err)
        })
      })
    },
    // compress dir (目标压缩文件、本地保存文件、排除文件列表、外层文件夹名称)
    _compress (targetDir, localFile, excludeFiles, homeDirName = 'dist/', taskId) {
      return new Promise((resolve, reject) => {
        // prepare before compress
        const filterDir = this._filterExcludeFiles(targetDir, excludeFiles)
        this._addTaskLogByTaskId(taskId, '⏳正在压缩文件...')
        let output = fs.createWriteStream(localFile) // create file stream write
        const archive = archiver('zip', {
          zlib: { level: 9 } // set compress level
        })
        output.on('close', () => {
          this._addTaskLogByTaskId(taskId,
            '压缩完成！共计' + (archive.pointer() / 1024 / 1024).toFixed(3) + 'MB', 'success')
          resolve()
        }).on('error', (err) => {
          this._addTaskLogByTaskId(taskId, '压缩失败', 'error')
          this._addTaskLogByTaskId(taskId, err, 'error')
          reject(err)
        })
        archive.on('error', (err) => {
          throw err // throw error
        })
        archive.pipe(output) // save file by pipe
        // append file and dir
        filterDir.forEach(file => {
          const filePath = join(targetDir, file)
          const stat = fs.statSync(filePath)
          if (stat.isDirectory()) {
            archive.directory(filePath, homeDirName + file)
          } else {
            archive.file(filePath, { name: file, prefix: homeDirName })
          }
        })
        archive.finalize() // make sure file stream write completely
      })
    },
    // filter exclude files in dir
    _filterExcludeFiles (targetDir, excludeFiles = []) {
      return fs.readdirSync(targetDir).filter(file => {
        return (!excludeFiles.includes(file))
      })
    },
    // 文件上传(ssh对象、配置信息、本地待上传文件)
    _uploadFile (ssh, localFile, serverFile, taskId) {
      return new Promise((resolve, reject) => {
        this._addTaskLogByTaskId(taskId, '⏳正在上传文件...')
        ssh.putFile(localFile, serverFile).then(() => {
          this._addTaskLogByTaskId(taskId, '文件上传完成', 'success')
          resolve()
        }, (err) => {
          this._addTaskLogByTaskId(taskId, '文件上传失败', 'error')
          this._addTaskLogByTaskId(taskId, err, 'error')
          reject(err)
        })
      })
    }
  }
}

export default taskMixin
