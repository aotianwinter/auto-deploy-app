require ('./src/terminal/color') // terminal color

const config = require ('./src/config/config')
const sshServer = require ('./src/ssh/ssh')

const helper = require ('./src/terminal/helper')
const backup = require ('./src/file/backup')
const compress = require ('./src/file/compress')
const uploadFile = require ('./src/utils/uploadFile')
const runCommand = require ('./src/ssh/handleCommand')

const dockerInspect = require ('./src/inspect/docker_inspect')
const getAbsolutePath = require ('./src/utils/path') // 获取绝对路径

// 主程序
async function main () {
  try {
    // console.log('请确保文件解压后为dist目录!!!')
    const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
    console.log(`您选择了部署 ${ SELECT_CONFIG.name }`.info)
    // get deploy dir name
    console.log(SELECT_CONFIG.targetDir.split('/')[SELECT_CONFIG.targetDir.split('/').length - 1])

    // const localFile =  __dirname + '/' + SELECT_CONFIG.targetFile // 待上传本地文件
    // SELECT_CONFIG.openCompress ? await compress(getAbsolutePath(SELECT_CONFIG.targetDir), localFile) : '' // 处理是否压缩
    // ssh连接
    await sshServer.connectServe(SELECT_CONFIG.ssh)
    // // 备份检查 --> 文件上传 --> 解压、修改、删除文件
    // await backup(sshServer.ssh, SELECT_CONFIG) // 根据配置决定是否备份
    // console.log('4- 开始文件上传')
    // await uploadFile(sshServer.ssh, localFile, SELECT_CONFIG.deployDir + SELECT_CONFIG.targetFile) // upload target file
    // await runCommand(sshServer.ssh, 'unzip ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // unzip
    // await runCommand(sshServer.ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir) // 修改文件名称
    // await runCommand(sshServer.ssh, 'rm -f ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 删除
    // docker环境检查 --> Dockerfile上传 --> build image
    // await dockerInspect(sshServer.ssh)
    const dockerFilePath = SELECT_CONFIG.deployDir + SELECT_CONFIG.releaseDir
    await uploadFile(sshServer.ssh, getAbsolutePath(SELECT_CONFIG.dockerFile), dockerFilePath + '/Dockerfile') // upload Dockerfile
    await runCommand(sshServer.ssh, 'docker build -t test/web:dev .', dockerFilePath)
  } catch (err) {
    console.log('部署过程出现错误！'.error, err)
  } finally {
    process.exit()
  }
}

// run main
main()
