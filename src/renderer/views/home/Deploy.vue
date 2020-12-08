<template>
  <div>
    <a-button @click="showAddForm">deploy</a-button>
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
          <a-select v-model="form.region" placeholder="please select your server">
            <a-select-option v-for="item in serverList" :key="item._id" :value="item._id">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import serverMixin from '@/store/server-mixin'
export default {
  mixins: [serverMixin],
  name: 'Deploy',
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
      console.log(val)
      this.visible = false
      this.$emit('switchTaskTab')
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
