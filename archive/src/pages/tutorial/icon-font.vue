<template>
  <div class="tutorial-icon-font">
    <ul class="anticons-list">
      <li v-for="(item,index) in icons" :key="index">
        <icon-font :type="item" />
        <span class="anticon-class">
          <span class="ant-badge">
            <code>&lt;icon-font type="{{item}}" /&gt;</code>
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'TutorialIconFont',
  data () {
    return {
      icons: []
    }
  },
  mounted () {
    this.fetchIcon()
  },
  methods: {
    fetchIcon () {
      const nodes = document.getElementsByTagName('svg')[0].childNodes
      const icons = []
      nodes.forEach(node => {
        icons.push(node.id)
      })
      this.icons = Object.freeze(icons)
    }
  }
}
</script>
<style lang="less">
.tutorial-icon-font {
  ul.anticons-list {
    overflow: hidden;
    margin: 10px 0;
    list-style: none;
  }
  ul.anticons-list li {
    position: relative;
    float: left;
    overflow: hidden;
    width: 16.66%;
    height: 100px;
    margin: 3px 0;
    padding: 10px 0 0;
    list-style: none;
    cursor: pointer;
    transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
    text-align: center;
    color: #555;
    border-radius: 4px;
    background-color: #fff;
  }
  ul.anticons-list li .anticon {
    margin: 12px 0 8px;
    transition: transform 0.3s ease-in-out;
    font-size: 36px;

    will-change: transform;
  }
  ul.anticons-list li .anticon-class {
    display: block;
    transform: scale(0.83);
    text-align: center;
    white-space: nowrap;
    font-family: Lucida Console, Consolas;
  }
}
</style>
