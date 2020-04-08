<template>
  <global-layout>
    <transition>
      <router-view class="page-container"/>
    </transition>
  </global-layout>
</template>
<script>

import GlobalLayout from './GlobalLayout'
export default {
  name: 'MenuView',
  components: {
    GlobalLayout
  }
}
</script>
