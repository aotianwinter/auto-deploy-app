<template>
  <div>
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="Server Center">
        <ServerList></ServerList>
        <DeployAction @switchTaskTab="activeKey = '2'"></DeployAction>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Task Center">
        <Task></Task>
      </a-tab-pane>
      <a-tab-pane key="3" tab="Deploy Instance">
        <DeployInstanceList @switchTaskTab="activeKey = '2'"></DeployInstanceList>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ServerList from './ServerList'
import DeployAction from './DeployAction'
import Task from './Task'
import DeployInstanceList from './DeployInstanceList'

export default {
  name: 'Home',
  components: {
    ServerList,
    DeployAction,
    Task,
    DeployInstanceList
  },
  data () {
    return {
      activeKey: '1'
    }
  },
  methods: {
  }
}
</script>

