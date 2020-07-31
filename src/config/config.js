/*
config.js
🔶上传本地编译后文件夹 (dist)
🔷上传源码远端打包编译 (source)
说明：
  name: 项目名称
  ssh: 连接服务器信息
  openBackUp: 是否开启远端备份
  deployDir: 远端部署目录
  releaseDir: 发布目录
  distDir: web编译后目录🔶
  docker_file: Dockerfile文件位置🔶
  sourceDir: web源码目录(云端代码编译使用，仅支持docker模式)🔷
  exclude: 源码目录中排除上传文件 🔷
  docker_file__build: 支持源码编译Dockerfile文件位置🔷
  image: 编译后镜像名
  ports: 端口映射（宿主机:内部，请确保宿主机端口已开放）
  container_name: 容器名称
  docker_compose: docker-compose文件位置
  端口修改请参照`docker-compose.yml` --> ports
  `docker-compose.yml`中容器名、镜像名请保持与`配置文件`一致
更新：
  - 🎉现已支持legacy、docker、docker-compose三种部署方式
  - 🎉现已支持 **上传编译后代码部署**、**上传前端源码远端编译部署**两种方式
  （ps：远端编译仅支持docker模式）
  - 现已支持多配置信息，支持部署时选择项目、部署方式、上传编译方式
  - 现已支修改服务器连接端口，支持ssh私钥及解密密码连接
  - 现已支持远端备份，时间格式后缀 `yyyy-MM-dd_HH:mm:ss`
  */

const config = [
  {
    name: '示例项目',
    ssh: {
      host: '120.26.51.81',
      port: 22,
      username: 'root',
      password: 'xx',
      // privateKey: 'E:/id_rsa', // ssh私钥(不使用注释即可)
      // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    openBackUp: true, // 是否开启远端备份
    deployDir: '/app' + '/', // 远端部署目录
    releaseDir: 'spa-web', // 发布目录（最终发布目录为/app/spa-app）
    distDir: 'E:/XX/dist', // web编译后目录🔶
    // 以下为docker模式下使用配置
    docker_file: './Dockerfile_nginx/Dockerfile', // Dockerfile文件位置🔶
    sourceDir: 'E:/XX', // web源码目录🔷
    exclude: [ //  源码目录中 默认排除上传 node_modules, dist, .git🔷
      'node_modules',
      'dist',
      '.git',
    ],
    docker_file__build: './Dockerfile_node_nginx/Dockerfile', // 支持源码编译Dockerfile文件位置🔷
    image: 'spa/web:dev', // 编译后镜像名
    ports: '8800:80', // 端口映射（宿主机:内部，请确保宿主机端口已开放）
    container_name: 'spa_web', // 容器名称
    docker_compose: './docker-compose.yml' // docker-compose文件位置
    // 端口修改请参照`docker-compose.yml` --> ports
    // `docker-compose.yml`中容器名、镜像名请保持与`配置文件`一致
  }
]

module.exports = config
