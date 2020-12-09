import { mapState } from 'vuex'

const terminalMixin = {
  computed: {
    ...mapState({
      logs: state => state.terminal.logs
    })
  },
  methods: {
    _cleanLogs () {
      this.$store.commit('CLEAN_LOGS')
    },
    _addLogs (val) {
      this.$store.commit('ADD_LOGS', val)
    },
    // ssh connect (ssh对象、ssh连接信息)
    _connectServe (ssh, sshInfo) {
      this._addLogs('准备执行连接...')
      return new Promise((resolve, reject) => {
        ssh.connect({ ...sshInfo }).then(() => {
          // console.log(`${sshInfo.host}连接成功`)
          this._addLogs(`${sshInfo.host}连接成功`)
          resolve(true)
        }).catch(err => {
          // console.log(err, `${sshInfo.host}连接失败`)
          this._addLogs(`${sshInfo.host}连接失败`)
          this._addLogs(err)
          reject(err)
        })
      }).catch(e => {
        console.log(e)
      })
    },
    // run linux shell (ssh对象、shell指令、执行路径)
    _runCommand (ssh, command, path) {
      return new Promise((resolve, reject) => {
        ssh.execCommand(command, {
          cwd: path
        }).then((res) => {
          if (res.stdout) {
            console.log(command + ' 执行完成！')
            // console.log('stdout', res.stdout)
            resolve(res.stdout)
          } else {
            // console.log('stderr', res.stderr)
            console.log(command + ' 命令执行发生错误!')
            console.log('请检查远端环境中该命令是否有效！')
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

export default terminalMixin
