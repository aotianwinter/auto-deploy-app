// 文件上传(ssh对象、配置信息、本地待上传文件)
async function uploadFile (ssh, localFile, serverFile) {
  return new Promise((resolve, reject) => {
    ssh.putFile(localFile, serverFile).then(async () => {
      console.log('文件上传完成'.success)
      resolve()
    }, (err) => {
      console.log('文件上传失败！'.error, err)
      reject()
    })
  })
}

module.exports = uploadFile