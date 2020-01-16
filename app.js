config = require ('./config')
compressFile = require ('./utils/compressFile')
connectServe = require ('./utils/ssh')
uploadFile = require ('./utils/uploadFile')
runCommand = require ('./utils/handleCommand')

// 可单独执行
async function main () {
  const localFile =  __dirname + '/' + config.targetFile
  config.openCompress ? await compressFile(config.targetDir, localFile) : '' //压缩
  await connectServe(config.ssh) // 连接
  await uploadFile(config, localFile) // 上传
  await runCommand('unzip ' + config.targetFile, config.deployDir) // 解压
  await runCommand('mv dist ' + config.releaseDir, config.deployDir) // 修改文件名称
  await runCommand('rm -f ' + config.targetFile, config.deployDir) // 删除
  console.log('所有操作完成！')
  process.exit()
}
// run main
main()
