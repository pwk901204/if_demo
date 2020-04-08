<template>
  <a-dropdown style="display: inline-block; height: 100%; vertical-align: initial">
    <span style="cursor: pointer">
      <a-avatar
        class="avatar"
        size="small"
        shape="circle"
        src="https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png"
      />
      <span>{{currUser.account}}</span>
    </span>
    <a-menu style="width: 130px" slot="overlay">
      <a-menu-item>
        <router-link to="/account/base">
          <a-icon type="user" style="margin-right: 5px"/>
          <span>个人中心</span>
        </router-link>
      </a-menu-item>
      <a-menu-divider/>
      <a-menu-item>
        <router-link to="/login">
          <a-icon type="poweroff" style="margin-right: 5px"/>
          <span>退出登录</span>
        </router-link>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
export default {
  name: 'HeaderAvatar',
  computed: {
    currUser () {
      return this.$store.state.account.user
    }
  }
}
</script>
