node_ssh = require('node-ssh')
ssh = new node_ssh()

function connectServe (sshInfo) {
  return new Promise((resolve, reject) => {
    ssh.connect({ ...sshInfo }).then(() => {
      resolve(console.log('3-' + sshInfo.host + ' 连接成功'))
    }).catch((err) => {
      reject(console.error('3-' + sshInfo.host + ' 连接失败', err))
    })
  })
}

module.exports = connectServe