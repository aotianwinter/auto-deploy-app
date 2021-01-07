# auto-deploy-app

> An electron-vue app about auto deploy
> 
> 该项目持续更新中，欢迎提交 pr及issues 😘
> 
> 🎉Power Design By 打酱油

[Download](https://github.com/aotianwinter/auto-deploy-app/releases)

## 新版升级点
- 提供**可视化界面**，操作便捷
- 支持**服务器、执行任务、任务实例**的统一管理
- 支持任务实例的**快速修改、并行执行、重试、保存**
- 支持更加友好的信息展示（如：**任务耗时统计、任务状态记录**）
- 支持上传**文件、文件夹**
- 支持自定义本地**编译、清理命令**
- 支持**远端前置命令、后置命令**批量顺序执行
- 支持仅执行**远端前置命令**，用于触发某些自动化脚本

# How to use
## 查看使用帮助
- 点击查看使用帮助
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d457357a18243dea053a8e6a3821b06~tplv-k3u1fbpfcp-watermark.image)

## 创建任务并执行
- 创建服务器（支持密码、密钥）
![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5bbea08539a4ff7900a0219b73c1fbc~tplv-k3u1fbpfcp-watermark.image)

- 点击`Create Task`创建任务（本地编译-->上传文件夹-->编译并启动容器）
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5514b4370f514618bb53966511a2c541~tplv-k3u1fbpfcp-watermark.image)

- 任务结束后可保存
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/95b032c4278043f383b4aaa34ee77603~tplv-k3u1fbpfcp-watermark.image)

## 执行保存的任务实例
- 选择需要的任务点击运行
![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c9d66bd65625460ba28bc4346b28d38b~tplv-k3u1fbpfcp-watermark.image)

# Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload
npm run dev

# build electron application for production
npm run build
```
