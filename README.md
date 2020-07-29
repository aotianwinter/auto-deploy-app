# my-auto-deploy
🎉Power Design By 打酱油🎉
## 项目简介

> 该项目是基于`node`实现，支持前端项目进行legacy、docker、docker-compose多种方式的远端自动化部署。

该项目持续更新中，欢迎提交 `pr`及`issues` 😘

**更新：**
- 🎉现已支持legacy、docker、docker-compose三种部署方式
- 🎉现已支持 **上传编译后代码部署**、**上传前端源码远端编译部署**两种方式
（ps：远端编译仅支持docker模式）
- 现已支持多配置信息，支持部署时选择项目、部署方式、上传编译方式
- 现已支修改服务器连接端口，支持ssh私钥及解密密码连接
- 现已支持远端备份，时间格式后缀 `yyyy-MM-dd_HH:mm:ss`

## 支持
|部署方式|legacy|docker|docker-compose|
|-------|:----:|:----:|:------------:|
|本地打包编译dist🔶| ✔|   ✔ |    ✔  |
|源码远端打包编译🔷|❌|   ✔ |    ✔  |

## 说明
配置文件(`src/config/config.js`)

🔶上传本地编译后文件夹 (dist)

🔷上传源码远端打包编译 (source)

部署方式说明：
- legacy（物理部署）
  - 请将文件上传至`nginx`配置对应目录
- docker
  - 端口修改请参照`配置文件` --> ports
  - 🔶上传dist请参照`配置文件` --> docker_file
  - 🔷上传source请参照`配置文件` --> docker_file__build
  - 🔷source中无需上传文件过滤请参照`配置文件` --> exclude
  - 其他需求可自行修改对应`Dockerfile`
- docker-compose
  - `docker-compose.yml`中容器名、镜像名请保持与`配置文件`一致
  - 端口修改请参照`docker-compose.yml` --> ports
  - 其他需求可自行修改对应`docker-compose.yml`

## 使用
Tip：请确保已安装node、npm
```bash
npm install # 安装依赖
npm run deploy # 本地运行
```

使用流程：
> 选择项目-->选择部署方式-->选择上传源码or编译后代码-->远端自动部署

## 优点
- 轻量、便捷、高效
- 支持legacy、docker、docker-compose多种方式自动部署
- 支持 多项目管理、多方式连接、本地压缩、远端备份等

## 配置文件说明
```js
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
    name: '临时测试',
    ssh: {
      host: '120.26.51.81',
      port: 22,
      username: 'root',
      password: 'Zheng668449',
      // privateKey: 'E:/id_rsa', // ssh私钥(不使用注释即可)
      // passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    openBackUp: true, // 是否开启远端备份
    deployDir: '/app' + '/', // 远端部署目录
    releaseDir: 'spa-web', // 发布目录（最终发布目录为/app/spa-app）
    distDir: 'E:/Private/my-picture-online/dist', // web编译后目录🔶
    // 以下为docker模式下使用配置
    docker_file: './Dockerfile_nginx/Dockerfile', // Dockerfile文件位置🔶
    sourceDir: 'E:/Private/my-picture-online', // web源码目录🔷
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
```

## 示例
