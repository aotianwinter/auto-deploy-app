<template>
  <div>
    <!-- card -->
    <a-card title="Server List" style="width: 500px"
      :bodyStyle="{ height: '500px', 'overflow-y': 'auto'}">
      <template #extra>
        <a-icon title="add" type="file-add" @click="showAddForm" />
      </template>
      <a-collapse>
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
          <p>{{ item }}</p>
        </a-collapse-panel>
      </a-collapse>
    </a-card>
    <!-- modal -->
    <a-modal
      :title="modalTitle"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="submitForm(form, submitType)"
      @cancel="visible = false"
    >
      <a-form :model="form">
        <a-form-item label="name">
          <a-input v-model="form.name" />
        </a-form-item>
        <a-form-item label="host">
          <a-input v-model="form.host" />
        </a-form-item>
        <a-form-item label="port">
          <a-input-number id="inputNumber" v-model="form.port" :min="1" :max="65535" />
        </a-form-item>
        <a-form-item label="username">
          <a-input v-model="form.username" />
        </a-form-item>
        <a-form-item label="password">
          <a-input v-model="form.password" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import serverMixin from '@/store/server-mixin'
export default {
  name: 'ServerList',
  mixins: [serverMixin],
  data () {
    return {
      visible: false,
      confirmLoading: false,
      submitType: 'add',
      modalTitle: 'Add Server',
      form: {}
    }
  },
  created () {
    this._getServerList()
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
    async submitForm (val, type = 'add') {
      this.confirmLoading = true
      // TODO
      type === 'add' ? await this._addServerList(val) : await this._editServerList(val)
      this._getServerList()
      this.visible = false
      this.confirmLoading = false
    },
    // 删除信息
    async onDelete (_id) {
      await this._deleteServerList(_id)
      this._getServerList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.anticon
  margin-left 6px
  font-size 18px
</style>
