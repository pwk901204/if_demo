<template>
  <div class="page-map">
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="onAdd">新增地图</a-button>
    </div>
    <standard-table
      rowKey="mapId"
      :pagination="{total:dataSource.length}"
      :columns="columns"
      :dataSource="dataSource"
    />
    <!-- <a-table :dataSource="dataSource" :columns="columns">
      <template slot="operation" slot-scope="text, record">
        <a-popconfirm
          v-if="dataSource.length"
          title="Sure to delete?"
          @confirm="() => onDelete(record.key)"
        >
          <a href="javascript:;">删除</a>
        </a-popconfirm>
        <a-button @click="lookAll">查看所以图层</a-button>
        <a-button @click="lookAll">添加层级</a-button>
      </template>
    </a-table>-->
    <a-modal
      :title="type === 'layer'? '添加图层' : (type === 'add'? '新增':'修改')+'地图'"
      :visible="visible"
      @ok="handleSubmit"
      @cancel="visible=false"
      :afterClose="() => fetchList()"
    >
      <a-form :form="form" @submit="handleSubmit">
        <a-form-item
          label="地图名称"
          v-show="type !== 'layer'"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-decorator="[
              'mapName',
              {
                rules: [
                  { required: true, message: '请输入文章关键字(标题)' }
                ]
              }
            ]"
            placeholder="请输入文章关键字(标题)"
          />
        </a-form-item>
        <a-form-item
          label="地图标识"
          v-show="type !== 'layer'"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-input
            v-decorator="[
              'mapCode',
              {
                rules: [
                  { required: true, message: '请输入文章关键字(标题)' }
                ]
              }
            ]"
            placeholder="请输入文章关键字(标题)"
            :disabled="type === 'edit'"
          />
        </a-form-item>
        <a-form-item label="图层" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
          <div class="clearfix">
            <a-upload
              :action="action"
              accept="image/*"
              class="map-layer-upload"
              :fileList="fileList"
              v-decorator="['mapLayer',{rules: [{ required: true, message: '请输入上传图层' } ]}]"
              :remove="fileRemove"
              @preview="modifyLayer"
              @change="handleChange"
            >
              <div v-show="fileList.length < 1">
                <a-button>上传</a-button>
              </div>
            </a-upload>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data () {
    const columns = [
      {
        title: '地图名称',
        dataIndex: 'mapName'
      },
      {
        title: '地图标识',
        dataIndex: 'mapCode'
      },
      {
        title: '地图层级',
        dataIndex: 'mapLayers'
      },
      {
        title: '最小瓦片数（x）',
        dataIndex: 'mapX'
      },
      {
        title: '最小瓦片数（y）',
        dataIndex: 'mapY'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        width: 270,
        customRender: (text, record, index) => {
          return (
            <span class="table-oprt">
              <a href="javascript:;" onClick={() => { this.addLayer(record) }}>添加图层</a>
              <a-divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.edit(record) }}>修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确定删除？"
                onConfirm={() => { this.onDelete(record) }}
              >
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
          )
        }
      }
    ]
    return {
      visible: false,
      fileList: [],
      form: this.$form.createForm(this),
      dataSource: [],
      columns,
      action: '',
      type: 'add',
      path: '', // 图层图片的路径
      mapId: '',
      mapLayers: 1, // 图层
      mapCode: '', // 新增图层时
      modifyLayerData: {} // 修改图层时提交后台的数据
    }
  },
  mounted () {
    const NODE_ENV = process.env.NODE_ENV
    this.action = `${NODE_ENV === 'development' ? '/api' : ''}/map/map/uploadImg`

    this.fetchList()
  },
  methods: {
    handleChange ({ fileList }) {
      this.fileList = fileList
      if (this.type === 'modifyLayer') {
        // 修改图层
        if (fileList[fileList.length - 1].status === 'done') {
          this.modifyLayerData.imagePath = fileList[fileList.length - 1].response.result
          console.log(this.modifyLayerData)
          this.fileList = fileList.slice(0, fileList.length - 1)
          this.$axios.post('/map/subMap', this.modifyLayerData).then(res => {
            if (res.resultCode === '200') {
              this.$message.success('修改成功')
              this.$store.dispatch('dict/fetchMap')
            } else {
              this.$message.warn(res.resultMsg)
            }
          })
        }
      } else if (this.type !== 'edit') {
        // 新增图层
        if (fileList[0].status === 'done') {
          this.fileList[0].name = '图层' + (this.type === 'layer' ? this.mapLayers += 1 : this.mapLayers)
          this.path = fileList[0].response.result
        }
      }
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        delete values.mapLayer
        if (this.type === 'layer' || !err) {
          values.mapLayers = this.mapLayers
          values.subOrUpdate = 0
          values.imagePath = this.path
          values.mapCode = this.type === 'layer' ? this.mapCode : values.mapCode
          values.mapId = this.type !== 'add' && this.mapId ? this.mapId : ''
          let url = '/map/' + (this.type === 'edit' ? 'updateMap' : 'subMap')
          this.$axios.post(url, values).then(res => {
            if (res.resultCode === '200') {
              this.$message.success(this.type === 'edit' && this.mapId ? '修改成功' : '新增成功')
              this.visible = false
              this.$store.dispatch('dict/fetchMap')
            } else {
              this.$message.warn(res.resultMsg)
            }
          })
        }
      })
    },
    // 获取列表
    async fetchList () {
      const res = await this.$axios.get('/map/queryMapList')
      this.dataSource = Object.freeze(res.result)
    },
    // 新增
    onAdd () {
      this.type = 'add'
      this.visible = true
      this.form.resetFields()
      this.fileList = []
    },
    // 删除
    onDelete (record) {
      this.$axios.post('/map/delMap', { mapId: record.mapId }).then(res => {
        if (res.resultCode === '200') {
          this.$message.success('删除成功')
          this.fetchList()
          this.$store.dispatch('dict/fetchMap')
        } else {
          this.$message.warn(res.resultMsg)
        }
      })
    },
    // 修改
    edit (record) {
      this.type = 'edit'
      this.visible = true
      this.mapId = record.mapId
      this.$nextTick(() => {
        this.form.setFieldsValue({
          mapName: record.mapName,
          mapCode: record.mapCode,
          mapLayer: record.mapLayers
        })
      })
      let files = []
      for (let i = 0; i < record.mapLayers; i++) {
        files.push({
          uid: i,
          name: '图层' + (i + 1),
          status: 'done',
          mapCode: record.mapCode,
          mapId: record.mapId
        })
      }
      this.fileList = files
      // 设置最后一个图层可删除
      this.$nextTick(() => {
        let closeDom = []
        let i = 0
        let btnDom = document.getElementsByClassName('map-layer-upload')[0].firstElementChild
        btnDom.style.position = 'absolute'
        let dom = document.getElementsByClassName('map-layer-upload')[0].getElementsByTagName('i')
        for (; i < dom.length; i++) {
          let attribute = dom[i].getAttribute('class')
          if (attribute === 'anticon anticon-close') {
            closeDom.push(dom[i])
          }
        }
        if (closeDom.length > 1) {
          for (let j = 0; j < closeDom.length - 1; j++) {
            closeDom[j].style.display = 'none'
          }
        } else {
          closeDom[0].style.display = 'none'
        }
      })
    },
    // 添加图层
    addLayer (record) {
      this.type = 'layer'
      this.visible = true
      this.fileList = []
      this.mapId = record.mapId
      this.mapLayers = record.mapLayers
      this.mapCode = record.mapCode
      this.$nextTick(() => {
        let btnDom = document.getElementsByClassName('map-layer-upload')[0].firstElementChild
        btnDom.style.position = 'absolute'
      })
    },
    // 修改图层
    modifyLayer (obj) {
      this.type = 'modifyLayer'
      let btnDom = document.getElementsByClassName('map-layer-upload')[0].firstElementChild
      btnDom.getElementsByTagName('button')[0].click()
      this.modifyLayerData = {
        mapLayers: obj.name.replace(/[^\d]/g, ' '),
        mapId: obj.mapId,
        mapCode: obj.mapCode,
        subOrUpdate: 1
      }
    },
    // 图层删除
    fileRemove (obj) {
      if (this.type === 'edit') {
        let params = {
          mapLayers: obj.name.replace(/[^\d]/g, ' '),
          mapId: obj.mapId,
          mapCode: obj.mapCode
        }
        this.$axios.post('/map/delMapImg', params).then(res => {
          if (res.resultCode === '200') {
            this.$message.success('删除成功')
            this.$store.dispatch('dict/fetchMap')
          } else {
            this.$message.warn(res.resultMsg)
          }
        })
      } else {
        this.fileList = []
      }
    }
  }
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
.map-layer-upload .ant-upload-list-item .anticon-close {
  opacity: 1;
}
</style>
