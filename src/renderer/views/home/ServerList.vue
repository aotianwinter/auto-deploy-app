<template>
  <div>
    <a-button type="primary" @click="showModal">add</a-button>
    <a-modal
      title="Title"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="visible = false"
    >
      <a-form :model="form">
        <a-form-item label="Activity name">
          <a-input :value="form.name" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: 'ServerList',
  data () {
    return {
      visible: false,
      confirmLoading: false,
      form: {}
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    }
  }
}
</script>

<style lang="stylus" scoped>
</style>
