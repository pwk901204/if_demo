<template>
  <a-popover
    v-model="visible"
    trigger="click"
    placement="bottomRight"
    overlayClassName="header-notice-wrapper"
    :getPopupContainer="() => $refs.noticeRef.parentElement"
    :autoAdjustOverflow="true"
    :arrowPointAtCenter="true"
    :overlayStyle="{ width: '300px', top: '50px' }"
  >
    <template slot="content">
      <a-spin :spinning="loading">
        <a-tabs class="top-info">
          <a-tab-pane tab="通知" key="1">
            <a-list>
              <a-list-item v-for="(list,index) in infoList.notice" :key="index">
                <a-list-item-meta
                  :title="list.title"
                  :description="list.time"
                  @click="JumpToDetail('1',list)"
                ></a-list-item-meta>
              </a-list-item>
              <a-list-item class="workbtn">
                <a href="javascript:void(0)" type="link" class="btn" @click="clearinfo">清空通知</a>
                <a
                  href="javascript:void(0)"
                  type="link"
                  class="btn btn-r"
                  @click="watchMore('1')"
                >查看更多</a>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="消息" key="2">
            <a-list>
              <a-list-item v-for="(list,index) in infoList.info" :key="index">
                <a-list-item-meta
                  :title="list.title"
                  :description="list.time"
                  @click="JumpToDetail('2',list)"
                ></a-list-item-meta>
              </a-list-item>
              <a-list-item class="workbtn">
                <a
                  href="javascript:void(0)"
                  class="btnalone"
                  type="link"
                  @click="watchMore('2')"
                >查看更多</a>
              </a-list-item>
            </a-list>
          </a-tab-pane>
          <a-tab-pane tab="待办" key="3">
            <a-list>
              <a-list-item v-for="(list,index) in infoList.welldo" :key="index">
                <a-list-item-meta
                  :title="list.title"
                  :description="list.time"
                  @click="JumpToDetail('3',list)"
                ></a-list-item-meta>
              </a-list-item>
              <a-list-item class="workbtn">
                <a
                  href="javascript:void(0)"
                  class="btnalone"
                  type="link"
                  @click="watchMore('3')"
                >查看更多</a>
              </a-list-item>
            </a-list>
          </a-tab-pane>
        </a-tabs>
      </a-spin>
    </template>
    <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
      <a-badge :count="infoNum">
        <a-icon style="font-size: 16px; padding: 4px" type="bell" />
      </a-badge>
    </span>
  </a-popover>
</template>

<script>
import toDetail from '@/mixins/toDetail' // 引入mixin文件
export default {
  name: 'HeaderNotice',
  mixins: [toDetail],
  data () {
    return {
      infoNum: '15', // 头部提示数
      infoList: {},
      loading: false,
      visible: false
    }
  },
  mounted () {
    this.fetchList()
  },
  methods: {
    // 获取消息列表
    fetchList () {
      this.infoList = {
        notice: [{
          title: '你收到了 14 份新周报',
          time: '2020.10.12  18:15:32',
          type: '1'
        }, {
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          time: '2019.10.11  17:15:32',
          type: '2'
        }, {
          title: '种模板可以区分多种通知类型',
          time: '2019.10.10  16:15:32',
          type: '3'
        }],
        info: [{
          title: '你收到了 14 份新周报',
          time: '2020.10.12  18:15:32',
          type: '1'
        }, {
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          time: '2019.10.11  17:15:32',
          type: '2'
        }, {
          title: '种模板可以区分多种通知类型',
          time: '2018.10.10  16:15:32',
          type: '3'
        }],
        welldo: [{
          title: '你收到了 14 份新周报',
          time: '2018.10.11  18:15:32',
          type: '1'
        }, {
          title: '你推荐的 曲妮妮 已通过第三轮面试',
          time: '2017.10.11  17:15:32',
          type: '2'
        }, {
          title: '种模板可以区分多种通知类型',
          time: '2016.10.11  16:15:32',
          type: '3'
        }]
      }
    },
    fetchNotice () {
      if (!this.visible) {
        this.loading = true
        setTimeout(() => {
          this.loading = false
        }, 2000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    },
    // 查看更多
    watchMore (type) {
      this.$router.push({
        name: 'Message',
        path: '/common/message',
        query: {
          type: type
        }
      })
    },
    // 清空通知
    clearinfo () {
      console.log('清空')
      this.infoList.notice = []
    }
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
.header-notice-wrapper .ant-popover-inner-content {
  padding-bottom: 0;
}
</style>
<style lang="less">
.top-info {
  .ant-tabs-bar {
    margin-bottom: 5px;
  }
}

.header-notice {
  display: inline-block;
  transition: all 0.3s;
  span {
    vertical-align: initial;
  }
}
.ant-list-split {
  .ant-list-item {
    .ant-list-item-meta {
      cursor: pointer;
    }
  }

  .workbtn {
    text-align: center;
    padding: 12px 0;
    .btn {
      display: inline-block;
      width: 50%;
      text-align: center;
    }
    .btnalone {
      display: inline-block;
      width: 100%;
      text-align: center;
    }
    .btn-r {
      border-left: 1px solid #e8e8e8;
    }
  }
}
</style>
