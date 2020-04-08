<template>
  <div class="model">
    <!-- 请求远程数据 start -->
    <a-card title="请求远程数据">
      <a-spin :spinning="loading">
        <a-icon slot="indicator"
                type="loading"
                style="font-size: 24px"
                spin />
        <a-table bordered
                 :columns="columns1"
                 :rowKey="record => record.login.uuid"
                 :dataSource="data"
                 :pagination="pagination"
                 @change="handleTableChange">
          <template slot="name"
                    slot-scope="name">
            {{name.first}} {{name.last}}
          </template>
        </a-table>
      </a-spin>
    </a-card>
    <!-- 请求远程数据 end-->
    <!-- 表格编辑 start -->
    <a-card title="表格编辑">
      <a-button class="editable-add-btn"
                @click="handleAdd">Add</a-button>
      <a-table bordered
               :dataSource="dataSource"
               :columns="columns2">
        <template slot="name"
                  slot-scope="text, record">
          <editable-cell :text="text"
                         @change="onCellChange(record.key, 'name', $event)" />
        </template>
        <template slot="operation"
                  slot-scope="text, record">
          <a-popconfirm v-if="dataSource.length"
                        title="Sure to delete?"
                        @confirm="() => onDelete(record.key)">
            <a href="javascript:;">Delete</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
    <!-- 表格编辑 end-->
    <!-- 表格嵌套 start -->
    <a-card title="表格嵌套">
      <a-table :columns="columns3"
               :dataSource="data3"
               class="components-table-demo-nested">
        <a slot="operation"
           slot-scope="text"
           href="javascript:;">Publish</a>
        <a-table slot="expandedRowRender"
                 slot-scope="text"
                 :columns="innerColumns"
                 :dataSource="innerData"
                 :pagination="false">
          <span slot="status"
                slot-scope="text">
            <a-badge status="success" />Finished </span>
          <span slot="operation"
                slot-scope="text"
                class="table-operation">
            <a href="javascript:;">Pause</a>
            <a href="javascript:;">Stop</a>
            <a-dropdown>
              <a-menu slot="overlay">
                <a-menu-item>
                  Action 1
                </a-menu-item>
                <a-menu-item>
                  Action 2
                </a-menu-item>
              </a-menu>
              <a href="javascript:;"> More
                <a-icon type="down" /> </a>
            </a-dropdown>
          </span>
        </a-table>
      </a-table>
    </a-card>
    <!-- 表格嵌套 end-->
    <!-- 带选择框 start -->
    <a-card title="带选择框">
      <a-table bordered
               :rowSelection="rowSelection"
               :columns="columns4"
               :dataSource="data4">
        <a slot="name"
           slot-scope="text"
           href="javascript:;">{{text}}</a>
      </a-table>
    </a-card>
    <!-- 带选择框 end-->
    <!-- api start -->
    <a-card title="api(table)">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>bordered</td>
            <td>是否展示外边框和列边框</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>childrenColumnName</td>
            <td>指定树形结构的列名</td>
            <td>string[]</td>
            <td>children</td>
          </tr>
          <tr>
            <td>columns</td>
            <td>表格列的配置描述，具体项见下表</td>
            <td>array</td>
            <td>-</td>
          </tr>
          <tr>
            <td>components</td>
            <td>覆盖默认的 table 元素</td>
            <td>object</td>
            <td>-</td>
          </tr>
          <tr>
            <td>dataSource</td>
            <td>数据数组</td>
            <td>any[]</td>
            <td></td>
          </tr>
          <tr>
            <td>defaultExpandAllRows</td>
            <td>初始时，是否展开所有行</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>defaultExpandedRowKeys</td>
            <td>默认展开的行</td>
            <td>string[]</td>
            <td>-</td>
          </tr>
          <tr>
            <td>expandedRowKeys</td>
            <td>展开的行，控制属性</td>
            <td>string[]</td>
            <td>-</td>
          </tr>
          <tr>
            <td>expandedRowRender</td>
            <td>额外的展开行</td>
            <td>Function(record, index, indent, expanded):VNode | slot="expandedRowRender" slot-scope="record, index, indent, expanded"</td>
            <td>-</td>
          </tr>
          <tr>
            <td>expandIcon</td>
            <td>自定义展开图标</td>
            <td>Function(props):VNode | slot="expandIcon" slot-scope="props"</td>
            <td>-</td>
          </tr>
          <tr>
            <td>expandRowByClick</td>
            <td>通过点击行来展开子行</td>
            <td>boolean</td>
            <td><code>false</code></td>
          </tr>
          <tr>
            <td>footer</td>
            <td>表格尾部</td>
            <td>Function(currentPageData)|slot-scope</td>
            <td></td>
          </tr>
          <tr>
            <td>indentSize</td>
            <td>展示树形数据时，每层缩进的宽度，以 px 为单位</td>
            <td>number</td>
            <td>15</td>
          </tr>
          <tr>
            <td>loading</td>
            <td>页面是否加载中</td>
            <td>boolean|<a href="/components/spin-cn">object</a></td>
            <td>false</td>
          </tr>
          <tr>
            <td>locale</td>
            <td>默认文案设置，目前包括排序、过滤、空数据文案</td>
            <td>object</td>
            <td>filterConfirm: '确定' <br> filterReset: '重置' <br> emptyText: '暂无数据'<br><br></td>
          </tr>
          <tr>
            <td>pagination</td>
            <td>分页器，参考<a href="#pagination">配置项</a>或 <a href="/components/pagination-cn/">pagination</a>文档，设为 false 时不展示和进行分页</td>
            <td>object</td>
            <td></td>
          </tr>
          <tr>
            <td>rowClassName</td>
            <td>表格行的类名</td>
            <td>Function(record, index):string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>rowKey</td>
            <td>表格行 key 的取值，可以是字符串或一个函数</td>
            <td>string|Function(record):string</td>
            <td>'key'</td>
          </tr>
          <tr>
            <td>rowSelection</td>
            <td>列表项是否可选择，<a href="#rowSelection">配置项</a></td>
            <td>object</td>
            <td>null</td>
          </tr>
          <tr>
            <td>scroll</td>
            <td>设置横向或纵向滚动，也可用于指定滚动区域的宽和高，建议为 <code>x</code> 设置一个数字，如果要设置为 <code>true</code>，需要配合样式 <code>.ant-table td { white-space: nowrap; }</code></td>
            <td>{ x: number | true, y: number }</td>
            <td>-</td>
          </tr>
          <tr>
            <td>showHeader</td>
            <td>是否显示表头</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>size</td>
            <td>表格大小</td>
            <td>default | middle | small</td>
            <td>default</td>
          </tr>
          <tr>
            <td>title</td>
            <td>表格标题</td>
            <td>Function(currentPageData)|slot-scope</td>
            <td></td>
          </tr>
          <tr>
            <td>customHeaderRow</td>
            <td>设置头部行属性</td>
            <td>Function(column, index)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>customRow</td>
            <td>设置行属性</td>
            <td>Function(record, index)</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </a-card>
    <a-card title="api(Column)">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>align</td>
            <td>设置列内容的对齐方式</td>
            <td>'left' | 'right' | 'center'</td>
            <td>'left'</td>
          </tr>
          <tr>
            <td>colSpan</td>
            <td>表头列合并,设置为 0 时，不渲染</td>
            <td>number</td>
            <td></td>
          </tr>
          <tr>
            <td>dataIndex</td>
            <td>列数据在数据项中对应的 key，支持 <code>a.b.c</code> 的嵌套写法</td>
            <td>string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>filterDropdown</td>
            <td>可以自定义筛选菜单，此函数只负责渲染图层，需要自行编写各种交互</td>
            <td>VNode | slot-scope</td>
            <td>-</td>
          </tr>
          <tr>
            <td>filterDropdownVisible</td>
            <td>用于控制自定义筛选菜单是否可见</td>
            <td>boolean</td>
            <td>-</td>
          </tr>
          <tr>
            <td>filtered</td>
            <td>标识数据是否经过过滤，筛选图标会高亮</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>filteredValue</td>
            <td>筛选的受控属性，外界可用此控制列的筛选状态，值为已筛选的 value 数组</td>
            <td>string[]</td>
            <td>-</td>
          </tr>
          <tr>
            <td>filterIcon</td>
            <td>自定义 fiter 图标。</td>
            <td>VNode | (filtered: boolean, column: Column) =&gt; vNode |slot |slot-scope</td>
            <td>false</td>
          </tr>
          <tr>
            <td>filterMultiple</td>
            <td>是否多选</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>filters</td>
            <td>表头的筛选菜单项</td>
            <td>object[]</td>
            <td>-</td>
          </tr>
          <tr>
            <td>fixed</td>
            <td>列是否固定，可选 <code>true</code>(等效于 left) <code>'left'</code> <code>'right'</code></td>
            <td>boolean|string</td>
            <td>false</td>
          </tr>
          <tr>
            <td>key</td>
            <td>Vue 需要的 key，如果已经设置了唯一的 <code>dataIndex</code>，可以忽略这个属性</td>
            <td>string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>customRender</td>
            <td>生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引，@return 里面可以设置表格行/列合并,可参考 demo 表格行/列合并</td>
            <td>Function(text, record, index) {}|slot-scope</td>
            <td>-</td>
          </tr>
          <tr>
            <td>sorter</td>
            <td>排序函数，本地排序使用一个函数(参考 <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort">Array.sort</a> 的 compareFunction)，需要服务端排序可设为 true</td>
            <td>Function|boolean</td>
            <td>-</td>
          </tr>
          <tr>
            <td>sortOrder</td>
            <td>排序的受控属性，外界可用此控制列的排序，可设置为 <code>'ascend'</code> <code>'descend'</code> <code>false</code></td>
            <td>boolean|string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>title</td>
            <td>列头显示文字</td>
            <td>string|slot</td>
            <td>-</td>
          </tr>
          <tr>
            <td>width</td>
            <td>列宽度</td>
            <td>string|number</td>
            <td>-</td>
          </tr>
          <tr>
            <td>customCell</td>
            <td>设置单元格属性</td>
            <td>Function(record, rowIndex)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>customHeaderCell</td>
            <td>设置头部单元格属性</td>
            <td>Function(column)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>onFilter</td>
            <td>本地模式下，确定筛选的运行函数, 使用 template 或 jsx 时作为<code>filter</code>事件使用</td>
            <td>Function</td>
            <td>-</td>
          </tr>
          <tr>
            <td>onFilterDropdownVisibleChange</td>
            <td>自定义筛选菜单可见变化时调用，使用 template 或 jsx 时作为<code>filterDropdownVisibleChange</code>事件使用</td>
            <td>function(visible) {}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>slots</td>
            <td>使用 columns 时，可以通过该属性配置支持 slot 的属性，如 <code>slots: { filterIcon: 'XXX'}</code></td>
            <td>object</td>
            <td>-</td>
          </tr>
          <tr>
            <td>scopedSlots</td>
            <td>使用 columns 时，可以通过该属性配置支持 slot-scope 的属性，如 <code>scopedSlots: { customRender: 'XXX'}</code></td>
            <td>object</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    </a-card>
    <!-- api end -->
  </div>
</template>
<script>
import EditableCell from './EditableCell'

// demo1
const columns1 = [{
  title: 'Name',
  dataIndex: 'name',
  sorter: true,
  width: '20%',
  scopedSlots: { customRender: 'name' }
},
{
  title: 'Gender',
  dataIndex: 'gender',
  filters: [{ text: 'Male', value: 'male' }, { text: 'Female', value: 'female' }],
  width: '20%'
},
{
  title: 'Email',
  dataIndex: 'email'
}
]

// demo 3
const columns3 = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Platform', dataIndex: 'platform', key: 'platform' },
  { title: 'Version', dataIndex: 'version', key: 'version' },
  { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  { title: 'Creator', dataIndex: 'creator', key: 'creator' },
  { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
  { title: 'Action', key: 'operation', scopedSlots: { customRender: 'operation' } }
]

const data3 = []
for (let i = 0; i < 3; ++i) {
  data3.push({
    key: i,
    name: 'Screem',
    platform: 'iOS',
    version: '10.3.4.5654',
    upgradeNum: 500,
    creator: 'Jack',
    createdAt: '2014-12-24 23:12:00'
  })
}

const innerColumns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Status', key: 'state', scopedSlots: { customRender: 'status' } },
  { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
  {
    title: 'Action',
    dataIndex: 'operation',
    key: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const innerData = []
for (let i = 0; i < 3; ++i) {
  innerData.push({
    key: i,
    date: '2014-12-24 23:12:00',
    name: 'This is production name',
    upgradeNum: 'Upgraded: 56'
  })
}

// demo4
const columns4 = [{
  title: 'Name',
  dataIndex: 'name',
  scopedSlots: { customRender: 'name' }
},
{
  title: 'Age',
  dataIndex: 'age'
},
{
  title: 'Address',
  dataIndex: 'address'
}
]
const data4 = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park'
},
{
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park'
},
{
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park'
},
{
  key: '4',
  name: 'Disabled User',
  age: 99,
  address: 'Sidney No. 1 Lake Park'
}
]
export default {
  components: {
    EditableCell
  },
  mounted () {
    this.fetch()
  },
  data () {
    return {
      // demo1
      data: [],
      pagination: {},
      loading: false,
      columns1,

      // demo2
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0'
      },
      {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1'
      }
      ],
      count: 2,
      columns2: [{
        title: 'name',
        dataIndex: 'name',
        width: '30%',
        scopedSlots: { customRender: 'name' }
      },
      {
        title: 'age',
        dataIndex: 'age'
      },
      {
        title: 'address',
        dataIndex: 'address'
      },
      {
        title: 'operation',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      }
      ],

      // demo3
      data3,
      columns3,
      innerColumns,
      innerData,

      // demo4
      data4,
      columns4
    }
  },
  methods: {
    // demo1
    handleTableChange (pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        results: pagination.pageSize,
        page: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      })
    },
    fetch (params = {}) {
      this.loading = true
      setTimeout(() => {
        this.$axios.mock('./mock/table.json').then(data => {
          const pagination = { ...this.pagination }
          pagination.total = 200
          this.loading = false
          this.data = data.results
          this.pagination = pagination
        })
      }, 3000)
    },
    // demo2
    onCellChange (key, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.dataSource = dataSource
      }
    },
    onDelete (key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    handleAdd () {
      const { count, dataSource } = this
      const newData = {
        key: count,
        name: `Edward King ${count}`,
        age: 32,
        address: `London, Park Lane no. ${count}`
      }
      this.dataSource = [...dataSource, newData]
      this.count = count + 1
    }
  },

  computed: {
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name
          }
        })
      }
    }
  }
}

</script>
<style scoped>
.model {
  padding: 10px;
  background: #fff;
}

.ant-table-body {
  width: 100%;
}

.ant-btn {
  margin: 10px 15px;
}

.model .ant-card {
  margin-bottom: 10px;
}

table th,
table td {
  border-right: 1px solid #e8e8e8;
}

table {
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.ant-table-thead > tr > th {
  background: #fafafa;
}
</style>
