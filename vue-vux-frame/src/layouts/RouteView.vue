<template>
  <transition name="page-toggle">
    <router-view />
  </transition>
</template>

<script>
export default {
  name: 'RouteView'
}
</script>
