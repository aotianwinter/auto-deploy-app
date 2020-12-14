<template>
  <div>
    <a-button @click="showAddForm" type="dashed">deploy</a-button>
    <!-- modal -->
    <a-modal
      title="Create Task For Deploy"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="submitForm(form)"
      @cancel="visible = false"
    >
      <a-form :model="form">
        <a-form-item label="name">
          <a-input v-model="form.name" placeholder="please input your task name" />
        </a-form-item>
        <a-form-item label="server">
          <a-select v-model="form.server" placeholder="please select your server">
            <a-select-option v-for="item in serverList" :key="item._id" :value="item._id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="deploy path">
          <a-input v-model="form.serverPath" placeholder="the deploy path in server" />
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
  </div>
</template>
<script>
import dayjs from 'dayjs'

import serverMixin from '@/store/server-mixin'
import taskMixin from '@/store/task-mixin'
const { dialog } = require('electron').remote
export default {
  mixins: [serverMixin, taskMixin],
  name: 'DeployAction',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: {}
    }
  },
  methods: {
    // 展示新增表单
    showAddForm () {
      this.form = {}
      this.visible = true
    },
    // 提交表单
    submitForm (val) {
      console.log('perpar to deploy')
      this.$emit('switchTaskTab')
      const submitForm = JSON.parse(JSON.stringify(val))
      this.visible = false
      for (let item of this.serverList) {
        if (item._id === submitForm.server) {
          submitForm.server = item
        }
      }
      submitForm.createdTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this._addPendingTaskList(JSON.parse(JSON.stringify(submitForm)))
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
