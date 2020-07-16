const inquirer = require('inquirer')

const selectTip = 'project name:'
const options = [
  {
    type: 'list',
    name: selectTip,
    message: 'Which project do you want to deploy?',
    choices: []
    // new inquirer.Separator() // 分割线
  }
]

// 显示选择提示窗
function showHelper (config) {
  return new Promise((resolve, reject) => {
    initHelper(config) // init helper
    inquirer.prompt(options).then(answers => {
      resolve({ value: findInfoByName(config, answers[selectTip]) }) // 查找所选配置项
    }).catch((err) => {
      reject(console.error('helper显示或选择出错！'.error, err))
    })
  })
}

// init helper
function initHelper (config) {
  for (let item of config) {
    options[0].choices.push(item.name)
  }
  // 检查是否存在相同name
  if (new Set(options[0].choices).size !== options[0].choices.length) {
    console.error('请检查配置信息，存在相同name！'.warn)
    process.exit()
  }
}

// 查找符合条件的配置项
function findInfoByName (config, name) {
  for (let item of config) {
    if (item.name === name) {
      return item
    }
  }
}

module.exports = showHelper
