<template>
  <div class="page-form">
    <a-card title="1.最简单的下拉菜单">
      <a-dropdown>
        <a class="ant-dropdown-link"
           href="#">
          Hover me
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item>
            <a href="javascript:;">1st menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">2nd menu item</a>
          </a-menu-item>
          <a-menu-item>
            <a href="javascript:;">3rd menu item</a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="2.默认是移入触发菜单，可以点击鼠标右键触发;带下拉框的按钮,左边是按钮，右边是额外的相关功能菜单">
      <div>
        <a-dropdown-button @click="handleButtonClick">
          Dropdown
          <a-menu slot="overlay"
                  @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="user" />1st menu item
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="user" />2nd menu item
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="user" />3rd item
            </a-menu-item>
          </a-menu>
        </a-dropdown-button>
        <a-dropdown-button @click="handleButtonClick"
                           disabled
                           style="margin-left: 8px">
          Dropdown
          <a-menu slot="overlay"
                  @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="user" />1st menu item
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="user" />2nd menu item
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="user" />3rd item
            </a-menu-item>
          </a-menu>
        </a-dropdown-button>
        <a-dropdown>
          <a-menu slot="overlay"
                  @click="handleMenuClick">
            <a-menu-item key="1">
              <a-icon type="user" />1st menu item
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="user" />2nd menu item
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="user" />3rd item
            </a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px">
            Button
            <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </div>
    </a-card>
    <a-card title="3.触发事件，点击菜单项后会触发事件，用户可以通过相应的菜单项 key 进行不同的操作">
      <a-dropdown>
        <a class="ant-dropdown-link"
           href="#">
          Hover me, Click menu item
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay"
                @click="onClick">
          <a-menu-item key="1">1st menu item</a-menu-item>
          <a-menu-item key="2">2nd menu item</a-menu-item>
          <a-menu-item key="3">3rd menu item</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="4.其他元素,分割线和不可用菜单项">
      <a-dropdown>
        <a class="ant-dropdown-link"
           href="#">
          Hover me
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <a target="_blank"
               rel="noopener noreferrer"
               href="http://www.alipay.com/">1st menu item</a>
          </a-menu-item>
          <a-menu-item key="1">
            <a target="_blank"
               rel="noopener noreferrer"
               href="http://www.taobao.com/">2nd menu item</a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3"
                       disabled>3rd menu item（disabled）</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="5.菜单隐藏方式,默认是点击关闭菜单，可以关闭此功能">
      <a-dropdown v-model="visible">
        <a class="ant-dropdown-link"
           href="#">
          Hover me
          <a-icon type="down" />
        </a>
        <a-menu slot="overlay"
                @click="handleMenuClickhide">
          <a-menu-item key="1">Clicking me will not close the menu.</a-menu-item>
          <a-menu-item key="2">Clicking me will not close the menu also.</a-menu-item>
          <a-menu-item key="3">Clicking me will close the menu</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="6.弹出位置,支持 6 个弹出位置">
      <div id="components-dropdown-demo-placement">
        <template v-for="(placement, index) in placements">
          <a-dropdown :placement="placement"
                      :key="index">
            <a-button>{{placement}}</a-button>
            <a-menu slot="overlay">
              <a-menu-item>
                <a target="_blank"
                   rel="noopener noreferrer"
                   href="http://www.alipay.com/">1st menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a target="_blank"
                   rel="noopener noreferrer"
                   href="http://www.taobao.com/">2nd menu item</a>
              </a-menu-item>
              <a-menu-item>
                <a target="_blank"
                   rel="noopener noreferrer"
                   href="http://www.tmall.com/">3rd menu item</a>
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!-- <br v-if="index === 2" /> -->
        </template>
      </div>
    </a-card>
    <a-card title="7.多级菜单,传入的菜单里有多个层级">
      <a-dropdown>
        <a class="ant-dropdown-link"
           href="#"> Cascading menu
          <a-icon type="down" /> </a>
        <a-menu slot="overlay">
          <a-menu-item>1st menu item</a-menu-item>
          <a-menu-item>2nd menu item</a-menu-item>
          <a-sub-menu title="sub menu"
                      key="test">
            <a-menu-item>3rd menu item</a-menu-item>
            <a-menu-item>4th menu item</a-menu-item>
          </a-sub-menu>
          <a-sub-menu title="disabled sub menu"
                      disabled>
            <a-menu-item>5d menu item</a-menu-item>
            <a-menu-item>6th menu item</a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="8.触发方式,默认是移入触发菜单，可以点击触发">
      <a-dropdown :trigger="['click']">
        <a class="ant-dropdown-link"
           href="#"> Click me
          <a-icon type="down" /> </a>
        <a-menu slot="overlay">
          <a-menu-item key="0">
            <a href="http://www.alipay.com/">1st menu item</a>
          </a-menu-item>
          <a-menu-item key="1">
            <a href="http://www.taobao.com/">2nd menu item</a>
          </a-menu-item>
          <a-menu-divider />
          <a-menu-item key="3">3rd menu item</a-menu-item>
        </a-menu>
      </a-dropdown>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="事件">
      <a-table :columns="columnsEvent"
               :dataSource="dataEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="Dropdown.Button">
      <a-table :columns="columnsButton"
               :dataSource="dataButton"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="Dropdown.Button 事件">
      <a-table :columns="columnsButtonEvent"
               :dataSource="dataButtonEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoDropdown', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      loading: false,
      iconLoading: false,
      size: 'large',
      visible: false,
      placements: [
        'bottomLeft',
        'bottomCenter',
        'bottomRight',
        'topLeft',
        'topCenter',
        'topRight'
      ],
      columns: [{
        title: '参数',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '类型',
        dataIndex: 'type'
      },
      {
        title: '默认值',
        dataIndex: 'default'
      }],
      columnsEvent: [{
        title: '事件名称',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '回调参数',
        dataIndex: 'callback'
      }],
      columnsButton: [{
        title: '参数',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '类型',
        dataIndex: 'type',
        className: 'type-style'
      },
      {
        title: '默认值',
        dataIndex: 'default'
      }],
      columnsButtonEvent: [{
        title: '事件名称',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '回调参数',
        dataIndex: 'callback'
      }],
      data: [{
        parameter: 'disabled',
        intro: '菜单是否禁用',
        type: 'boolean',
        default: '-'
      }, {
        parameter: 'getPopupContainer',
        intro: '菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。',
        type: 'Function(triggerNode)',
        default: '() => document.body'
      }, {
        parameter: 'overlay(slot-scope)',
        intro: '菜单',
        type: 'Menu',
        default: '-'
      }, {
        parameter: 'overlayClassName',
        intro: '下拉根元素的类名称',
        type: 'string',
        default: '-'
      }, {
        parameter: 'overlayStyle',
        intro: '下拉根元素的样式',
        type: 'object',
        default: '-'
      }, {
        parameter: 'placement',
        intro: '菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight',
        type: 'String',
        default: 'bottomLeft'
      }, {
        parameter: 'trigger',
        intro: '触发下拉的行为, 移动端不支持 hover',
        type: 'Array<click|hover|contextmenu>',
        default: '[hover]'
      }, {
        parameter: 'visible(v-model)',
        intro: '菜单是否显示',
        type: 'boolean',
        default: '-'
      }],
      dataEvent: [{
        parameter: 'visibleChange',
        intro: '菜单显示状态改变时调用，参数为 visible',
        callback: 'function(visible)'
      }],
      dataButton: [{
        parameter: 'disabled',
        intro: '菜单是否禁用',
        type: 'boolean',
        default: '-'
      }, {
        parameter: 'overlay(slot-scope)',
        intro: '菜单',
        type: 'Menu',
        default: '-'
      }, {
        parameter: 'placement',
        intro: '菜单弹出位置：bottomLeft bottomCenter bottomRight topLeft topCenter topRight',
        type: 'String',
        default: 'bottomLeft'
      }, {
        parameter: 'size',
        intro: '按钮大小，和 Button 一致',
        type: 'string',
        default: 'default'
      }, {
        parameter: 'trigger',
        intro: '触发下拉的行为',
        type: 'Array<click|hover|contextmenu>',
        default: '[hover]'
      }, {
        parameter: 'type',
        intro: '按钮类型，和 Button 一致',
        type: 'string',
        default: 'default'
      }, {
        parameter: 'visible(v-model)',
        intro: '菜单是否显示',
        type: 'boolean',
        default: '-'
      }],
      dataButtonEvent: [{
        parameter: 'click',
        intro: '点击左侧按钮的回调，和 Button 一致',
        callback: 'Function'
      }, {
        parameter: 'visibleChange',
        intro: '菜单显示状态改变时调用，参数为 visible',
        callback: 'function(visible)'
      }]
    }
  },
  mounted () { },
  methods: {
    handleButtonClick (e) {
      console.log('click left button', e)
    },
    handleMenuClick (e) {
      console.log('click', e)
    },
    onClick ({ key }) {
      console.log(`Click on item ${key}`)
    },
    handleMenuClickhide (e) {
      if (e.key === '3') {
        this.visible = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
