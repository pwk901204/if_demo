<template>
  <div class="page-wrap">
    <div id="SuperMapWrap" class="map-page"></div>
    <div class="map-info">
      <h2>使用说明：</h2>
      <p>这里的超图使用的leaflet，后续使用超图也建议使用这一种，其中使用方法和官方示例的使用方法保持一致，具体步骤如下：</p>
      <P>1、通过cnpm install leaflet给项目引入leaflet地图</P>
      <P>2、具体页面使用的时候，首先是通过import L from 'leaflet'引入地图</P>
      <P>3、L.map方法初始化地图</P>
      <p>4、L.tileLayer给地图添加地图图层</p>
      <P>说明：示例中我给地图绑定了点击事件，并且点击的时候会给地图打一个标注，并且标注上绑定信息框是点的信息，也可以做其他的处理</P>
      <P>5、剩下的具体更加详细用法完全参考官网API：<a href="http://iclient.supermap.io/examples/leaflet/examples.html#iServer" target="_blank">http://iclient.supermap.io/examples/leaflet/examples.html#iServer</a></P>
    </div>
  </div>
</template>
<script>
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
export default {
  name: 'SuperMap', // 超图leaflet
  data () {
    return {
      map: ''
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    // 初始化页面
    initPage () {
      this.setMapView()
    },
    // 设置地图
    setMapView () {
      this.map = L.map('SuperMapWrap', {
        minZoom: 3,
        maxZoom: 18,
        center: [31.223487854003906, 118.28052520751953],
        zoom: 12,
        crs: L.CRS.EPSG3857
      })
      L.tileLayer(
        'http://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}'
      ).addTo(this.map)

      // 绑定点击事件
      this.map.on('click', (evt) => {
        L.marker(evt.latlng, {
          icon: L.icon({
            iconUrl: markerIcon,
            iconSize: [25, 41],
            iconAnchor: [13, 21]
          }),
          // draggable:true,
          riseOnHover: true
        }).bindPopup('坐标点信息:[' + evt.latlng.lng + ',' + evt.latlng.lat + ']').addTo(this.map)
      })
    }
  }
}

</script>
<style lang="less">
@import "./index.less";

</style>
