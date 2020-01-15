# my-auto-deploy

## 项目简介

> 该项目是基于`node`实现，对简单前端工程实现自动化部署至远端服务器指定目录。

优点：
  - 轻量、便捷
  - 可调节 本地压缩、远端备份

## 使用

Tip: 请确保已安装node、npm
```bash
npm install # 安装依赖
npm run deploy # 本地运行
```

**配置文件说明：**
```js
/*
说明：
  请确保解压后的文件目录为dist
  ssh: 连接服务器用户信息
  targetDir: 需要压缩的文件目录（需开启压缩）
  targetFile: 指定上传文件名称（该文件同级目录）
  openCompress: 关闭后，将跳过目标目录压缩步骤，直接上传指定文件
  openBackUp: 开启后，若远端存在相同目录，则会修改原始目录名称，不会直接覆盖
  deployDir: 指定远端部署地址
  releaseDir: 指定远端部署地址下的发布目录名称
*/

// 需要压缩的文件目录(可使用相对地址 当前目录使用 '.' 即可)
const prefix = 'E:/programs/NewGitLab/seeta-device-community'
// const prefix = '.'

const config = {
  ssh: {
    host: '192.168.0.110',
    username: 'root',
    password: 'root'
  },
  targetDir: prefix + '/utils', // 目标目录
  targetFile: 'dist.zip', // 目标文件
  openCompress: true, // 是否开启压缩
  openBackUp: true, // 是否开启远端备份
  deployDir: '/home/node_test' + '/', // 远端目录
  releaseDir: 'web' // 发布目录
}
```

🎉Power Design By 打酱油🎉
