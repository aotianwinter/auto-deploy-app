require ('./src/terminal/color') // terminal color

const config = require ('./src/config/config')
const sshServer = require ('./src/ssh/ssh')

const helper = require ('./src/terminal/helper')
const compressFile = require ('./src/utils/compressFile')
const uploadFile = require ('./src/utils/uploadFile')
const runCommand = require ('./src/ssh/handleCommand')

const dockerInspect = require ('./src/inspect/docker_inspect')

// 主程序
async function main () {
  try {
    // console.log('请确保文件解压后为dist目录!!!')
    const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
    console.log(`您选择了部署 ${ SELECT_CONFIG.name }`.info)
    // get deploy dir name
    console.log(SELECT_CONFIG.targetDir.split('/')[SELECT_CONFIG.targetDir.split('/').length - 1])

    // const localFile =  __dirname + '/' + SELECT_CONFIG.targetFile // 待上传本地文件
    // await compressFile(SELECT_CONFIG.targetDir, localFile)
    // // SELECT_CONFIG.openCompress ? await compressFile(SELECT_CONFIG.targetDir, localFile) : '' // 处理是否压缩

    await sshServer.connectServe(SELECT_CONFIG.ssh) // connect ssh
    // await uploadFile(sshServer.ssh, SELECT_CONFIG, localFile) // upload target file
    // await runCommand(sshServer.ssh, 'unzip ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // unzip

    // await runCommand(sshServer.ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir) // 修改文件名称
    // await runCommand(sshServer.ssh, 'rm -f ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 删除
    await dockerInspect(sshServer.ssh) // docker inspect
  } catch (err) {
    console.log('部署过程出现错误！'.error, err)
  } finally {
    process.exit()
  }
}

// run main
main()
