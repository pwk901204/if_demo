<template>
  <global-layout>
    <transition>
      <router-view />
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
