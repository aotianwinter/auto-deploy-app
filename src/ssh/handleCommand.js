// run linux shell (ssh对象、shell指令、执行路径)
function runCommand (ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.stderr) {
        reject(console.log('命令执行发生错误'.error + res.stderr))
        console.log('请检查远端环境中该命令是否有效！'.warn)
        process.exit()
      } else {
        resolve(console.log(command + '执行完成！'.success))
      }
    })
  })
}

module.exports = runCommand
