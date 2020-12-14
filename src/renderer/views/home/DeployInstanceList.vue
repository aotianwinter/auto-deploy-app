<template>
  <div>
    <!-- table -->
    <a-table :columns="columns" rowKey="_id" :data-source="deployInstanceList">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          v-if="deployInstanceList.length"
          title="Sure to run task?"
          @confirm="() => _deleteDeployInstanceList(record._id)"
        >
          <a-icon type="thunderbolt" theme="twoTone" />
        </a-popconfirm>
        <a-popconfirm
          v-if="deployInstanceList.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record._id)"
        >
          <a-icon type="delete" theme="twoTone" two-tone-color="#F56C6C" />
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>

<script>
import deployInstanceMixin from '@/store/deploy-instance-mixin'

export default {
  name: 'DeployInstanceList',
  mixins: [deployInstanceMixin],
  data () {
    return {
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
          dataIndex: 'serverPath',
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
          dataIndex: 'createdTime',
          title: '创建时间'
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created () {
    this._getDeployInstanceList()
  },
  methods: {
    async onDelete (_id) {
      await this._deleteDeployInstanceList(_id)
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
