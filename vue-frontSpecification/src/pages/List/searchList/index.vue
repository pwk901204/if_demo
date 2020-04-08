<template>
  <div class="model page-list">
    <div class="page-search">
      <a-form :form="form"
              @submit="searchCall">
        <a-row class="flexBetween">
          <a-col :span="6">
            <a-form-item label="所属年级">
              <a-select v-decorator="ssnj"
                        placeholder="请选择">
                <a-select-option value="1">
                  年纪1
                </a-select-option>
                <a-select-option value="2">
                  年纪2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属系部">
              <a-select v-decorator="ssxb"
                        placeholder="请选择">
                <a-select-option value="1">
                  系部1
                </a-select-option>
                <a-select-option value="2">
                  系部2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属专业">
              <a-select v-decorator="sszy"
                        placeholder="请选择">
                <a-select-option value="1">
                  所属专业1
                </a-select-option>
                <a-select-option value="2">
                  所属专业2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="所属班级">
              <a-select v-decorator="ssbj"
                        placeholder="请选择">
                <a-select-option value="1">
                  所属班级1
                </a-select-option>
                <a-select-option value="2">
                  所属班级2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="flexBetween">
          <a-col :span="6">
            <a-form-item label="按姓名">
              <a-input v-decorator="xm"
                       placeholder="请按姓名工号查询" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="事件名称">
              <a-select v-decorator="sjmc"
                        placeholder="请选择">
                <a-select-option value="1">
                  事件名称1
                </a-select-option>
                <a-select-option value="2">
                  事件名称2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="事件选项">
              <a-select v-decorator="sjxx"
                        placeholder="请选择">
                <a-select-option value="1">
                  事件选项1
                </a-select-option>
                <a-select-option value="2">
                  事件选项2
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row class="center">
          <a-col>
            <div class="page-search-btn">
              <a-button type="primary"
                        html-type="submit">
                查询
              </a-button>
              <a-button class="more-search"
                        type="link"> 高级搜索
                <a-icon type="down" />
              </a-button>
            </div>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 带选择框 start -->
    <div class="page-list-wrap">
      <div class="page-list-title">
        <h2>待审核</h2>
        <div class="wrap-btn">
          <a-button type="primary"
                    ghost><i class="iconfont iconadd"></i> 新增</a-button>
          <a-button type="primary"
                    ghost><i class="iconfont iconedit"></i> 编辑</a-button>
          <a-button type="primary"
                    ghost><i class="iconfont icondel"></i> 删除</a-button>
        </div>
      </div>
      <a-table :rowSelection="rowSelection"
               :columns="columns4"
               :dataSource="data4"
               :pagination="pagination">
        <a slot="name"
           slot-scope="text"
           href="javascript:;">{{text}}</a>
        <div slot="action"
             slot-scope="record"
             class="row-operator">
          <a-button type="link"
                    @click="addItem(record)">查看</a-button>
          <a-button type="link"
                    @click="addItem(record)">导出</a-button>
          <a-button type="link"
                    @click="addItem(record)">退回</a-button>
          <a-dropdown>
            <a-menu slot="overlay">
              <a-button type="link"
                        @click="addItem(record)">查看</a-button>
              <a-button type="link"
                        @click="addItem(record)">导出</a-button>
              <a-button type="link"
                        @click="addItem(record)">退回</a-button>
            </a-menu>
            <a-button type="link"
                      @click="addItem(record)">更多
              <a-icon type="down" />
            </a-button>
          </a-dropdown>
        </div>
      </a-table>
    </div>

    <!-- 带选择框 end-->

  </div>
</template>
<script>
import validate from './validate'
// demo4
const columns4 = [{
  title: '姓名',
  dataIndex: 'name',
  scopedSlots: { customRender: 'name' }
},
{
  title: '年龄',
  dataIndex: 'age'
},
{
  title: '地址',
  dataIndex: 'address'
},
{
  title: '操作',
  align: 'center',
  width: 360,
  scopedSlots: { customRender: 'action' }
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
  },
  mounted () {
  },
  mixins: [validate],
  data () {
    return {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 19
      },
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),
      // demo1
      data: [],
      pagination: {},
      loading: false,
      data4,
      columns4,
      pagination: {
        total: 0,
        pageSize: 2, // 每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        showQuickJumper: true
      }
    }
  },
  methods: {
    searchCall (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    addItem (item) {
      console.log(item)
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
<style lang="less">
@import url("./index.less");
</style>
