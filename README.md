# my-auto-deploy
🎉Power Design By 打酱油🎉
## 项目简介

> 该项目是基于`node`实现，对简单前端工程实现自动化部署至远端服务器指定目录。

**更新：**
🎉现已支持添加多个配置信息，自动化部署时支持选择配置信息运行

优点：
  - 轻量、便捷
  - 可调节 本地压缩、远端备份

持续更新中，欢迎提交 `issues` 😘

## 使用

Tip: 请确保已安装node、npm
```bash
npm install # 安装依赖
npm run deploy # 本地运行
```

## 示例
**1. 待部署工程本地完成打包构建**

![本地打包构建目录](https://upload-images.jianshu.io/upload_images/16708123-33f19b914e73c3bc.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**2. 确定远端部署目录及发布文件夹**

![远端部署目录](https://upload-images.jianshu.io/upload_images/16708123-ab32ab9c74fa0097.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**3. 修改配置**

![修改配置文件](https://upload-images.jianshu.io/upload_images/16708123-2a9c99dd4e7e032c.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**4. 运行自动化部署**

![选择配置信息](https://upload-images.jianshu.io/upload_images/16708123-cb9cafd23d9af3ac.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![自动化部署](https://upload-images.jianshu.io/upload_images/16708123-8b616e635b1d8ff6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**5. 查看远端效果**

![远端部署目录](https://upload-images.jianshu.io/upload_images/16708123-0142fbe7b8ef9bc6.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

**6. 再次部署 原目录已备份（开启远端备份生效）**

![远端部署目录](https://upload-images.jianshu.io/upload_images/16708123-ad5f1c9f130abf74.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 配置文件说明
```js
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
*/

const config = [
  {
    name: '项目A-dev',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root'
    },
    targetDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
    targetFile: 'dist.zip', // 目标文件
    openCompress: true, // 是否开启本地压缩
    openBackUp: true, // 是否开启远端备份
    deployDir: '/home/node_test' + '/', // 远端目录
    releaseDir: 'web' // 发布目录
  },
  {
    name: '项目A-prod',
    ssh: {
      host: '192.168.0.110',
      port: 22,
      username: 'root',
      password: 'root'
    },
    targetDir: 'E:/private/my-vue-cli/dist', // 目标压缩目录(可使用相对地址)
    targetFile: 'dist.zip', // 目标文件
    openCompress: true, // 是否开启本地压缩
    openBackUp: true, // 是否开启远端备份
    deployDir: '/home/node_test' + '/', // 远端目录
    releaseDir: 'web2' // 发布目录
  }
]
```
