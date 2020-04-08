<template>
  <div style="height:100%;background:#fff">
    <v-chart class="gx"
             force-fit="true"
             :height="height">
      <v-tooltip show-title="false" />
      <v-view :data="edgesData">
        <v-edge position="x*y"
                shape="arc"
                color="source"
                :opacity="0.5"
                tooltip="source*target" />
      </v-view>
      <v-view :data="nodesData">
        <v-point position="x*y"
                 size="value"
                 color="id"
                 :opacity="0.5"
                 :v-style="style"
                 :label="label"
                 shape="circle" />
      </v-view>
    </v-chart>
  </div>
</template>

<script>
const DataSet = require('@antv/data-set')
const label = ['name', {
  offset: -10,
  textStyle: {
    textAlign: 'left',
    rotate: 90
  }
}]

const style = {
  stroke: 'grey'
}

export default {
  computed: {
    contentStyle () {
      let style = {
        minHeight: window.innerHeight - 150 + 'px'
      }
      return style
    }
  },
  mounted () {
    this.$axios.mock('./mock/guanxi.json').then(sourceData => {
      const dv = new DataSet.View().source(sourceData, {
        type: 'graph',
        edges: d => d.links
      })
      dv.transform({
        type: 'diagram.arc',
        marginRatio: 0.5
      })
      this.$data.edgesData = dv.edges
      this.$data.nodesData = dv.nodes
    })
    this.height = document.body.clientHeight - 400
  },
  data () {
    return {
      edgesData: [],
      nodesData: [],
      style,
      label,
      height: 500
    }
  }
}
</script>
<style scoped>
.gx {
  width: 1000px;
  margin: 0 auto;
}
</style>
