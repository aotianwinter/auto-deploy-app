<template>
  <div>
    <a-tabs>
      <a-tab-pane key="1" tab="Tab Main">
        <ServerList></ServerList>
      </a-tab-pane>
      <a-tab-pane key="2" tab="Tab Flow">
        Content of Tab Pane 2
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import serverMixin from '@/store/server-mixin'
import ServerList from './ServerList'
export default {
  mixins: [serverMixin],
  components: {
    ServerList
  },
  created () {
    this._getServerList()
  }
}
</script>

