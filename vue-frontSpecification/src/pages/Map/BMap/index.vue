<template>
  <div class="page-wrap">
    <div id="BMapWrap" class="map-page"></div>
    <div class="map-info">
      <h2>使用说明：</h2>
      <p>这里的百度地图使用是采用动态引入在线地图的API的方式实现，其中使用方法和官方示例的使用方法保持一致，具体步骤如下：</p>
      <P>1、根据当前window对象下有没有BMap对象判断是否引入了百度地图的API，如果已经引入了则可以直接使用即可，如果没有这通过BMap.js去动态创建并引入脚本；</P>
      <P>2、当引入百度地图的API脚本之后则可以跟官网一样的方式使用百度地图所有的功能；</P>
      <P>3、首先通过const map = new BMap.Map('BMapWrap')初始化地图</P>
      <p>4、然后设置地图以及中心点</p>
      <P>5、剩下的具体更加详细用法完全参考官网API：<a href="http://lbsyun.baidu.com/jsdemo.htm#a1_2" target="_blank">http://lbsyun.baidu.com/jsdemo.htm#a1_2</a></P>
    </div>
  </div>
</template>
<script>
import { BMP } from './BMap.js'
export default {
  name: 'BMap', // 百度地图
  data () {
    return {
      ak: '0f27jG1V2z4MKHOLkOgnfeYT' // 百度地图API的秘钥，可换成自己项目组申请的秘钥
    }
  },
  mounted () {
    this.initPage()
  },
  methods: {
    initPage () {
      const _this = this
      // 已经加载了百度地图的js了就不用加载了
      window.BMap ? this.setMapView() : BMP(_this.ak).then(BMap => {
        // 在此调用api
        this.setMapView()
      })
    },

    // 设置地图
    setMapView () {
      // 具体更加详细用法完全参考官网API
      // 地址：http://lbsyun.baidu.com/jsdemo.htm#a1_2
      const map = new BMap.Map('BMapWrap')
      const point = new BMap.Point(118.28052520751953, 31.223487854003906)
      map.centerAndZoom(point, 12) // 设置地图以及中心点
      map.enableScrollWheelZoom(true) // 可缩放
      const marker = new BMap.Marker(point) // 创建标注
      map.addOverlay(marker) // 将标注添加到地图中
      marker.addEventListener('click', getAttr)
      function getAttr () {
        const p = marker.getPosition() // 获取marker的位置
        alert('marker的位置是' + p.lng + ',' + p.lat)
      }
    }
  }
}

</script>
<style lang="less">
@import "./index.less";

</style>
