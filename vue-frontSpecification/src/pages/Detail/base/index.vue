<template>
  <a-card class="detail" :bordered="false">
    <detail-list title="退款申请">
      <detail-list-item term="取货单号">1000000000</detail-list-item>
      <detail-list-item term="状态">已取货</detail-list-item>
      <detail-list-item term="销售单号">1234123421</detail-list-item>
      <detail-list-item term="子订单">3214321432</detail-list-item>
    </detail-list>
    <a-divider />
    <detail-list title="用户信息">
      <detail-list-item term="用户姓名">付小小</detail-list-item>
      <detail-list-item term="联系电话">18100000000</detail-list-item>
      <detail-list-item term="常用快递">菜鸟仓储</detail-list-item>
      <detail-list-item term="取货地址">浙江省杭州市西湖区万塘路18号</detail-list-item>
      <detail-list-item term="备注"> 无</detail-list-item>
    </detail-list>
    <a-divider />

    <div class="title">退货商品</div>
    <a-table :columns="columns" :dataSource="data">
      <a slot="name" slot-scope="text" href="javascript:;">{{ text }}</a>
      <span slot="customTitle"> <i class="iconfont iconxiaolian"></i> Name</span>
      <span slot="tags" slot-scope="tags">
        <a-tag v-for="tag in tags" :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'" :key="tag">
          {{ tag.toUpperCase() }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a href="javascript:;">Invite 一 {{ record.name }}</a>
        <a-divider type="vertical" />
        <a href="javascript:;">Delete</a>
        <a-divider type="vertical" />
        <a href="javascript:;" class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
      </span>
    </a-table>
  </a-card>
</template>

<script>
import DetailList from '@/components/tools/DetailList';
const DetailListItem = DetailList.Item;
const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' }
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age'
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    scopedSlots: { customRender: 'tags' }
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer']
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser']
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher']
  }
];
export default {
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      data,
      columns
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        processing: '进行中',
        success: '完成',
        failed: '失败'
      };
      return statusMap[status];
    }
  },
  computed: {
    title() {
      return this.$route.meta.title;
    }
  }
};
</script>

<style lang="less" scoped>
.title {
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 16px;
}

.detail {
  /deep/ .ant-card-body {
    padding-left: 20px;
    padding-top: 18px;

    .ant-divider-horizontal {
      margin: 10px 0 26px;
    }

    .ant-table {
      font-size: 12px;
      .ant-table-thead > tr > th {
        color: #4c4c4c;
      }

      .ant-table-tbody > tr > td {
        color: #666;
      }
    }
  }
}
</style>
