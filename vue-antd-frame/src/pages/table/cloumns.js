export const columns = h => [
  {
    title: '操作',
    align: 'center',
    width: 120,
    customRender: (record) => {
      return (
        <div class="row-operator">
          <a href="javascript:;" onClick={() => this.showModal(true, record)}>查看</a>
          <a-divider type="vertical" />
          <a-popconfirm title="确定删除该?" onConfirm={() => this.onDelete(record)}>
            <a href="javascript:;">删除</a>
          </a-popconfirm>
        </div>
      )
    }
  },
  {
    title: '计划',
    dataIndex: '_index'
  },
  {
    title: '起始时间',
    dataIndex: 'customer'
  },

  {
    title: '截至时间',
    dataIndex: 'pdepartment'
  },
  {
    title: '终端替换进度',
    dataIndex: 'rstatus',
    width: 120
  },
  {
    title: '外设替换进度',
    dataIndex: 'pstatusName1',
    width: 120
  },
  {
    title: '完成状态',
    dataIndex: 'pstatusName2',
    width: 120
  },
  {
    title: '是否采购',
    width: 120,
    align: 'center',
    customRender: (record) => {
      return <div>
        {record.SF ? <a-icon style={{ fontSize: '24px', color: '#eb2f96' }} type="check-circle" /> : <a-icon style={{ fontSize: '24px', color: '#52c41a' }} type="minus-circle" />}
      </div>
    }
  }]
