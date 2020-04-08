<template>
  <!-- <div class="page-header"> -->
  <div class="page-breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item :key="item.path"
                         v-for="(item, index) in breadcrumb">
        <span v-if="index === 0">
          <a href="https://www.antdv.com/docs/vue/introduce-cn/"
             target="_blank">{{item.name}}</a>
        </span>
        <span v-else>{{item.name}}</span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <!-- </div> -->
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
