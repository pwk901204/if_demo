<template>
<div class="IM">
  <div class="IM-container flex-row">
    <div class="IM-sidebar">
      <options></options>
    </div>
    <div class="IM-user">
      <contacts></contacts>
    </div>
    <div class="IM-main">
      <menua></menua>
      <message></message>
      <edit></edit>
    </div>
  </div>
</div>
</template>
<script>
import options from './options'
import edit from './edit'
import message from './message'
import contacts from './contacts'
import menua from './menu'
export default {
  components: {
    options,
    edit,
    message,
    contacts,
    menua
  }
}
</script>
<style lang="less">
.IM{
  width: 720px;
  height: 580px;
  .IM-container{
    width: 100%;
    height: 100%;
    .IM-sidebar{
      height: 100%;
    }
    .IM-user{
      height: 100%;
    }
    .IM-main{
      height: 100%;
      width: 100%;
    }
  }
}
</style>
