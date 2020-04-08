<template>
  <div class="page-form">
    <a-card title="1.基础栅格">
      <div>
        <a-row>
          <a-col :span="12">col-12</a-col>
          <a-col :span="12">col-12</a-col>
        </a-row>
        <a-row>
          <a-col :span="8">col-8</a-col>
          <a-col :span="8">col-8</a-col>
          <a-col :span="8">col-8</a-col>
        </a-row>
        <a-row>
          <a-col :span="6">col-6</a-col>
          <a-col :span="6">col-6</a-col>
          <a-col :span="6">col-6</a-col>
          <a-col :span="6">col-6</a-col>
        </a-row>
      </div>
    </a-card>

    <a-card title="2.Flex 对齐">
      <div>
        <p>Align Top</p>
        <a-row type="flex" justify="center" align="top">
          <a-col :span="4"><p class="height-100">col-4</p></a-col>
          <a-col :span="4"><p class="height-50">col-4</p></a-col>
          <a-col :span="4"><p class="height-120">col-4</p></a-col>
          <a-col :span="4"><p class="height-80">col-4</p></a-col>
        </a-row>

        <p>Align Center</p>
        <a-row type="flex" justify="space-around" align="middle">
          <a-col :span="4"><p class="height-100">col-4</p></a-col>
          <a-col :span="4"><p class="height-50">col-4</p></a-col>
          <a-col :span="4"><p class="height-120">col-4</p></a-col>
          <a-col :span="4"><p class="height-80">col-4</p></a-col>
        </a-row>

        <p>Align Bottom</p>
        <a-row type="flex" justify="space-between" align="bottom">
          <a-col :span="4"><p class="height-100">col-4</p></a-col>
          <a-col :span="4"><p class="height-50">col-4</p></a-col>
          <a-col :span="4"><p class="height-120">col-4</p></a-col>
          <a-col :span="4"><p class="height-80">col-4</p></a-col>
        </a-row>
      </div>
    </a-card>

    <a-card title="3.flex排序">
      <div>
        <a-row type="flex">
          <a-col :span="6" :order="4">1 col-order-4</a-col>
          <a-col :span="6" :order="3">2 col-order-3</a-col>
          <a-col :span="6" :order="2">3 col-order-2</a-col>
          <a-col :span="6" :order="1">4 col-order-1</a-col>
        </a-row>
      </div>
    </a-card>

    <a-card title="4.flex布局">
      <div>
        <p>sub-element align left</p>
        <a-row type="flex" justify="start">
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
        </a-row>

        <p>sub-element align center</p>
        <a-row type="flex" justify="center">
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
        </a-row>

        <p>sub-element align right</p>
        <a-row type="flex" justify="end">
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
        </a-row>

        <p>sub-element monospaced arrangement</p>
        <a-row type="flex" justify="space-between">
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
        </a-row>

        <p>sub-element align full</p>
        <a-row type="flex" justify="space-around">
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
          <a-col :span="4">col-4</a-col>
        </a-row>
      </div>
    </a-card>

    <a-card title="5.区块间隔">
      <div class="gutter-example">
        <a-row :gutter="16">
          <a-col class="gutter-row" :span="6">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="6">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="6">
            <div class="gutter-box">col-6</div>
          </a-col>
          <a-col class="gutter-row" :span="6">
            <div class="gutter-box">col-6</div>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <a-card title="6.左右偏移">
      <div>
        <a-row>
          <a-col :span="8">col-8</a-col>
          <a-col :span="8" :offset="8">col-8</a-col>
        </a-row>
        <a-row>
          <a-col :span="6" :offset="6">col-6 col-offset-6</a-col>
          <a-col :span="6" :offset="6">col-6 col-offset-6</a-col>
        </a-row>
        <a-row>
          <a-col :span="12" :offset="6">col-12 col-offset-6</a-col>
        </a-row>
      </div>
    </a-card>
    <a-card title="7.其他属性的相应格式">
      <a-row>
        <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }"
          >Col</a-col
        >
        <a-col :xs="{ span: 11, offset: 1 }" :lg="{ span: 6, offset: 2 }"
          >Col</a-col
        >
        <a-col :xs="{ span: 5, offset: 1 }" :lg="{ span: 6, offset: 2 }"
          >Col</a-col
        >
      </a-row>
    </a-card>
    <a-card title="8.响应式布局">
      <a-row>
        <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">Col</a-col>
        <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4">Col</a-col>
        <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10">Col</a-col>
      </a-row>
    </a-card>
    <a-card title="9.栅格排序">
      <div>
        <a-row>
          <a-col :span="18" :push="6">col-18 col-push-6</a-col>
          <a-col :span="6" :pull="18">col-6 col-pull-18</a-col>
        </a-row>
      </div>
    </a-card>
    <a-card title="10.栅格配置器 ">
      <div id="components-grid-demo-playground">
        <div style="marginBottom:16px">
          <span style="marginRight:6px">Gutter (px): </span>
          <div style="width:50%">
            <a-slider
              :min="0"
              :max="Object.keys(gutters).length - 1"
              v-model="gutterKey"
              :marks="this.gutters"
              :step="null"
            />
          </div>
          <span style="marginRight:6px">Column Count:</span>
          <div style="width:50%">
            <a-slider
              :min="0"
              :max="Object.keys(colCounts).length - 1"
              v-model="colCountKey"
              :marks="this.colCounts"
              :step="null"
            />
          </div>
        </div>
        <a-row :gutter="gutters[gutterKey]">
          <a-col
            v-for="item in colCounts[colCountKey]"
            :key="item.toString()"
            :span="24 / colCounts[colCountKey]"
          >
            <div>Column</div>
          </a-col>
        </a-row>
        <pre v-text="rowColHtml"></pre>
      </div>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoForm', // 表单
  mixins: [GlobalMixin],
  data () {
    const gutters = {}
    const arr = [8, 16, 24, 32, 40, 48]
    arr.forEach((value, i) => {
      gutters[i] = value
    })
    const colCounts = {}
    const arr1 = [2, 3, 4, 6, 8, 12]
    arr1.forEach((value, i) => {
      colCounts[i] = value
    })
    return {
      gutterKey: 1,
      colCountKey: 2,
      colCounts,
      gutters
    }
  },
  computed: {
    rowColHtml () {
      const colCount = this.colCounts[this.colCountKey]
      const getter = this.gutters[this.gutterKey]
      let colCode = '<Row :gutter="' + getter + '">\n'
      for (let i = 0; i < colCount; i++) {
        const spanNum = 24 / colCount
        colCode += '  <Col :span="' + spanNum + '"/>\n'
      }
      colCode += '</Row>'
      return colCode
    }
  },
  mounted () {},
  methods: {
    enterLoading () {
      this.loading = true
    },
    enterIconLoading () {
      this.iconLoading = { delay: 1000 }
    },
    handleMenuClick (e) {
      console.log('click', e)
    },
    handleSizeChange (e) {
      this.size = e.target.value
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
