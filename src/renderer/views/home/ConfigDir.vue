<template>
  <div>
    <a-card title="Config Dir" style="width: 500px"
      :bodyStyle="{ height: '500px', 'overflow-y': 'auto'}">
      <a-directory-tree :tree-data="treeData" :load-data="onLoadData"
        multiple default-expand-all>
      </a-directory-tree>
    </a-card>
  </div>
</template>

<script>
import { remote } from 'electron'
const fs = require('fs')
const { join } = require('path')

export default {
  name: 'ConfigDir',
  data () {
    return {
      configDirPath: join(remote.app.getPath('userData'), '/Config Dir'),
      treeData: []
    }
  },
  created () {
    this.treeData = this.getDirItemArray(this.configDirPath)
  },
  methods: {
    onLoadData (treeNode) {
      return new Promise(resolve => {
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
        treeNode.dataRef.children = this.getDirItemArray(join(this.configDirPath, tempPath))
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
          array.push({ title: item, key: item })
        } else {
          array.push({ title: item, key: item, isLeaf: true })
        }
      })
      return array
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
