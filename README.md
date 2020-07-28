# my-auto-deploy
🎉Power Design By 打酱油🎉
## 项目简介

> 该项目是基于`node`实现，支持前端项目进行legacy、docker、docker-compose多种方式的远端自动化部署。

该项目持续更新中，欢迎提交 `pr`及`issues` 😘

**更新：**
- 🎉现已支持legacy、docker、docker-compose三种部署方式
- 现已支持添加多个配置信息，自动化部署时支持选择配置信息运行
- 现已支修改服务器连接端口，支持ssh私钥及解密密码连接（ps：不使用此方法时，请注释privateKey）
- 现已支持远端备份，时间格式改为 `yyyy-MM-dd_HH:mm:ss`

## 说明
部署方式说明：
- legacy（物理部署），请将文件上传至nginx配置目录。
- docker，端口修改请参照对应项目的Dockerfile的内外映射端口配置。
- docker-compose，端口修改请参照对应项目的Dockerfile的内外映射端口配置，运行关联容器请修改`docker-compose.yml`文件。

优点：
  - 轻量、便捷、高效
  - 支持legacy、docker、docker-compose多种方式自动部署
  - 支持 多项目管理、多方式连接、本地压缩、远端备份等

## 支持
|部署方式|legacy|docker|docker-compose|
|-------|:----:|:----:|:------------:|
|源码远端打包编译|❌|   ✔ |     ✔    |
|本地打包编译dist| ✔|   ✔ |     ✔    |

## 使用

> Tip：请确保已安装node、npm
```bash
npm install # 安装依赖
npm run deploy # 本地运行
```

## 示例

## 配置文件说明
```js
/*
config.js
说明：
  请确保解压后的文件目录为dist
  ssh: 连接服务器用户信息
  distDir: 需要压缩的文件目录（启用本地压缩后生效）
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
    name: '项目A-dev',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root',
      privateKey: 'E:/id_rsa', // ssh私钥(不使用此方法时请勿填写， 注释即可)
      passphrase: '123456' // ssh私钥对应解密密码(不存在设为''即可)
    },
    distDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
    openBackUp: true, // 是否开启远端备份
    deployDir: '/home/node_test' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  }
]
```
