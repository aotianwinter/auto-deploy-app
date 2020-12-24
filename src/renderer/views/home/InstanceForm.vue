<template>
  <!-- modal -->
  <a-modal
    :title="title"
    :visible="visible"
    @ok="submitForm(form)"
    @cancel="onCancel"
  >
    <a-form-model :model="form" :rules="rules" ref="ruleForm">
      <a-form-model-item label="name" prop="name">
        <a-input v-model="form.name" allowClear placeholder="please input your task name" />
      </a-form-model-item>
      <a-form-model-item label="server" prop="serverId">
        <a-select v-model="form.serverId" placeholder="please select your server">
          <a-select-option v-for="item in serverList" :key="item._id" :value="item._id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <!-- pre command list -->
      <a-form-model-item
        v-for="(item, index) in form.preCommandList" :key="index"
        :label="index === 0 ? 'pre command ( path | command )' : ''"
      >
        <a-input-group compact style="width: calc(100% - 22px); margin-right: 8px">
          <a-textarea auto-size v-model="form.preCommandList[index].path" style="width: 30%" placeholder="/home" />
          <a-textarea auto-size v-model="form.preCommandList[index].command" style="width: 70%" placeholder="echo hello world" />
        </a-input-group>
        <a-icon v-if="index === 0" title="add" type="plus-circle-o" @click="addCommand('preCommandList')" />
        <a-icon v-if="index > 0" title="remove" type="minus-circle-o" @click="removeCommand('preCommandList', index)" />
      </a-form-model-item>
      <!-- upload -->
      <a-form-model-item label="upload files" prop="isUpload">
        <a-radio-group @change="onChangeIsUpload" v-model="form.isUpload" button-style="solid">
          <a-radio-button v-for="(item, index) in openOptions" :key="index" :value="item.value">
            {{ item.label }}
          </a-radio-button>
        </a-radio-group>
      </a-form-model-item>
      <!-- upload dir show -->
      <div v-if="form.isUpload">
        <a-form-model-item label="release path" prop="releasePath">
          <a-input v-model="form.releasePath" allowClear placeholder="please input release path in server such as /home/test/web" />
        </a-form-model-item>
        <a-form-model-item label="remote backup" prop="backup">
          <a-radio-group v-model="form.backup" button-style="solid">
            <a-radio-button v-for="(item, index) in openOptions" :key="index" :value="item.value">
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="project path" prop="projectPath">
          <a-button @click="handleSelectDir">
            <a-icon type="upload" />Click Project Dir
          </a-button>
          <p>{{ form.projectPath }}</p>
        </a-form-model-item>
        <!-- post command list -->
        <a-form-model-item
          v-for="(item, index) in form.postCommandList" :key="index"
          :label="index === 0 ? 'post command ( path | command )' : ''"
        >
          <a-input-group compact style="width: calc(100% - 22px); margin-right: 8px">
            <a-textarea auto-size v-model="form.postCommandList[index].path" style="width: 30%" placeholder="/home" />
            <a-textarea auto-size v-model="form.postCommandList[index].command" style="width: 70%" placeholder="echo hello world" />
          </a-input-group>
          <a-icon v-if="index === 0" title="add" type="plus-circle-o" @click="addCommand('postCommandList')" />
          <a-icon v-if="index > 0" title="remove" type="minus-circle-o" @click="removeCommand('postCommandList', index)" />
        </a-form-model-item>
      </div>
    </a-form-model>
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
      form: {
        preCommandList: [{ path: '/', command: '' }],
        postCommandList: [{ path: '/', command: '' }],
        isUpload: false,
        backup: true
      },
      rules: {
        name: [ { required: true, message: 'Please input task name', trigger: 'blur' } ],
        serverId: [ { required: true, message: 'Please slelect your server', trigger: 'blur' } ],
        isUpload: [ { required: true, message: 'Please slelect whether to upload or not', trigger: 'blur' } ],
        releasePath: [ { required: true, message: 'Please input release path in server', trigger: 'blur' } ],
        backup: [ { required: true, message: 'Please select whether to remote back up or not', trigger: 'blur' } ],
        projectPath: [ { required: true, message: 'Please select project path in local', trigger: 'blur' } ]
      },
      openOptions: [
        { value: true, label: 'ON' },
        { value: false, label: 'OFF' }
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
    // 添加命令
    addCommand (key) {
      if (this.form[key] && this.form[key] instanceof Array) {
        this.form[key].push({
          path: '/',
          command: ''
        })
      }
    },
    // 删除命令
    removeCommand (key, index) {
      if (this.form[key] && this.form[key] instanceof Array) {
        this.form[key].splice(index, 1)
      }
    },
    // change isUpload
    onChangeIsUpload (evt) {
      if (!evt.target.value) {
        this.form = {
          ...this.form,
          releasePath: '',
          projectPath: '',
          postCommandList: [{ path: '/', command: '' }],
          isUpload: false,
          backup: true
        }
      }
    },
    // 提交表单
    submitForm (val) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          // console.log(val)
          const task = JSON.parse(JSON.stringify(val))
          for (let item of this.serverList) {
            if (item._id === task.serverId) {
              task.server = item
            }
          }
          task.lastExecutedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          this.$emit('submit', task)
          this.form = {
            preCommandList: [{ path: '/', command: '' }],
            postCommandList: [{ path: '/', command: '' }],
            isUpload: false,
            backup: true
          }
          if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
        } else {
          return false
        }
      })
    },
    // 点击取消
    onCancel () {
      this.form = {
        preCommandList: [{ path: '/', command: '' }],
        postCommandList: [{ path: '/', command: '' }],
        isUpload: false,
        backup: true
      }
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
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
