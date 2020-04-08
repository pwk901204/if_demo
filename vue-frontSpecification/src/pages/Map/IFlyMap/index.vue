<template>
  <div class="page-wrap">
    <div id="map" class="map-page"></div>
    <div id="mouse-position"></div>
    <div class="map-info">
      <h2>使用说明：</h2>
      <p>这里的IFlyMap是公司的前端地图框架，当项目需要使用室内引导、离线地图等特殊需求的时候可以考虑优先使用！</p>
      <p>使用须知及步骤如下：</p>
      <p class="red">需要走公司的可复用平台 <a href="http://platform.iflytek.com/artemis/asset?assetId=152" target="_blank">http://platform.iflytek.com/artemis/asset?assetId=152</a> 申请复用，之后会有公司专属技术人员指导使用</p>
      <p>1、这里采用的是在index.html中直接引入需要的css文件和js文件的，源码文件放置在public\plugins\iflymap文件夹之下！</p>
      <P>2、初始化Layer</P>
      <P>3、初始化map，并且使用Layer</P>
      <P>4、其他更加具体更加详细用法完全参考官网实例：<a href="http://172.31.13.33/#/example" target="_blank">http://172.31.13.33/#/example</a></P>
    </div>
  </div>
</template>
<script>

export default {
  name: 'IFlyMap', // IFlyMap
  data () {
    return {
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      this.setMapView()
    },
    setMapView () {
      var gaodeLayer = new flymap.layer.GaodeLayer({
        layerType: 'vec',
        layerName: 'gaodemap-vec',
        isBaseLayer: true,
        visible: true
      })

      var map = new flymap.Map({
        target: 'map',
        layers: [gaodeLayer],
        logo: { src: '', href: '' },
        view: new flymap.View({
          projection: flymap.proj.get('EPSG:3857'),
          zoom: 12,
          center: [13070701, 3747637],
          maxZoom: 16,
          minZoom: 4
        })
      })
      var mousePositionControl = new flymap.control.MousePosition({
        formatString: '当前为：经度：{x}，纬度：{y}',
        accuracy: 4,
        styles: {
          right: 15,
          color: '#fff',
          width: 300,
          height: 30,
          fontSize: 14,
          backgroundColor: 'rgba(0,0,0,.5)',
          padding: '5px 10px',
          borderRadius: 10
        },
        projection: 'EPSG:4326',
        target: document.getElementById('mousePposition')
      })
      var scale = new flymap.control.ScaleBar({
        units: 'metric_cn',
        styles: {
          height: 20,
          bottom: 20,
          left: 20,
          top: 'auto'
        }
      })
      map.addControl(scale)
      var stopMouse = true
      map.on('pointermove', function (evt) {
        if (stopMouse) {
          map.addControl(mousePositionControl)
          stopMouse = false
        }
      })
    }
  }
}

</script>
<style lang="less">
@import "./index.less";

</style>
