require ('./src/terminal/color') // terminal color

const config = require ('./src/config/config')
const helper = require ('./src/terminal/helper')
const getAbsolutePath = require ('./src/utils/path') // 获取绝对路径

async function test () {
  const SELECT_CONFIG = (await helper(config)).value // 所选部署项目的配置信息
  // console.log(`您选择了部署 ${ SELECT_CONFIG.name }`.info)
  console.log(getAbsolutePath(SELECT_CONFIG.dockerFile))
}

test()