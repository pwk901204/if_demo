 <template>
  <div class="page-container">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="type = 'add';visible=true">添加</a-button>
    </div>
    <standard-table
      rowKey="typeId"
      :pagination="{total:dataSource.length}"
      :columns="columns"
      :dataSource="dataSource"
    />
    <a-modal :title="(type === 'add'? '添加':'修改')+'点位类型'" :visible="visible" @cancel="visible=false">
      <a-form :form="form">
        <a-form-item label="类型名称：" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="decorator.typeName" />
        </a-form-item>
        <a-form-item label="类型标识：" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="decorator.typeCode" />
        </a-form-item>
        <a-form-item label="显示方式：" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-select v-decorator="decorator.showType" @change="(value) => (isShowIcon = value == 2)">
            <a-select-option value="1">文字</a-select-option>
            <a-select-option value="2">图标</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          v-show="isShowIcon"
          label="图标地址："
          :label-col="{ span: 7 }"
          :wrapper-col="{ span: 12 }"
        >
          <upload-picture
            :value="'/map/getImgByImgName?url='+imgUrl"
            action="/map/uploadImg"
            @change="(url) => {imgUrl = url}"
          ></upload-picture>
        </a-form-item>
      </a-form>
      <template slot="footer" v-if="type=='add'">
        <a-button @click="handleReset">重置表单</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="ensure">确定添加</a-button>
      </template>
      <template slot="footer" v-if="type=='edit'">
        <a-button @click="handleReset">重置表单</a-button>
        <a-button type="primary" :loading="confirmLoading" @click="ensure">确定修改</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import decorator from './decorator.js'
import UploadPicture from '../../../common/components/upload/UploadPicture.vue'
export default {
  name: 'Login',
  components: {
    UploadPicture
  },
  data () {
    const columns = [
      { title: '序号', dataIndex: '_index' },
      { title: '类型名称', dataIndex: 'typeName' },
      { title: '类型标识', dataIndex: 'typeCode' },
      {
        title: '显示方式',
        customRender: (text, record, index) => {
          return record.showType === 1 ? '文字' : '图标'
        }
      },
      {
        title: '图标',
        dataIndex: 'iconAddr',
        customRender: (text, record, index) => {
          let src = '/map/getImgByImgName?url=' + text
          return (
            <img src={src} alt="" style={{ width: '100px', height: '50px' }} />
          )
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 170,
        customRender: (text, record, index) => {
          const isDefault = ['路径点', '起点', '终点'].indexOf(record.typeName) !== -1
          return (
            isDefault ? '' : <span class="table-oprt">
              <a href="javascript:;" onClick={() => { this.handleEdit(record) }}>修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除？" onConfirm={() => { this.handleDel(record) }}>
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
          )
        }
      }
    ]
    return {
      form: this.$form.createForm(this),
      columns,
      dataSource: [],
      decorator: Object.freeze(decorator),
      visible: false,
      type: 'add',
      isShowIcon: false,
      confirmLoading: false,
      typeId: '',
      imgUrl: ''
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    // 获取列表
    fetchList () {
      this.$axios.post('/map/pointTypeList').then(res => {
        // const dataSource = res.result.filter(item => item.typeCode !== 'start' && item.typeCode !== 'end')
        // res.result.map((item) => {
        //   item.typeName = item.typeName === '起点' || item.typeName === '终点' ? '' : item.typeName
        // })
        this.dataSource = res.result
      })
    },
    // 弹窗-确定
    ensure () {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          this.visible = false
          this.form.resetFields()
          values.iconAddr = this.imgUrl
          values.typeId = this.type === 'edit' && this.typeId ? this.typeId : ''
          let url = '/map/' + (this.type === 'edit' ? 'updatePointType' : 'addPointType')
          this.$axios.post(url, values).then(res => {
            if (res.resultCode === '200') {
              this.$store.dispatch('dict/fetchPoint')
              this.$message.success(this.type === 'edit' && this.typeId ? '修改成功' : '添加成功')
              setTimeout(() => {
                this.visible = false
                this.confirmLoading = false
                this.fetchList()
              }, 200)
            }
          })
        }
      })
    },
    // 重置表单
    handleReset (e) {
      this.form.resetFields()
      // this.visible = false
    },
    // 删除
    handleDel (record) {
      this.$axios.post('/map/deletePointType', { typeId: record.typeId }).then(res => {
        if (res.resultCode === '200') {
          this.$message.success('删除成功')
          this.$store.dispatch('dict/fetchPoint')
          this.fetchList()
        }
      })
    },
    // 编辑
    handleEdit (record) {
      this.type = 'edit'
      this.typeId = record.typeId
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue({
          typeName: record.typeName,
          typeCode: record.typeCode,
          showType: record.showType + ''
        })
        this.imgUrl = record.iconAddr
        this.isShowIcon = record.showType === 2
      })
    }
  }
}
</script>
