const runCommand = require ('../ssh/handleCommand')
const getCurrentTime = require ('../utils/handleTime')

// 处理源文件(ssh对象、配置信息)
async function backup (ssh, config) {
  if (config.openBackUp) {
    console.log('已开启远端备份!')
    await runCommand(
      ssh,
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} ${config.releaseDir}_${getCurrentTime()}
      fi
      `,
      config.deployDir)
  } else {
    console.log('提醒：未开启远端备份!'.warn)
    await runCommand(
      ssh,
      `
      if [ -d ${config.releaseDir} ];
      then mv ${config.releaseDir} /tmp/${config.releaseDir}_${getCurrentTime()}
      fi
      `,
      config.deployDir)
  }
}

module.exports = backup