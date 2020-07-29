const runCommand = require ('../ssh/handleCommand')
const getCurrentTime = require ('../utils/handleTime')

// 处理源文件(ssh对象、配置信息)
async function backup (ssh, config) {
  const { openBackUp, releaseDir, deployDir } = config
  if (openBackUp) {
    console.log('已开启远端备份!')
    await runCommand(
      ssh,
      `
      if [ -d ${releaseDir} ];
      then mv ${releaseDir} ${releaseDir}_${getCurrentTime()}
      fi
      `,
      deployDir)
  } else {
    console.log('提醒：未开启远端备份!'.warn)
    await runCommand(
      ssh,
      `
      if [ -d ${releaseDir} ];
      then mv ${releaseDir} /tmp/${releaseDir}_${getCurrentTime()}
      fi
      `,
      deployDir)
  }
}

module.exports = backup