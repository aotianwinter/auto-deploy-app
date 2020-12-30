<template>
  <!-- modal -->
  <a-modal
    :visible="visible"
    @ok="submitForm(form)"
    @cancel="onCancel"
  >
    <template #title>
      {{ title }} <HelpView />
    </template>
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
        :label="index === 0 ? 'remote pre command ( path | command )' : ''"
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
          <!-- select dir or file -->
          <a-radio-group v-model="form.projectType" button-style="solid" @change="onChangeProjectType">
            <a-radio-button v-for="(item, index) in projectTypeOptions" :key="index" :value="item.value">
              {{ item.label }}
            </a-radio-button>
          </a-radio-group>
          <a-button style="margin-left: 2rem" @click="handleSelectFileOrDir(form.projectType)">
            <a-icon type="upload" />Select {{ form.projectType }}
          </a-button>
          <!-- show result when remote uploaded -->
          <p>
            <!-- {{ form.projectPath }} -->
            <a-textarea v-if="form.projectPath" style="width: 30%; vertical-align: middle"
              auto-size v-model="form.projectPath" placeholder="local project path" />
            <template v-if="form.projectPath && form.releasePath">
            👉 {{
              form.releasePath
            }}<template v-if="form.projectType === 'file'">/{{ getFileName(form.projectPath) }}</template>
            </template>
          </p>
          <!-- pre command list -->
          <template v-if="form.projectPath">
            <p>
              local build command ( path | command )
              <a-tooltip>
                <template slot="title">
                  windows: PowerShell<br />
                  unix: /bin/sh<br />
                  请确保符合语法要求 不使用无需填写
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </p>
            <a-input-group compact>
              <a-textarea auto-size v-model="form.localPreCommand.path" style="width: 30%" placeholder="local project path" />
              <a-textarea auto-size v-model="form.localPreCommand.command" style="width: 70%" placeholder="build command" />
            </a-input-group>
            <p>
              local clean command ( path | command )
              <a-tooltip>
                <template slot="title">
                  windows: PowerShell<br />
                  unix: /bin/sh<br />
                  请确保符合语法要求 不使用无需填写
                </template>
                <a-icon type="info-circle" />
              </a-tooltip>
            </p>
            <a-input-group compact>
              <a-textarea auto-size v-model="form.localPostCommand.path" style="width: 30%" placeholder="local project path" />
              <a-textarea auto-size v-model="form.localPostCommand.command" style="width: 70%" placeholder="clean command" />
            </a-input-group>
          </template>
        </a-form-model-item>
        <!-- post command list -->
        <a-form-model-item
          v-for="(item, index) in form.postCommandList" :key="index"
          :label="index === 0 ? 'remote post command ( path | command )' : ''"
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
import HelpView from './HelpView'
import serverMixin from '@/store/server-mixin'
const { dialog } = require('electron').remote
export default {
  name: 'DeployAction',
  mixins: [serverMixin],
  components: {
    HelpView
  },
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
      defaultForm: {
        preCommandList: [{ path: '/', command: '' }],
        postCommandList: [{ path: '/', command: '' }],
        isUpload: false,
        backup: true,
        projectPath: '',
        projectType: 'dir',
        localPreCommand: { path: '', command: '' },
        localPostCommand: { path: '', command: '' }
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
      ],
      projectTypeOptions: [
        { value: 'dir', label: 'dir' },
        { value: 'file', label: 'file' }
      ]
    }
  },
  watch: {
    data: {
      handler (newVal, oldVal) {
        this.form = { ...this.defaultForm, ...newVal }
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
          backup: true,
          projectType: 'dir',
          localPreCommand: { path: '', command: '' },
          localPostCommand: { path: '', command: '' }
        }
      }
    },
    // 提交表单
    submitForm (val) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          const task = JSON.parse(JSON.stringify(val))
          for (let item of this.serverList) {
            if (item._id === task.serverId) {
              task.server = item
            }
          }
          task.lastExecutedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
          this.$emit('submit', task)
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
          if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
        } else {
          return false
        }
      })
    },
    // 点击取消
    onCancel () {
      this.form = JSON.parse(JSON.stringify(this.defaultForm))
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
      this.$emit('cancel')
    },
    onChangeProjectType () {
      this.form.projectPath = ''
      this.form.localPreCommand = { path: '', command: '' }
      this.form.localPostCommand = { path: '', command: '' }
    },
    // 选择文件或文件夹
    handleSelectFileOrDir (type) {
      const paths = dialog.showOpenDialog({
        title: 'select project path',
        properties: [ type === 'dir' ? 'openDirectory' : 'openFile' ]
      })
      if (paths && paths.length > 0) {
        this.$set(this.form, 'projectPath', paths[0].replace(/\\/g, '/'))
        // set local pre / post command path
        this.form.localPreCommand.path = this.form.projectPath.replace(new RegExp(/([/][^/]+)$/), '') || '/'
        this.form.localPostCommand.path = this.form.projectPath.replace(new RegExp(/([/][^/]+)$/), '') || '/'
      }
    },
    // 获取文件名称
    getFileName (val) {
      return val.match(new RegExp(/([^/]+)$/))[1]
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
