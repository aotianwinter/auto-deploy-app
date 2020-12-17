<template>
  <div>
    <a-tabs v-model="activeKey" @change="onChangeTab">
      <a-tab-pane key="1" tab="Server Center">
        <ServerList />
        <a-button @click="showAddForm" type="dashed">deploy</a-button>
        <DeployAction title="Create Deploy Task" :visible="deployActionVisible"
          :data="{ preCommondList: [''], postCommondList: [''], isUpload: false, backup: true }"
          @cancel="closeAddForm" @submit="onSubmit" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Task Center">
        <TaskCenter />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Deploy Instance">
        <DeployInstanceList @switchTaskTab="activeKey = '2'" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ServerList from './ServerList'
import DeployAction from './DeployAction'
import TaskCenter from './TaskCenter'
import DeployInstanceList from './DeployInstanceList'
import taskMixin from '@/store/task-mixin'
import deployInstanceMixin from '@/store/deploy-instance-mixin'

export default {
  name: 'Home',
  mixins: [taskMixin, deployInstanceMixin],
  components: {
    ServerList,
    DeployAction,
    TaskCenter,
    DeployInstanceList
  },
  data () {
    return {
      activeKey: '1',
      deployActionVisible: false
    }
  },
  methods: {
    // 展示新增表单
    showAddForm () {
      this.deployActionVisible = true
    },
    // 关闭表单
    closeAddForm () {
      this.deployActionVisible = false
    },
    // 提交表单
    onSubmit (val) {
      this.deployActionVisible = false
      this._addPendingTaskList(val)
      this.activeKey = '2'
    },
    onChangeTab (activeKey) {
      switch (activeKey) {
        case '3':
          this._getDeployInstanceList()
          break
      }
    }
  }
}
</script>

