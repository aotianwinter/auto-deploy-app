<template>
  <div>
    <a-tabs v-model="activeKey" @tabClick="onTabClick">
      <a-tab-pane key="1" tab="Server Center">
        <div class="flex-card-wrap">
          <ServerList />
          <!-- config card -->
          <AppData style="margin-left: 1rem" />
          <HelpView style="font-size: 1.5rem; margin-left: 1rem" />
        </div>
        <!-- action -->
        <div class="action-wrap">
          <a-button @click="showAddForm" type="dashed">
            Create Task
          </a-button>
        </div>
        <InstanceForm title="Create Task" :visible="deployActionVisible"
          :data="defaultForm" @cancel="closeAddForm" @submit="onSubmit" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Task Center">
        <TaskCenter @switchTab="handleSwitchTab" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Task Instance">
        <InstanceList @switchTab="handleSwitchTab" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ServerList from './ServerList'
import AppData from './AppData'
import InstanceForm from './InstanceForm'
import TaskCenter from './TaskCenter'
import InstanceList from './InstanceList'
import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
import HelpView from './HelpView'

export default {
  name: 'Home',
  mixins: [taskMixin, instanceMixin],
  components: {
    ServerList,
    AppData,
    InstanceForm,
    TaskCenter,
    InstanceList,
    HelpView
  },
  data () {
    return {
      activeKey: '1',
      deployActionVisible: false,
      defaultForm: {}
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
      switch (activeKey) {
        case '2':
          this.activeKey = '2'
          break
        case '3':
          await this.getInstanceList()
          this.activeKey = '3'
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.flex-card-wrap
  display inline-flex
  padding 0 1rem 1rem 1rem
.action-wrap
  text-align center
</style>
