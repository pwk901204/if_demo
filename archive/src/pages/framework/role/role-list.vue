<template>
  <div class="framework-role-list">
    <m-table :columns="columns" :dataSource="dataSource" />
  </div>
</template>
<script>
export default {
  name: 'FrameworkRoleList',
  data () {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name'
      },
      {
        title: '状态',
        dataIndex: 'status'
      },
      {
        title: '操作',
        width: '150px',
        dataIndex: 'action',
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      columns: Object.freeze(columns),
      dataSource: []
    }
  }
}
</script>
