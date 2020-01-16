/*
config.js
说明：
  请确保解压后的文件目录为dist
  ssh: 连接服务器用户信息
  targetDir: 需要压缩的文件目录（启用本地压缩后生效）
  targetFile: 指定上传文件名称（config.js同级目录）
  openCompress: 关闭后，将跳过本地文件压缩，直接上传同级目录下指定文件
  openBackUp: 开启后，若远端存在相同目录，则会修改原始目录名称，不会直接覆盖
  deployDir: 指定远端部署地址
  releaseDir: 指定远端部署地址下的发布目录名称
*/

const config = {
  ssh: {
    host: '192.168.0.110',
    username: 'root',
    password: 'root'
  },
  targetDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
  targetFile: 'dist.zip', // 目标文件
  openCompress: true, // 是否开启本地压缩
  openBackUp: true, // 是否开启远端备份
  deployDir: '/home/node_test' + '/', // 远端目录
  releaseDir: 'web' // 发布目录
}

module.exports = config
