<template>
  <div>
    <!-- table -->
    <a-table :columns="columns" rowKey="_id" :data-source="instanceList">
      <span slot="status" slot-scope="status">
        <a-tag :color="taskStatusOptions[status].color">
          {{ taskStatusOptions[status].desc }}
        </a-tag>
      </span>
      <span slot="preCommandList" slot-scope="preCommandList">
        <p v-for="(item, index) in preCommandList" :key="index">
          <template v-if="item.path && item.command">
            <a-tag>{{ item.path }}</a-tag> {{ item.command }}
          </template>
        </p>
      </span>
      <span slot="projectPath" slot-scope="projectPath">
        <a-icon v-if="projectPath" theme="twoTone"
          :title="checkDirExist(projectPath) ? 'normal' : 'not exist'"
          :type="checkDirExist(projectPath) ? 'check-circle' : 'exclamation-circle'"
          :two-tone-color="checkDirExist(projectPath) ? '#67C23A' : '#F56C6C'" />
        {{ projectPath }}
      </span>
      <span slot="postCommandList" slot-scope="postCommandList">
        <p v-for="(item, index) in postCommandList" :key="index">
          <template v-if="item.path && item.command">
            <a-tag>{{ item.path }}</a-tag> {{ item.command }}
          </template>
        </p>
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          v-if="!record.projectPath || (record.projectPath && checkDirExist(record.projectPath))"
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
    <InstanceForm title="Update Deploy Task " :data="curTask" :visible="deployActionVisible"
      @cancel="closeAddForm" @submit="onSubmit" />
  </div>
</template>

<script>
import dayjs from 'dayjs'

import InstanceForm from './InstanceForm'
import taskMixin from '@/store/task-mixin'
import instanceMixin from '@/store/instance-mixin'
const fs = require('fs')
export default {
  name: 'InstanceList',
  mixins: [taskMixin, instanceMixin],
  components: {
    InstanceForm
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
          title: '前置命令',
          scopedSlots: { customRender: 'preCommandList' }
        },
        {
          dataIndex: 'releasePath',
          title: '发布路径'
        },
        {
          dataIndex: 'projectPath',
          title: '项目路径',
          scopedSlots: { customRender: 'projectPath' }
        },
        {
          dataIndex: 'postCommandList',
          title: '后置命令',
          scopedSlots: { customRender: 'postCommandList' }
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
      await this.deleteInstanceList(_id)
      this.getInstanceList()
    },
    // on run task
    onRunTask (val) {
      this.$emit('switchTab', '2')
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
    },
    // 检查本地目录是否存在
    checkDirExist (path) {
      try {
        fs.accessSync(path)
        return true
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
.anticon
  margin-right 6px
  font-size 18px
</style>
