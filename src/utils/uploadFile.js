// 文件上传(ssh对象、配置信息、本地待上传文件)
async function uploadFile (ssh, localFile, serverFile) {
  return new Promise((resolve, reject) => {
    ssh.putFile(localFile, serverFile).then(async () => {
      resolve(console.log('文件上传完成'.success))
    }, (err) => {
      reject(console.log('文件上传失败！'.error, err))
    })
  })
}

module.exports = uploadFile