const fs = require('fs')
const archiver = require('archiver')
const join = require('path').join

function compress (targetDir, localFile, excludeFiles, homeDirName = 'web/') {
  return new Promise((resolve, reject)=>{
    // filter exclude files
    const filterDir = filterExcludeFiles(targetDir, excludeFiles)
    console.log('正在压缩文件...')
    let output = fs.createWriteStream(localFile) // create file stream write
    const archive = archiver('zip', {
      zlib: { level: 9 } // set compress level
    })
    output.on('close', () => {
      console.log('压缩完成！共计 ' + (archive.pointer() / 1024 /1024).toFixed(3) + 'MB')
      resolve('Compression complete')
    }).on('error', (err) => {
      console.error('压缩失败', err)
      reject('Compression failed')
    })
    archive.on('error', (err) => {
      throw err
    })
    archive.pipe(output) // save file by pipe
    // append file and dir
    filterDir.forEach(file => {
      const filePath = join(targetDir, file)
      const stat = fs.statSync(filePath)
      if (stat.isDirectory()) {
        archive.directory(filePath, homeDirName + file)
      } else {
        archive.file(filePath, { name: file, prefix: homeDirName })
      }
    })
    archive.finalize() // make sure file stream write completely
  })
}

// filter exclude files
function filterExcludeFiles (targetDir, excludeFiles = []) {
  return fs.readdirSync(targetDir).filter(file => {
    return (!excludeFiles.includes(file))
  })
}

module.exports = compress
