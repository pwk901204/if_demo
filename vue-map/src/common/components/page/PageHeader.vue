<template>
  <div class="page-breadcrumb">
    <a-breadcrumb separator=">" :routes="breadcrumb">
      <template slot="itemRender" slot-scope="{route, params, routes}">
        <span v-if="!route.path || routes.indexOf(route) === routes.length - 1">{{route.name}}</span>
        <router-link v-else :to="route.path">{{route.name}}</router-link>
      </template>
    </a-breadcrumb>
  </div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    breadcrumb: {
      type: Array,
      required: false
    }
  }
}
</script>
