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
更新：
  🎉现已支持添加多个配置信息，自动化部署时支持选择配置信息运行
  🎉现已支修改服务器连接端口，支持ssh私钥及解密密码连接（ps：不使用此方法时，请注释privateKey）
  🎉现已更新模块引用逻辑，远端备份时间格式改为 `yyyy-MM-dd_HH:mm:ss`
  */

const config = [
  {
    name: '临时测试',
    ssh: {
      host: '120.26.51.81',
      port: 22,
      username: 'root',
      password: 'Zheng668449',
      // privateKey: 'E:/id_rsa', // ssh私钥(不使用此方法时请勿填写 注释即可)
      // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    targetDir: 'E:/Private/my-picture-online/dist', // 源码目录 (可使用相对地址)
    exclude: [
      'node_modules/'
    ],
    targetFile: 'dist.zip', // 目标文件 (对应项目根目录下文件)
    openCompress: false, // 是否开启本地压缩
    openBackUp: true, // 是否开启远端备份
    deployDir: '/app' + '/', // 远端目录
    releaseDir: 'SPA_test', // 发布目录（最终发布目录为/app/SPA_test）
    docker_file: './Dockerfile', // docker文件位置
    image_name: 'spa/web:spa', // 编译后的镜像名（web:dev）
    port: '8800:80', // 端口号映射（宿主机：内部（与配置文件对应，默认80），确保宿主机端口号可正常访问）
    docker_compose: './docker-compose.yml', // docker-compose文件位置
    container_name: 'spa_web'
  }
]

module.exports = config
