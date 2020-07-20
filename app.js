require ('./src/terminal/color') // terminal color

const config = require ('./src/config/config')
const { ssh, connectServe } = require ('./src/ssh/ssh')

const { projectHelper, deployModeHelper } = require ('./src/terminal/helper')
const backup = require ('./src/file/backup')
const compress = require ('./src/file/compress')
const uploadFile = require ('./src/utils/uploadFile')
const runCommand = require ('./src/ssh/handleCommand')

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
    const SELECT_CONFIG = (await projectHelper(config)).value // 所选部署项目的配置信息
    const {
      name,
      openCompress,
      deployDir,
      targetFile,
      targetDir,
      releaseDir,
      docker_file,
      image_name,
      port,
      docker_compose,
      container_name
    } = SELECT_CONFIG
    console.log(`您选择了部署 ${ name }`.info)
    const DEPLOY__MODE = await deployModeHelper(config)
    console.log(`您选择了 ${ DEPLOY__MODE } 部署方式`.info)
    /* 本地压缩 处理流程 */
    console.log('2- 文件本地压缩处理...'.bold)
    const localFile =  __dirname + '/' + targetFile // 待上传本地文件
    openCompress ? 
      await compress(getAbsolutePath(targetDir), localFile) :
      console.log('未开启本地压缩，已跳过'.warn) // 处理是否压缩
    // ssh 连接
    console.log('3- 执行SSH连接'.bold)
    await connectServe(SELECT_CONFIG.ssh)
    // 部署前检查： 备份检查 --> 文件上传
    console.log('4- 执行部署前检查流程'.bold)
    await backup(ssh, SELECT_CONFIG) // 根据配置决定是否备份
    await uploadFile(ssh, localFile, deployDir + targetFile) // upload target file
    // 物理部署 解压、修改、删除文件
    await runCommand(ssh, 'unzip ' + targetFile, deployDir) // unzip
    await runCommand(ssh, 'mv dist ' + releaseDir, deployDir) // 修改文件名称
    await runCommand(ssh, 'rm -f ' + targetFile, deployDir) // clear zip file
    if (DEPLOY__MODE === 'legacy') return
    // docker流程
    // docker 部署流程 docker env check --> upload Dockerfile --> build image
    const dockerFilePath = deployDir + releaseDir
    await runCommand(ssh, `docker -v`, '/')
    await uploadFile(ssh, getAbsolutePath(docker_file), dockerFilePath + '/Dockerfile') // upload Dockerfile
    console.log('5- 开始构建docker镜像...请耐心等待'.bold)
    await runCommand(ssh, `docker build -t ${ image_name } .`, dockerFilePath)
    await uploadFile(ssh, getAbsolutePath('./default.conf'), dockerFilePath + '/default.conf') // upload Dockerfile
    if (DEPLOY__MODE === 'docker') {
      if (await runCommand(ssh, `docker ps -f name=${ container_name }`)) {
        console.log('存在同名容器，正在删除同名容器...')
        await runCommand(ssh, `docker stop ${ container_name }`, '')
        await runCommand(ssh, `docker rm ${ container_name }`, '')
      }
      await runCommand(ssh, `docker run --name ${container_name} -p ${port} -v ${dockerFilePath}/default.conf:/etc/nginx/conf.d/default.conf -d ${image_name}`, dockerFilePath)
    } else {
      // docker-compose 部署流程 upload docker-compose --> run docker-compose --> show container
      await runCommand(ssh, `docker-compose -v`, '/')
      await uploadFile(ssh, getAbsolutePath(docker_compose), dockerFilePath + '/docker-compose.yml') // upload docker-compose
      console.log('6- 正在运行docker-compose...请耐心等待')
      if (await runCommand(ssh, `docker ps -f name=${ container_name }`)) {
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
