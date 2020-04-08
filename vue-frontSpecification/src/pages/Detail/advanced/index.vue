
<template>
  <div class="detail">
    <!-- actions -->
    <template slot="action">
      <a-button-group style="margin-right: 4px;">
        <a-button>操作</a-button>
        <a-button>操作</a-button>
        <a-button>
          <a-icon type="ellipsis" />
        </a-button>
      </a-button-group>
      <a-button type="primary">主操作</a-button>
    </template>

    <a-card class="detail-card" :bordered="false" title="流程进度">
      <a-steps :current="1">
        <a-step>
          <span style="font-size: 14px" slot="title">创建项目</span>
          <template slot="description">
            <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); text-align: left;" slot="description">
              <div style="margin: 8px 0 4px">
                曲丽丽
              </div>
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step title="部门初审">
          <span style="font-size: 14px" slot="title">部门初审</span>
          <template slot="description">
            <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45);text-align: left;" slot="description">
              <div style="margin: 8px 0 4px">
                周毛毛
              </div>
            </div>
          </template>
        </a-step>
        <a-step title="财务复核">
          <span style="font-size: 14px" slot="title">财务复核</span>
        </a-step>
        <a-step title="完成">
          <span style="font-size: 14px" slot="title">完成</span>
        </a-step>
      </a-steps>
    </a-card>

    <a-card class="detail-card" style="margin-top: 10px" :bordered="false" title="用户信息">
      <detail-list>
        <detail-list-item term="用户姓名">付晓晓</detail-list-item>
        <detail-list-item term="会员卡号">32943898021309809423</detail-list-item>
        <detail-list-item term="身份证">3321944288191034921</detail-list-item>
        <detail-list-item term="联系方式">18112345678</detail-list-item>
        <detail-list-item term="联系地址">浙江省杭州市西湖区黄姑山路工专路交叉路口</detail-list-item>
      </detail-list>
      <detail-list title="信息组">
        <a-table :columns="operationColumns" :dataSource="operation1" :pagination="false">
          <template slot="status" slot-scope="status">
            <a-badge :status="status | statusTypeFilter" :text="status | statusFilter" />
          </template>
        </a-table>
      </detail-list>
    </a-card>
  </div>
</template>

<script>
import DetailList from '@/components/tools/DetailList';
const DetailListItem = DetailList.Item;
export default {
  name: 'Advanced',
  components: {
    DetailList,
    DetailListItem
  },
  data() {
    return {
      tabList: [
        {
          key: '1',
          tab: '操作日志一'
        },
        {
          key: '2',
          tab: '操作日志二'
        },
        {
          key: '3',
          tab: '操作日志三'
        }
      ],
      activeTabKey: '1',

      operationColumns: [
        {
          title: '操作类型',
          dataIndex: 'type',
          key: 'type'
        },
        {
          title: '操作人',
          dataIndex: 'name',
          key: 'name'
        },
        {
          title: '执行结果',
          dataIndex: 'status',
          key: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作时间',
          dataIndex: 'updatedAt',
          key: 'updatedAt'
        },
        {
          title: '备注',
          dataIndex: 'remark',
          key: 'remark'
        }
      ],
      operation1: [
        {
          key: 'op1',
          type: '订购关系生效',
          name: '曲丽丽',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        },
        {
          key: 'op5',
          type: '创建订单',
          name: '汗牙牙',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ],
      operation2: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        },
        {
          key: 'op4',
          type: '提交订单',
          name: '林东东',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '很棒'
        }
      ],
      operation3: [
        {
          key: 'op2',
          type: '财务复审',
          name: '付小小',
          status: 'reject',
          updatedAt: '2017-10-03  19:23:12',
          remark: '不通过原因'
        },
        {
          key: 'op3',
          type: '部门初审',
          name: '周毛毛',
          status: 'agree',
          updatedAt: '2017-10-03  19:23:12',
          remark: '-'
        }
      ]
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        agree: '成功',
        reject: '驳回'
      };
      return statusMap[status];
    },
    statusTypeFilter(type) {
      const statusTypeMap = {
        agree: 'success',
        reject: 'error'
      };
      return statusTypeMap[type];
    }
  }
};
</script>

<style lang="less" scoped>
.detail-layout {
  margin-left: 44px;
}
.text {
  color: rgba(0, 0, 0, 0.45);
}

.heading {
  color: rgba(0, 0, 0, 0.85);
  font-size: 20px;
}

.no-data {
  color: rgba(0, 0, 0, 0.25);
  text-align: center;
  line-height: 64px;
  font-size: 16px;

  i {
    font-size: 24px;
    margin-right: 16px;
    position: relative;
    top: 3px;
  }
}

.mobile {
  .detail-layout {
    margin-left: unset;
  }
  .status-list {
    text-align: left;
  }
}

.detail {
  /deep/ .detail-card {
    padding: 0 20px;

    .ant-table {
      font-size: 12px;
    }

    .ant-card-head {
      padding: 0;
      .ant-card-head-title {
        padding: 13px 0;
      }
    }

    .ant-card-body {
      padding: 24px 0;
    }

    .ant-table-thead > tr > th {
      font-weight: bold;
    }
  }
}
</style>
