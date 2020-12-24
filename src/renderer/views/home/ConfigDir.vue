<template>
  <div>
    <a-card title="Config Dir" style="width: 500px"
      :bodyStyle="{ height: '500px', 'overflow-y': 'auto'}">
      <template #extra>
        <a-icon @click="refreshTreeData" title="refresh" type="sync" />
        <a-icon @click="openDir" title="open folder" type="folder-open" />
      </template>
      <a-alert message="点击右上角文件夹可添加相关配置文件至当前文件夹，用于保存相关配置信息" type="info" />
      <a-directory-tree v-if="treeData" :tree-data="treeData" :load-data="onLoadData" :loadedKeys="loadedKeys">
      </a-directory-tree>
      <!-- empty -->
      <a-empty description="No File" v-else />
    </a-card>
  </div>
</template>

<script>
import { remote, shell } from 'electron'
const fs = require('fs')
const { join } = require('path')

export default {
  name: 'ConfigDir',
  data () {
    return {
      configDirPath: join(remote.app.getPath('userData'), '/Config Dir'),
      treeData: [],
      loadedKeys: []
    }
  },
  created () {
    this.refreshTreeData()
  },
  methods: {
    onLoadData (treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        let tempNode = treeNode
        let tempPath = ''
        while (tempNode.$parent && tempNode.title) {
          tempPath = '/' + tempNode.title + tempPath
          tempNode = tempNode.$parent
        }
        const dirItemArray = this.getDirItemArray(join(this.configDirPath, tempPath))
        if (dirItemArray.length === 0) {
          treeNode.dataRef.isLeaf = true
          treeNode.dataRef.icon = '📁'
          // TODO 自定义图标
        } else {
          treeNode.dataRef.children = dirItemArray
        }
        this.treeData = [...this.treeData]
        resolve()
      })
    },
    getDirItemArray (path) {
      let array = []
      const dir = fs.readdirSync(path)
      dir.map(item => {
        const temp = fs.statSync(join(path, '/', item))
        if (temp.isDirectory()) {
          array.push({ title: item, key: temp.ino, isLeaf: false })
        } else {
          array.push({ title: item, key: temp.ino, isLeaf: true })
        }
      })
      return array
    },
    refreshTreeData () {
      this.loadedKeys = []
      this.treeData = this.getDirItemArray(this.configDirPath)
    },
    openDir () {
      shell.openExternal(this.configDirPath)
    }
  }
}
</script>
<style lang="stylus" scoped>
.anticon
  margin-left 6px
  font-size 18px
</style>
