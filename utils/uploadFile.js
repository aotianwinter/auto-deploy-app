node_ssh = require('node-ssh')
ssh = new node_ssh()
runCommand = require ('./handleCommand')

async function uploadFile (config, localFile) {
  return new Promise((resolve, reject) => {
    console.log('4-开始文件上传')
    handleSourceFile(config)
    ssh.putFile(localFile, config.deployDir + config.targetFile).then(async () => {
      resolve(console.log('5-文件上传完成'))
    }, (err) => {
      reject(console.error('5-上传失败！', err))
    })
  })
}

// 处理源文件
async function handleSourceFile (config) {
  if (config.openBackUp) {
    console.log('已开启远端备份!')
    await runCommand(
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} ${config.releaseDir}_${new Date().getTime()}
      fi
      `,
      config.deployDir)
  } else {
    console.log('提醒：未开启远端备份!')
    await runCommand(
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} /tmp/${config.releaseDir}_${new Date().getTime()}
      fi
      `,
      config.deployDir)
  }
}

module.exports = uploadFile