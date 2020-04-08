<template>
  <div class="IM-contacts">
    <div class="IM-title">最新消息</div>
    <div class="IM-search flex-row-align-center">
      <img src="./assets/search.png" />
      <input type="text" placeholder="搜索"/>
    </div>
    <div class="IM-contacts-list">
      <a-menu mode="inline">
        <a-menu-item key="1">
          <span>李琦</span>
        </a-menu-item>
        <a-menu-item key="2">
          <span>王三</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <span slot="title"><span>档案室</span></span>
          <a-menu-item key="s1">赵正阳</a-menu-item>
          <a-menu-item key="s2">何意</a-menu-item>
          <a-menu-item key="s3">叶玲</a-menu-item>
          <a-menu-item key="s4">档案管理员</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </div>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="less">
.IM-contacts{
  width: 160px;
  height: 100%;
  background: #f2f2f2;
  .IM-title{
    padding: 20px 10px 10px 10px;
    color:#333333;
  }
  .IM-search{
    border:1px solid #d9d9d9;
    border-radius: 4px;
    background: #fff;
    padding: 0 7px;
    margin:0 10px 10px;
    img{
      height: 12px;
      width: 12px;
      margin-right: 7px;
    }
    input{
      width:100%;
      outline: none;
      border:none;
    }
  }
  .IM-contacts-list {
    border-top:1px solid #e8e8e8;
    padding-top:10px;
    overflow-y: auto;
    height: calc( 100% - 86px );
    // &::-webkit-scrollbar{
    //   display: none;
    // }
    // &:hover::-webkit-scrollbar {
    //   display: block;
    // }

    .ant-menu{
      background: transparent;
    }
    .ant-menu-vertical-right .ant-menu-item::after, .ant-menu-inline .ant-menu-item::after{
      display: none;
    }
  }
}
</style>
