const runCommand = require ('../ssh/handleCommand')

async function dockerInspect (ssh) {
  await runCommand(ssh, `docker -v`, '/')
  console.log('docker 环境正常'.success)
  await runCommand(ssh, `docker-compose -v`, '/')
  console.log('docker-compose 环境正常'.success)
}

module.exports = dockerInspect