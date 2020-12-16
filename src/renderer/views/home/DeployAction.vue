<template>
  <!-- modal -->
  <a-modal
    :title="title"
    :visible="visible"
    @ok="submitForm(form)"
    @cancel="onCancel"
  >
    <a-form :model="form">
      <a-form-item label="name">
        <a-input v-model="form.name" placeholder="please input your task name" />
      </a-form-item>
      <a-form-item label="server">
        <a-select v-model="form.serverId" placeholder="please select your server">
          <a-select-option v-for="item in serverList" :key="item._id" :value="item._id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="deploy path">
        <a-input v-model="form.releasePath" placeholder="the deploy path in server" />
      </a-form-item>
      <a-form-item label="remote backup">
        <a-radio-group v-model="form.backup" button-style="solid">
          <a-radio-button v-for="(item, index) in backupOptions" :key="index" :value="item.value">
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="project path">
        <a-button @click="handleSelectDir">
          <a-icon type="upload" />Click Project Dir
        </a-button>
        <p>{{ form.projectPath }}</p>
      </a-form-item>
      <a-form-item label="post commond">
        <a-input v-model="form.postCommond" placeholder="please input your post commond" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import dayjs from 'dayjs'

import serverMixin from '@/store/server-mixin'
const { dialog } = require('electron').remote
export default {
  mixins: [serverMixin],
  name: 'DeployAction',
  props: {
    title: {
      type: String,
      default: 'Deploy Task'
    },
    data: {
      type: Object,
      default: () => {}
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      form: {},
      backupOptions: [
        { value: true, label: '开启' },
        { value: false, label: '关闭' }
      ]
    }
  },
  watch: {
    data: {
      handler (newVal, oldVal) {
        this.form = newVal
      },
      immediate: true
    }
  },
  methods: {
    // 提交表单
    submitForm (val) {
      const task = JSON.parse(JSON.stringify(val))
      for (let item of this.serverList) {
        if (item._id === task.serverId) {
          task.server = item
        }
      }
      task.lastExecutedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.$emit('submit', task)
      this.form = {}
    },
    // 点击取消
    onCancel () {
      this.form = {}
      this.$emit('cancel')
    },
    // 选择文件
    handleSelectDir (evt) {
      const paths = dialog.showOpenDialog({
        title: 'select project path',
        properties: ['openDirectory']
      })
      if (paths && paths.length > 0) {
        this.$set(this.form, 'projectPath', paths[0])
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
