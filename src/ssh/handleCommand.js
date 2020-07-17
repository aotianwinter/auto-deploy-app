// run linux shell (ssh对象、shell指令、执行路径)
function runCommand (ssh, command, path) {
  return new Promise((resolve, reject) => {
    ssh.execCommand(command, {
      cwd: path
    }).then((res) => {
      if (res.code === 0) {
        console.log(res.stdout)
        console.log(command + ' 执行完成！'.success)
        resolve(true)
      } else {
        console.log(command + ' 命令执行发生错误'.error)
        console.log(res.stderr)
        console.log('请检查远端环境中该命令是否有效！'.warn)
        reject('false')
      }
    })
  })
}

module.exports = runCommand
