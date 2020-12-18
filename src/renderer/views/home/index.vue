<template>
  <div>
    <a-tabs v-model="activeKey" @tabClick="onTabClick">
      <a-tab-pane key="1" tab="Server Center">
        <ServerList />
        <a-button @click="showAddForm" type="dashed">deploy</a-button>
        <DeployAction title="Create Deploy Task" :visible="deployActionVisible"
          :data="defaultForm" @cancel="closeAddForm" @submit="onSubmit" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Task Center">
        <TaskCenter @switchTab="handleSwitchTab" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Deploy Instance">
        <DeployInstanceList @switchTab="handleSwitchTab" />
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
      deployActionVisible: false,
      defaultForm: {
        preCommandList: [{ path: '/', command: '' }],
        postCommandList: [{ path: '/', command: '' }],
        isUpload: false,
        backup: true
      }
    }
  },
  methods: {
    // on tab click
    onTabClick (activeKey) {
      this.handleSwitchTab(activeKey)
    },
    // show add form
    showAddForm () {
      this.deployActionVisible = true
    },
    // close add form
    closeAddForm () {
      this.deployActionVisible = false
    },
    // on submit form
    onSubmit (val) {
      this.deployActionVisible = false
      this._addPendingTaskList(val)
      this.activeKey = '2'
    },
    // handle switch tab
    async handleSwitchTab (activeKey) {
      if (activeKey === '3') {
        await this.getDeployInstanceList()
        this.activeKey = '3'
      }
    }
  }
}
</script>

