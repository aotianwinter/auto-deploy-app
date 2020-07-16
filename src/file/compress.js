const fs = require('fs')
const archiver = require('archiver')

function compress (targetDir, localFile) {
  return new Promise((resolve, reject)=>{
    console.log(targetDir)
    console.log('正在压缩文件...')
    let output = fs.createWriteStream(localFile) // create file stream write
    const archive = archiver('zip', {
      zlib: { level: 9 } // set compress level
    })
    output.on('close', () => {
      resolve(
        console.log('压缩完成！共计 ' + (archive.pointer() / 1024 /1024).toFixed(3) + 'MB')
      )
    }).on('error', (err) => {
      reject(console.error('压缩失败', err))
    })
    archive.pipe(output) // save file by pipe
    archive.directory(targetDir, 'dist') // save target file and rename
    archive.finalize() // sure file stream write completely
  })
}

module.exports = compress
