require ('./src/terminal/color') // terminal color

const config = require ('./src/config/config')
const { ssh, connectServe } = require ('./src/ssh/ssh')

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
    console.log('请确保文件解压后为dist目录!!!'.error)  
    /* 
      部署 前期检查
      检查 配置信息 是否合格
    */
    console.log('1- 正在检查全局配置信息...'.bold)
    const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
    const {
      name,
      openCompress,
      deployDir,
      targetFile,
      targetDir,
      releaseDir,
      docker_file,
      docker_compose
    } = SELECT_CONFIG
    console.log(`您选择了部署 ${ name }`.info)
    /* 本地压缩 处理流程 */
    console.log('2- 文件本地压缩处理...'.bold)
    const localFile =  __dirname + '/' + targetFile // 待上传本地文件
    openCompress ? 
      await compress(getAbsolutePath(targetDir), localFile) :
      console.log('未开启本地压缩，已跳过'.warn) // 处理是否压缩
    /* ssh 连接 */
    console.log('3- 执行SSH连接'.bold)
    await connectServe(SELECT_CONFIG.ssh)
    /* 
      物理 部署流程
      备份检查 --> 文件上传 --> 解压、修改、删除文件
    */
    await backup(ssh, SELECT_CONFIG) // 根据配置决定是否备份
    console.log('4- 开始文件上传'.bold)
    await uploadFile(ssh, localFile, deployDir + targetFile) // upload target file
    await runCommand(ssh, 'unzip ' + targetFile, deployDir) // unzip
    await runCommand(ssh, 'mv dist ' + releaseDir, deployDir) // 修改文件名称
    await runCommand(ssh, 'rm -f ' + targetFile, deployDir) // clear zip file
    /* 
      docker 部署流程
      docker env check --> upload Dockerfile --> build image 
      upload docker-compose --> run docker-compose --> show container
    */
    await dockerInspect(ssh)
    const dockerFilePath = deployDir + releaseDir
    await uploadFile(ssh, getAbsolutePath(docker_file), dockerFilePath + '/Dockerfile') // upload Dockerfile
    console.log('5- 开始构建docker镜像...'.bold)
    //TODO 构建镜像需要可配
    await runCommand(ssh, 'docker build -t spa/web:spa .', dockerFilePath)
    await uploadFile(ssh, getAbsolutePath(docker_compose), dockerFilePath + '/docker-compose.yml') // upload Dockerfile
    console.log('6- 正在运行docker-compose...请耐心等待')
    await runCommand(ssh, 'docker-compose up -d', dockerFilePath)
    // 显示当前运行中容器
    console.log('7- 当前运行中的容器...'.bold)
    await runCommand(ssh, 'docker ps', dockerFilePath)
    console.log('🎉恭喜！部署成功🎉'.success)
  } catch (err) {
    console.log('部署过程出现错误！'.error, err)
  } finally {
    process.exit()
  }
}

// run main
main()
