node_ssh = require('node-ssh')
ssh = new node_ssh()

function connectServe (config) {
  return new Promise((resolve, reject) => {
    ssh.connect({ ...config.ssh }).then(() => {
      resolve(console.log('3-' + config.ssh.host + ' 连接成功'))
    }).catch((err) => {
      reject(console.error('3-' + config.ssh.host + ' 连接失败', err))
    })
  })
}

module.exports = connectServe