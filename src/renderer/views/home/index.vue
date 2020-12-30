<template>
  <div class="app-wrap">
    <a-tabs v-model="activeKey" @tabClick="onTabClick">
      <a-tab-pane key="1" tab="Server Center">
        <div class="flex-card-wrap">
          <ServerList />
          <!-- config card -->
          <AppData style="margin-left: 1rem" />
        </div>
        <!-- action -->
        <div class="action-wrap">
          <a-button @click="showAddForm" type="dashed">
            Create Task
          </a-button>
        </div>
        <TaskForm title="Create Task" :visible="deployActionVisible"
          :data="defaultForm" @cancel="closeAddForm" @submit="onSubmit" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="Executing task">
        <TaskCenter @switchTab="handleSwitchTab" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Task Instance">
        <InstanceList @switchTab="handleSwitchTab" />
      </a-tab-pane>
    </a-tabs>
    <!-- footer -->
    <footer class="footer">
      <p title="version">
        <a-icon @click="openUrl('https://github.com/aotianwinter/auto-deploy-app/releases')" type="thunderbolt" />
        v0.1.0
        <HelpView />
      </p>
      <p title="author 打酱油">
        <a-icon @click="openUrl('https://github.com/electron/update-electron-app')" type="github" />
        打酱油
      </p>
    </footer>
  </div>
</template>

<script>
import ServerList from './ServerList'
import AppData from './AppData'
import TaskForm from './TaskForm'
import TaskCenter from './TaskCenter'
import InstanceList from './InstanceList'
import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
import HelpView from './HelpView'

const { shell } = require('electron')
export default {
  name: 'Home',
  mixins: [taskMixin, instanceMixin],
  components: {
    ServerList,
    AppData,
    TaskForm,
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
    },
    // open url
    openUrl (url) {
      shell.openExternal(url)
    }
  }
}
</script>

<style lang="stylus" scoped>
.app-wrap
  padding-bottom 30px
  .flex-card-wrap
    display inline-flex
    padding 0 1rem
  .action-wrap
    text-align center
    padding 1rem 0
  .footer
    display inline-flex
    justify-content space-between
    position fixed
    left 0
    bottom 0
    width 100%
    padding 4px 0.5rem
    background white
</style>
