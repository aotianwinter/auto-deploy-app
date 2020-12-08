<template>
  <div>
    <a-tabs v-model="activeKey">
      <a-tab-pane key="1" tab="Tab Main">
        <ServerList></ServerList>
        <Deploy @switchTaskTab="activeKey = '2'"></Deploy>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab Task">
        <Task></Task>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import ServerList from './ServerList'
import Deploy from './Deploy'
import Task from './Task'
export default {
  name: 'Home',
  components: {
    ServerList,
    Deploy,
    Task
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

