<template>
  <transition name="page-toggle">
    <router-view  class="page-toggle"/>
  </transition>
</template>

<script>
export default {
  name: 'RouteView'
}
</script>
