<template>
  <span>
    <a-icon title="Instructions for use" type="question-circle" @click="showModal" />
    <!-- modal -->
    <a-modal v-model="visible" title="Use Helper" @ok="visible = false" :width="1000">
      <a-divider orientation="left">
        <h2>Create Task And Run</h2>
      </a-divider>
      <a-steps :current="2">
        <a-step title="Create Server" description="点击➕创建服务器" />
        <a-step title="Create Task" description="点击【Create Task】创建任务" />
        <a-step title="Executing Task" description="等待任务执行完成" />
        <a-step title="Save Task" description="点击💾保存任务" />
      </a-steps>
      <a-divider orientation="left">
        <h2>Select Task And Run</h2>
      </a-divider>
      <a-steps :current="1">
        <a-step title="Select Task" description="选择任务实例点击⚡" />
        <a-step title="Executing Task" description="等待任务执行完成" />
      </a-steps>
      <a-divider orientation="left">
        <h2>Task Executing Flow</h2>
      </a-divider>
      <a-steps :current="6" direction="vertical">
        <a-step title="connect server" description="连接服务器" />
        <a-step title="run remote pre command" description="执行远端前置命令(支持批量)" />
        <a-step title="local build command" description="本地构建命令(不填写可跳过)" />
        <a-step title="upload files" description="上传文件、文件夹(文件夹自动压缩上传并解压[remote unzip])" />
        <a-step title="remote backup" description="执行远端备份(可选择不备份)" />
        <a-step title="local clean command" description="本地清理命令(不填写可跳过)" />
        <a-step title="remote post command" description="执行远端后置命令(支持批量)" />
        <a-step title="task end" description="更新任务状态与时长统计" />
      </a-steps>
      <!-- tips -->
      🔔Tips: 
      <ul>
        <li>任务异常会显示错误信息，中断任务执行</li>
        <li>点击<a-icon title="save" type="save" theme="twoTone" two-tone-color="#67C23A" />可快速更正</li>
        <li> 点击<a-icon title="retry" type="reload" style="color: #409EFF" />可重新执行</li>
        <li>选择任务实例执行，执行完成后会自动保存执行状态和时长统计</li>
      </ul>
    </a-modal>
  </span>
</template>

<script>
export default {
  name: 'HelpView',
  data () {
    return {
      visible: false
    }
  },
  methods: {
    showModal () {
      this.visible = true
    }
  }
}
</script>

