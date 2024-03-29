<template>
  <div class="app-wrap">
    <a-tabs v-model="activeKey" :tab-position="tabPosition" @tabClick="onTabClick">
      <a-tab-pane key="1" tab="Server Center">
        <div class="flex-card-wrap">
          <ServerList />
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
      <a-tab-pane key="2" tab="Executing Task">
        <TaskCenter @switchTab="handleSwitchTab" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="Task Instance">
        <InstanceList @switchTab="handleSwitchTab" />
      </a-tab-pane>
      <a-icon @click="visible = true" style="fontSize: 18px; margin: 1rem" type="setting" slot="tabBarExtraContent" />
    </a-tabs>
    <!-- drawer -->
    <a-drawer
      title="Setting"
      placement="right"
      :closable="false"
      :visible="visible"
      @close="visible = false"
    >
      <a-form>
        <a-form-item label="Tab Position" layout="vertical">
          <a-radio-group @change="updateTabPosition" v-model="tabPosition" button-style="solid">
            <a-radio-button v-for="(item, index) in tabPositionOpions" :key="index" :value="item">
              {{ item }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-drawer>
    <!-- footer -->
    <footer class="footer">
      <div>
        <span :title="`version: v${version}`" class="footer-link"
          @click="openUrl('https://github.com/aotianwinter/auto-deploy-app/releases')">
          <a-icon type="thunderbolt" />
          v{{ version }}
        </span>
        <HelpView style="margin-left: 0.2rem" />
      </div>
      <p title="author 打酱油" class="footer-link"
        @click="openUrl('https://github.com/aotianwinter/auto-deploy-app')">
        <a-icon type="github" />
        打酱油
      </p>
    </footer>
  </div>
</template>

<script>
import ServerList from './ServerList'
import TaskForm from './TaskForm'
import TaskCenter from './TaskCenter'
import InstanceList from './InstanceList'
import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
import appMixin from '@/store/app-mixin'
import HelpView from './HelpView'
import { version } from '@/../../package.json'

const { shell } = require('electron')
export default {
  name: 'Home',
  mixins: [taskMixin, instanceMixin, appMixin],
  components: {
    ServerList,
    TaskForm,
    TaskCenter,
    InstanceList,
    HelpView
  },
  data () {
    return {
      tabPosition: 'top',
      visible: false,
      tabPositionOpions: [
        'left',
        'top',
        'right'
      ],
      activeKey: '1',
      deployActionVisible: false,
      defaultForm: {},
      version
    }
  },
  async created () {
    const setting = await this.getSetting()
    if (!setting) {
      console.log('init app setting')
      await this.initSetting({
        tabPosition: 'top'
      })
      await this.getSetting()
    }
    this.tabPosition = this.setting.tabPosition
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
    },
    // update tabPosition
    async updateTabPosition (event) {
      await this.updateSetting({
        ...this.setting,
        tabPosition: event.target.value
      })
      this.getSetting()
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
    z-index 10
    justify-content space-between
    position fixed
    left 0
    bottom 0
    width 100%
    padding 4px 0.5rem
    background white
    .footer-link
      cursor pointer
</style>
