<template>
  <div>
    <!-- card -->
    <a-card title="Server List" style="width: 500px"
      :bodyStyle="{ height: '500px', 'overflow-y': 'auto'}">
      <template #extra>
        <a-icon title="add" type="file-add" @click="showAddForm" />
      </template>
      <a-collapse v-if="serverList.length > 0">
        <a-collapse-panel v-for="item in serverList" :key="item._id">
          <template #header>
            <!-- <a-avatar>{{ item.name.substring(0, 2) }}</a-avatar> -->
            {{ item.name }}
          </template>
          <template #extra>
            <a-icon title="edit" @click.stop="showEditForm(item)" type="edit" />
            <a-popconfirm
              title="Sure to delete?"
              @confirm="() => onDelete(item._id)"
            >
              <a-icon title="delete" @click.stop="" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
            </a-popconfirm>
          </template>
          <template v-for="(val, key) in item">
            <p v-if="key === 'name' || key === 'host' || key === 'port'" :key="key" >
              {{ key }}：{{ val }}
            </p>
          </template>
        </a-collapse-panel>
      </a-collapse>
      <!-- empty -->
      <a-empty description="No Server" v-else />
    </a-card>
    <!-- modal -->
    <a-modal
      :title="modalTitle"
      :visible="visible"
      @ok="submitForm(submitType)"
      @cancel="onCancel"
    >
      <a-form-model :model="form" :rules="rules" ref="ruleForm">
        <a-form-model-item label="name" prop="name">
          <a-input v-model="form.name" placeholder="please input server name" />
        </a-form-model-item>
        <a-form-model-item label="host" prop="host">
          <a-input v-model="form.host" placeholder="please input host of server" />
        </a-form-model-item>
        <a-form-model-item label="port" prop="port">
          <a-input-number v-model="form.port" :min="1" :max="65535" placeholder="22" />
        </a-form-model-item>
        <!-- user pwd -->
        <a-form-model-item label="username" prop="username">
          <a-input v-model="form.username" placeholder="please input username of server" />
        </a-form-model-item>
        <a-form-model-item label="password" prop="password">
          <a-input-password v-model="form.password" placeholder="please input password of server" />
        </a-form-model-item>
        <!-- rsa key -->
        <a-form-model-item label="privateKey" prop="privateKey">
          <a-button @click="handleSelectDir">
            <a-icon type="upload" />Click Project Dir
          </a-button>
          <p>
            {{ form.privateKey }}
            <a-icon v-show="form.privateKey" @click="handleClearDir"
              title="delete" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
          </p>
        </a-form-model-item>
        <a-form-model-item label="passphrase" prop="passphrase">
          <a-input v-model="form.passphrase" placeholder="please input passphrase of server" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import serverMixin from '@/store/server-mixin'
const { dialog } = require('electron').remote
export default {
  name: 'ServerList',
  mixins: [serverMixin],
  data () {
    return {
      visible: false,
      submitType: 'add',
      modalTitle: 'Add Server',
      form: {},
      rules: {
        name: [ { required: true, message: 'Please input server name', trigger: 'blur' } ],
        host: [ { required: true, message: 'Please input host of server', trigger: 'blur' } ],
        port: [ { required: true, message: 'Please input port of server', trigger: 'blur' } ],
        username: [ { required: true, message: 'Please input username of server', trigger: 'blur' } ],
        password: [ { required: true, message: 'Please input password of server', trigger: 'blur' } ]
      }
    }
  },
  created () {
    this.getServerList()
  },
  methods: {
    // 展示新增表单
    showAddForm () {
      this.submitType = 'add'
      this.modalTitle = 'Add Server'
      this.form = {}
      this.visible = true
    },
    // 展示编辑表单
    showEditForm (val) {
      this.submitType = 'edit'
      this.modalTitle = 'Edit Server'
      this.form = JSON.parse(JSON.stringify(val))
      this.visible = true
    },
    // 提交表单
    submitForm (type = 'add') {
      const submitForm = JSON.parse(JSON.stringify(this.form))
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          // check server name is exist when add
          if (type === 'add') {
            const res = await this.getServerListByName(this.form.name)
            if (res && res.length) {
              this.$message.warning(`Exist the same server's name, please edit and save again`)
              return
            }
          }
          type === 'add' ? await this.addServerList(submitForm) : await this.editServerList(submitForm)
          this.getServerList()
          this.visible = false
          this.confirmLoading = false
          if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
        } else {
          return false
        }
      })
    },
    // handle select id_rsa
    handleSelectDir () {
      const paths = dialog.showOpenDialog({
        title: 'select project path'
      })
      if (paths && paths.length > 0) {
        this.$set(this.form, 'privateKey', paths[0])
      }
    },
    // handle clear id_rsa path
    handleClearDir () {
      if (this.form.privateKey) delete this.form.privateKey
      if (this.form.passphrase) this.form.passphrase = ''
      this.form = Object.assign({}, this.form, {})
    },
    // 点击取消
    onCancel () {
      this.visible = false
      if (this.$refs.ruleForm) this.$refs.ruleForm.resetFields()
    },
    // 删除信息
    async onDelete (_id) {
      await this.deleteServerList(_id)
      this.getServerList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.anticon
  margin-left 6px
  font-size 18px
</style>
