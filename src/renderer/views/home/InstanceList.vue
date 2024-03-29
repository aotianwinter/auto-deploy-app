<template>
  <div>
    <!-- table -->
    <a-table :columns="columns" rowKey="_id" :data-source="instanceList" :scroll="{ x: 1200 }">
      <span slot="status" slot-scope="status">
        <a-tag :color="taskStatusOptions[status].color">
          {{ taskStatusOptions[status].desc }}
        </a-tag>
      </span>
      <span slot="preCommandList" slot-scope="preCommandList">
        <p v-for="(item, index) in preCommandList" :key="index">
          <template v-if="item.path && item.command">
            <span class="path-span">{{ item.path }}</span>
            {{ item.command }}
          </template>
        </p>
      </span>
      <span slot="releasePath" slot-scope="releasePath">
        <span class="path-span">{{ releasePath }}</span>
      </span>
      <span slot="localPreCommand" slot-scope="localPreCommand">
        <p v-if="localPreCommand.path && localPreCommand.command">
          <span class="path-span">{{ localPreCommand.path }}</span>
          <template>{{ localPreCommand.command }}</template>
        </p>
      </span>
      <span slot="projectPath" slot-scope="projectPath">
        <span class="path-span">{{ projectPath }}</span>
      </span>
      <span slot="localPostCommand" slot-scope="localPostCommand">
        <p v-if="localPostCommand.path && localPostCommand.command">
          <span class="path-span">{{ localPostCommand.path }}</span>
          <template>{{ localPostCommand.command }}</template>
        </p>
      </span>
      <span slot="postCommandList" slot-scope="postCommandList">
        <p v-for="(item, index) in postCommandList" :key="index">
          <template v-if="item.path && item.command">
            <span class="path-span">{{ item.path }}</span> {{ item.command }}
          </template>
        </p>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          placement="left"
          title="Sure to run task?"
          @confirm="() => onRunTask(record)"
        >
          <a-icon title="run" type="thunderbolt" theme="twoTone" />
        </a-popconfirm>
        <a-icon title="edit" @click.stop="showEditForm(record)" type="edit" />
        <a-popconfirm
          placement="left"
          title="Sure to delete?"
          @confirm="() => onDelete(record._id)"
        >
          <a-icon title="delete" type="delete" theme="twoTone" two-tone-color="#F56C6C" />
        </a-popconfirm>
      </span>
    </a-table>
    <!-- modal -->
    <TaskForm title="Update Task" :data="curTask" :visible="deployActionVisible"
      @cancel="closeAddForm" @submit="onSubmit" />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import TaskForm from './TaskForm'
import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
export default {
  name: 'InstanceList',
  mixins: [taskMixin, instanceMixin],
  components: {
    TaskForm
  },
  data () {
    return {
      curTask: {},
      deployActionVisible: false,
      columns: [
        {
          dataIndex: 'name',
          title: '名称',
          fixed: 'left',
          width: 100
        },
        {
          dataIndex: 'server.name',
          title: '服务器'
        },
        {
          dataIndex: 'server.host',
          title: 'IP'
        },
        {
          dataIndex: 'preCommandList',
          title: '远端前置命令',
          scopedSlots: { customRender: 'preCommandList' }
        },
        {
          dataIndex: 'releasePath',
          title: '发布路径',
          scopedSlots: { customRender: 'releasePath' }
        },
        {
          dataIndex: 'localPreCommand',
          title: '本地编译命令',
          scopedSlots: { customRender: 'localPreCommand' }
        },
        {
          dataIndex: 'projectPath',
          title: '项目路径',
          scopedSlots: { customRender: 'projectPath' }
        },
        {
          dataIndex: 'localPostCommand',
          title: '本地清理命令',
          scopedSlots: { customRender: 'localPostCommand' }
        },
        {
          dataIndex: 'postCommandList',
          title: '远端后置命令',
          scopedSlots: { customRender: 'postCommandList' }
        },
        {
          dataIndex: 'lastExecutedTime',
          title: '上次执行时间',
          ellipsis: true
        },
        {
          dataIndex: 'lastCostTime',
          title: '上次总用时(s)'
        },
        {
          dataIndex: 'status',
          title: '上次执行状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' },
          fixed: 'right',
          width: 120
        }
      ]
    }
  },
  methods: {
    // on click delete
    async onDelete (_id) {
      await this.deleteInstanceList(_id)
      this.getInstanceList()
    },
    // on run task
    onRunTask (val) {
      const task = JSON.parse(JSON.stringify(val))
      task.lastExecutedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this._addPendingTaskList(JSON.parse(JSON.stringify(task)))
      this.$emit('switchTab', '2')
    },
    // 展示编辑表单
    showEditForm (val) {
      this.curTask = JSON.parse(JSON.stringify(val))
      this.deployActionVisible = true
    },
    // 关闭表单
    closeAddForm () {
      this.deployActionVisible = false
    },
    // 提交表单
    async onSubmit (val) {
      const instance = JSON.parse(JSON.stringify(val))
      this.deployActionVisible = false
      await this.editInstanceList(instance)
      this.getInstanceList()
    }
  }
}
</script>
<style lang="stylus" scoped>
.path-span
  text-decoration underline
  color #409EFF
  
.anticon
  margin-right 6px
  font-size 18px
</style>
