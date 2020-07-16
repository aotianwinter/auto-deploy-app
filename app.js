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
    console.log(`您选择了部署 ${ SELECT_CONFIG.name }`.info)

    const {
      deployDir
    } = SELECT_CONFIG
    // get deploy dir name
    // console.log(SELECT_CONFIG.targetDir.split('/')[SELECT_CONFIG.targetDir.split('/').length - 1])

    /* 本地压缩 处理流程 */
    console.log('2- 文件本地压缩处理...')
    const localFile =  __dirname + '/' + SELECT_CONFIG.targetFile // 待上传本地文件
    SELECT_CONFIG.openCompress ? 
      await compress(getAbsolutePath(SELECT_CONFIG.targetDir), localFile) :
      console.log('未开启本地压缩，已跳过'.warn) // 处理是否压缩
    /* ssh 连接 */
    await connectServe(SELECT_CONFIG.ssh)
    /* 
      物理 部署流程
      备份检查 --> 文件上传 --> 解压、修改、删除文件
    */
    await backup(ssh, SELECT_CONFIG) // 根据配置决定是否备份
    console.log('4- 开始文件上传')
    await uploadFile(ssh, localFile, SELECT_CONFIG.deployDir + SELECT_CONFIG.targetFile) // upload target file
    await runCommand(ssh, 'unzip ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // unzip
    await runCommand(ssh, 'mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir) // 修改文件名称
    await runCommand(ssh, 'rm -f ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // clear zip file
    /* 
      docker 部署流程
      docker env check --> upload Dockerfile --> build image 
      upload docker-compose --> run docker-compose --> show container
    */
    await dockerInspect(ssh)
    const dockerFilePath = SELECT_CONFIG.deployDir + SELECT_CONFIG.releaseDir
    await uploadFile(ssh, getAbsolutePath(SELECT_CONFIG.docker_file), dockerFilePath + '/Dockerfile') // upload Dockerfile
    console.log('5- 开始构建docker镜像...')
    await runCommand(ssh, 'docker build -t test/web:dev .', dockerFilePath)
    await uploadFile(ssh, getAbsolutePath(SELECT_CONFIG.docker_compose), dockerFilePath + '/docker-compose.yml') // upload Dockerfile
    console.log('6- 正在运行docker-compose...请耐心等待')
    await runCommand(ssh, 'docker-compose up -d', dockerFilePath)
    // 显示当前运行中容器
    console.log('当前运行中的容器：')
    await runCommand(ssh, 'docker ps', dockerFilePath)
  } catch (err) {
    console.log('部署过程出现错误！'.error, err)
  } finally {
    process.exit()
  }
}

// run main
main()
