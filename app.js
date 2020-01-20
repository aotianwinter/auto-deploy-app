config = require ('./config')
helper = require ('./utils/helper')
compressFile = require ('./utils/compressFile')
connectServe = require ('./utils/ssh')
uploadFile = require ('./utils/uploadFile')
runCommand = require ('./utils/handleCommand')

// 可单独执行
async function main () {
  console.log('请确保文件解压后为dist目录!!!')
  const SELECT_CONFIG = (await helper(config)).value
  console.log('您选择了部署 ' + SELECT_CONFIG.name)
  const localFile =  __dirname + '/' + SELECT_CONFIG.targetFile // 待上传本地文件
  SELECT_CONFIG.openCompress ? await compressFile(SELECT_CONFIG.targetDir, localFile) : '' //压缩
  await connectServe(SELECT_CONFIG.ssh) // 连接
  await uploadFile(SELECT_CONFIG, localFile) // 上传
  await runCommand('unzip ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 解压
  await runCommand('mv dist ' + SELECT_CONFIG.releaseDir, SELECT_CONFIG.deployDir) // 修改文件名称
  await runCommand('rm -f ' + SELECT_CONFIG.targetFile, SELECT_CONFIG.deployDir) // 删除
  process.exit()
}

// run main
main()
