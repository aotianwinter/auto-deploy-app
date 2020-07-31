require ('./terminal/color') // terminal color

const config = require ('./config/config')
const { ssh, connectServe } = require ('./ssh/ssh')

const { projectHelper, deployModeHelper, buildModeHelper } = require ('./terminal/helper')
const backup = require ('./file/backup')
const compress = require ('./file/compress')
const uploadFile = require ('./utils/uploadFile')
const runCommand = require ('./ssh/handleCommand')

const getAbsolutePath = require ('./utils/path') // 获取绝对路径

// 主程序
async function main () {
  try {
    // 部署前检查 配置信息是否合格
    console.log('1- 正在检查全局配置信息...'.bold)
    const SELECT_CONFIG = (await projectHelper(config)).value // 所选部署项目的配置信息
    const {
      name,
      deployDir,
      distDir,
      sourceDir,
      exclude,
      releaseDir,
      docker_file,
      docker_file__build,
      image,
      ports,
      docker_compose,
      container_name
    } = SELECT_CONFIG
    console.log(`您选择了部署 ${ name }`.info)
    const DEPLOY__MODE = await deployModeHelper(config)
    console.log(`您选择了 ${ DEPLOY__MODE } 部署方式`.info)
    const BUILD__MODE = DEPLOY__MODE === 'legacy' ? 'dist' : await buildModeHelper(config)
    console.log(BUILD__MODE === 'dist' ? '您选择了 上传构建后的代码 dist 进行部署'.info : '您选择了 上传源码source(远端进行构建并部署)'.info)
    /* 本地压缩 处理流程 */
    console.log('2- 文件本地压缩处理...'.bold)
    const zipFile = BUILD__MODE === 'dist' ? 'dist.zip' : 'source.zip' // 获取上传文件的具体名称
    const localFile =  __dirname + '/' + zipFile // 待上传本地文件
    BUILD__MODE === 'dist' ?
      await compress(getAbsolutePath(distDir), localFile)
      : await compress(getAbsolutePath(sourceDir), localFile, exclude)
    // ssh 连接
    console.log('3- 执行SSH连接'.bold)
    await connectServe(SELECT_CONFIG.ssh)
    // 部署前检查： 备份检查 --> 文件上传
    console.log('4- 执行部署前检查流程'.bold)
    await backup(ssh, SELECT_CONFIG) // 根据配置决定是否备份
    await uploadFile(ssh, localFile, deployDir + zipFile) // upload target file
    // 物理部署 解压、修改、删除文件
    await runCommand(ssh, 'unzip ' + zipFile, deployDir) // unzip
    try {
      await runCommand(ssh, 'mv web ' + releaseDir, deployDir) // 修改文件名称
    } catch {
      console.log('可忽略：发布目录与解压后目录相同'.warn)
    }
    await runCommand(ssh, 'rm -f ' + zipFile, deployDir) // clear zip file
    if (DEPLOY__MODE === 'legacy') {
      console.log(`恭喜！${ name }部署成功`.success)
      return
    }
    // docker流程
    // docker 部署流程 docker env check --> upload Dockerfile --> build image
    const dockerFilePath = deployDir + releaseDir
    await runCommand(ssh, `docker -v`, '/')
    await uploadFile(ssh, getAbsolutePath(BUILD__MODE === 'dist' ? docker_file : docker_file__build), dockerFilePath + '/Dockerfile') // upload Dockerfile
    console.log('5- 开始构建docker镜像...请耐心等待'.bold)
    await runCommand(ssh, `docker build -t ${ image } .`, dockerFilePath)
    console.log('6- 准备启动docker容器...请耐心等待')
    if (DEPLOY__MODE === 'docker') {
      if ((await runCommand(ssh, `docker ps -f name=${ container_name }`)).indexOf('\n') !== -1) {
        console.log('存在同名容器，正在删除同名容器...')
        await runCommand(ssh, `docker stop ${ container_name }`, '')
        await runCommand(ssh, `docker rm ${ container_name }`, '')
      }
      await runCommand(ssh, `docker run --name ${container_name} -p ${ports} -d ${image}`, dockerFilePath)
    } else {
      // docker-compose 部署流程 upload docker-compose --> run docker-compose --> show container
      await runCommand(ssh, `docker-compose -v`, '/')
      await uploadFile(ssh, getAbsolutePath(docker_compose), dockerFilePath + '/docker-compose.yml') // upload docker-compose
      if ((await runCommand(ssh, `docker ps -f name=${ container_name }`)).indexOf('\n') !== -1) {
        console.log('存在同名容器，正在删除同名容器...')
        await runCommand(ssh, `docker stop ${ container_name }`, '')
        await runCommand(ssh, `docker rm ${ container_name }`, '')
      }
      await runCommand(ssh, 'docker-compose up -d', dockerFilePath)
    }
    // 显示当前运行中容器
    console.log('7- 当前运行中的容器...'.bold)
    await runCommand(ssh, 'docker ps', dockerFilePath)
    console.log(`恭喜！${ name }部署成功`.success)
  } catch (err) {
    console.log('部署过程出现错误！'.error, err)
  } finally {
    process.exit()
  }
}

// run main
main()
