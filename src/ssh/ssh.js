const node_ssh = require('node-ssh')
const ssh = new node_ssh()

// ssh connect
function connectServe (sshInfo) {
  return new Promise((resolve, reject) => {
    ssh.connect({ ...sshInfo }).then(() => {
      resolve(console.log(`${ sshInfo.host } 连接成功`.success))
    }).catch((err) => {
      reject(console.log(`${ sshInfo.host } 连接失败`.error, err))
    })
  })
}

module.exports = { ssh, connectServe }