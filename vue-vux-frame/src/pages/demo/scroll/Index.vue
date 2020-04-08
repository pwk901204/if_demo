<template>
  <div class="page-demo-scroll">
    <tab>
      <tab-item selected @on-item-click="changeTab">全部</tab-item>
      <tab-item @on-item-click="changeTab">奶粉</tab-item>
      <tab-item @on-item-click="changeTab">图书</tab-item>
    </tab>
    <mescroll-vue ref="mescroll" :down="mescrollDown" :up="mescrollUp" @init="mescrollInit">
      <!--展示上拉加载的数据列表-->
      <ul id="listWrap" class="data-list">
        <li v-for="pd in dataList" :key="pd.id">
          <img class="pd-img" :imgurl="pd.pdImg" src="../../../../static/mescroll/img/loading.png" />
          <p class="pd-name">{{pd.pdName}}</p>
          <p class="pd-price">{{pd.pdPrice}} 元</p>
          <p class="pd-sold">已售{{pd.pdSold}}件</p>
        </li>
      </ul>
    </mescroll-vue>
    <!-- <empty v-show="dataList.length == 0" id="empty" /> -->
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux'
import MescrollVue from 'mescroll.js/mescroll.vue'
import mockData from './pdlist'
export default {
  name: 'DemoScroll', // 下拉刷新和上拉加载
  components: {
    Tab, TabItem, MescrollVue
  },
  data () {
    return {
      mescroll: null, // mescroll实例对象
      mescrollDown: {}, // 下拉刷新的配置. (如果下拉刷新和上拉加载处理的逻辑是一样的,则mescrollDown可不用写了)
      mescrollUp: { // 上拉加载的配置.
        callback: this.upCallback, // 上拉回调
        // 以下是一些常用的配置,当然不写也可以的.
        page: {
          num: 0, // 当前页 默认0,回调之前会加1; 即callback(page)会从1开始
          size: 10 // 每页数据条数,默认10
        },
        htmlNodata: '<p class="upwarp-nodata">-- END --</p>',
        // 如果列表已无数据,可设置列表的总数量要大于5才显示无更多数据;
        // 避免列表数据过少 (比如只有一条数据), 显示无更多数据会不好看
        // 这就是为什么无更多数据有时候不显示的原因
        noMoreSize: 5,
        toTop: {  // 回到顶部按钮
          src: './static/mescroll/mescroll-totop.png',
          offset: 1000 // 列表滚动1000px才显示回到顶部按钮
        },
        empty: { // 暂无数据
          warpId: 'listWrap',
          icon: './static/mescroll/mescroll-empty.png',
          tip: '暂无相关数据~'
        },
        lazyLoad: {
          use: true // 是否开启懒加载,默认false
        }
      },
      dataList: [], // 列表数据
      pdType: 0 // 菜单
    }
  },
  beforeRouteEnter (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteEnter不用写
    next(vm => {
      // 滚动到原来的列表位置,恢复顶部按钮和isBounce的配置
      vm.$refs.mescroll && vm.$refs.mescroll.beforeRouteEnter()
    })
  },
  beforeRouteLeave (to, from, next) { // 如果没有配置顶部按钮或isBounce,则beforeRouteLeave不用写
    // 记录列表滚动的位置,隐藏顶部按钮和isBounce的配置
    this.$refs.mescroll && this.$refs.mescroll.beforeRouteLeave()
    next()
  },
  methods: {
    // mescroll组件初始化的回调,可获取到mescroll对象
    mescrollInit (mescroll) {
      this.mescroll = mescroll  // 如果this.mescroll对象没有使用到,则mescrollInit可以不用配置
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page, mescroll) {
      this.queryList(page).then(arr => {
        // 如果是第一页需手动制空列表
        if (page.num === 1) this.dataList = []
        // 把请求到的数据添加到列表
        this.dataList = this.dataList.concat(arr)
        // 数据渲染成功后,隐藏下拉刷新的状态
        this.$nextTick(() => {
          mescroll.endSuccess(arr.length)
        })
      }).catch(err => {
        console.log(err)
        // 联网异常,隐藏上拉和下拉的加载进度
        mescroll.endErr()
      })
    },
    // 切换菜单
    changeTab (type) {
      if (this.pdType !== type) {
        this.pdType = type
        this.dataList = []// 在这里手动置空列表,可显示加载中的请求进度
        this.mescroll.resetUpScroll() // 刷新列表数据
      }
    },

    /** 联网加载列表数据
     *  在您的实际项目中,请参考官方写法: http://www.mescroll.com/api.html#tagUpCallback
     *  请忽略queryList的逻辑,这里仅仅是在本地模拟分页数据,本地演示用
     *  实际项目以您服务器接口返回的数据为准,无需本地处理分页.
     **/
    queryList (page) {
      // eslint-disable-next-line
      return new Promise((resole, reject) => {
        // const params = { num: page.num, size: page.size }
        // this.$axios.post('/xxx', params).then(res => {
        let listData = []
        const pdType = this.pdType
        // 延时一秒,模拟联网
        setTimeout(() => {
          if (pdType === 0) { // 全部商品 (模拟分页数据)
            for (var i = (page.num - 1) * page.size; i < page.num * page.size; i++) {
              if (i === mockData.length) break
              listData.push(mockData[i])
            }
          } else if (pdType === 1) { // 奶粉
            for (var j = 0; j < mockData.length; j++) {
              if (mockData[j].pdName.indexOf('奶') !== -1) {
                listData.push(mockData[j])
              }
            }
          } else if (pdType === 2) { // 图书
            for (var k = 0; k < mockData.length; k++) {
              if (mockData[k].pdName.indexOf('图书') !== -1) {
                listData.push(mockData[k])
              }
            }
          }

          resole(listData)
        }, 1000)
        // }).catch(err => {
        //   reject(err)
        // })
      })
    }
  }
}
</script>
<style lang="less">
.page-demo-scroll {
  display: flex;
  flex-direction: column;
  .mescroll {
    flex: 1;
  }
  .data-list li {
    position: relative;
    padding: 10px 8px 10px 120px;
    border-bottom: 1px solid #eee;
  }
  .data-list .pd-img {
    position: absolute;
    left: 18px;
    top: 18px;
    width: 80px;
    height: 80px;
  }

  .data-list .pd-name {
    font-size: 16px;
    line-height: 20px;
    height: 40px;
    overflow: hidden;
  }

  .data-list .pd-price {
    margin-top: 8px;
    color: red;
  }

  .data-list .pd-sold {
    font-size: 12px;
    margin-top: 8px;
    color: gray;
  }
}
</style>