const inquirer = require('inquirer')
// 项目选择
const selectProjectName = 'PROJECT_NAME'
const projectOptions = [
  {
    type: 'list',
    name: selectProjectName,
    message: 'Which project do you want to deploy?',
    choices: []
  }
]
// 部署方式选择
const selectDeployMode = 'DEPLOY_TYPE'
const deployModeOptions = [
  {
    type: 'list',
    name: selectDeployMode,
    message: 'Which deployment mode do you want to use?',
    choices: [
      { name: 'legacy' },
      { name: 'docker' },
      { name: 'docker-compose' }
    ]
  }
]
// 云端编译选择
const selectBuildMode = 'BUILD_MODE'
const buildModeOptions = [
  {
    type: 'list',
    name: selectBuildMode,
    message: 'Which dir do you want to upload?',
    choices: [
      { name: 'source' },
      { name: 'dist' }
    ]
  }
]

// 项目选择提示窗
function projectHelper (config) {
  return new Promise((resolve, reject) => {
    initHelper(config) // init helper
    inquirer.prompt(projectOptions).then(answers => {
      resolve({ value: findInfoByName(config, answers[selectProjectName]) }) // 查找所选配置项
    }).catch((err) => {
      reject(console.error('helper显示或选择出错！'.error, err))
    })
  })
}

// 部署方式选择提示窗
function deployModeHelper () {
  return new Promise((resolve, reject) => {
    inquirer.prompt(deployModeOptions).then(answers => {
      resolve(answers[selectDeployMode])
    }).catch((err) => {
      reject(console.error('helper显示或选择出错！'.error, err))
    })
  })
}

// 远端源码编译提示窗
function buildModeHelper () {
  return new Promise((resolve, reject) => {
    inquirer.prompt(buildModeOptions).then(answers => {
      resolve(answers[selectBuildMode])
    }).catch((err) => {
      reject(console.error('helper显示或选择出错！'.error, err))
    })
  })
}

// init helper
function initHelper (config) {
  for (let item of config) {
    projectOptions[0].choices.push(item.name)
  }
  // 检查是否存在相同name
  if (new Set(projectOptions[0].choices).size !== projectOptions[0].choices.length) {
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

module.exports = { projectHelper, deployModeHelper, buildModeHelper }
