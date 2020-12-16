<template>
  <div>
    <!-- table -->
    <a-table :columns="columns" rowKey="_id" :data-source="deployInstanceList">
      <span slot="status" slot-scope="status">
        <a-tag :color="taskStatusOptions[status].color">
          {{ taskStatusOptions[status].desc }}
        </a-tag>
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
    <DeployAction title="Update Deploy Task " :data="curTask" :visible="deployActionVisible"
      @cancel="closeAddForm" @submit="onSubmit" />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import DeployAction from './DeployAction'
import taskMixin from '@/store/task-mixin'
import deployInstanceMixin from '@/store/deploy-instance-mixin'
export default {
  name: 'DeployInstanceList',
  mixins: [taskMixin, deployInstanceMixin],
  components: {
    DeployAction
  },
  data () {
    return {
      curTask: {},
      deployActionVisible: false,
      columns: [
        {
          dataIndex: 'name',
          title: '名称'
        },
        // {
        //   dataIndex: 'server',
        //   title: 'server'
        // },
        {
          dataIndex: 'releasePath',
          title: '部署路径'
        },
        {
          dataIndex: 'projectPath',
          title: '项目路径'
        },
        {
          dataIndex: 'postCommond',
          title: '后置命令'
        },
        {
          dataIndex: 'lastExecutedTime',
          title: '上次执行时间'
        },
        {
          dataIndex: 'status',
          title: '上次执行状态',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  methods: {
    // on click delete
    async onDelete (_id) {
      await this._deleteDeployInstanceList(_id)
      this._getDeployInstanceList()
    },
    // on run task
    onRunTask (val) {
      this.$emit('switchTaskTab')
      const task = JSON.parse(JSON.stringify(val))
      task.lastExecutedTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this._addPendingTaskList(JSON.parse(JSON.stringify(task)))
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
    onSubmit (val) {
      const deployInstance = JSON.parse(JSON.stringify(val))
      this.deployActionVisible = false
      this._editDeployInstanceList(deployInstance)
      this._getDeployInstanceList()
    }
  }
}
</script>
<style lang="stylus" scoped>
.anticon
  margin-right 6px
  font-size 18px
</style>
