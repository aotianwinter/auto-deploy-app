const runCommand = require ('../ssh/handleCommand')

async function dockerInspect (ssh) {
  await runCommand(ssh, `docker -v`, '/')
  await runCommand(ssh, `docker-compose -v`, '/')
}

module.exports = dockerInspect