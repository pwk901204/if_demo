<template>
  <div class="page-form">
    <a-card title="1.基本使用">
      <basic-date></basic-date>
    </a-card>

    <a-card title="2.定制日期单元格">
      <date-format></date-format>
    </a-card>

    <a-card title="3.不可选择日期和时间">
      <not-selected-date></not-selected-date>
      <br />
      <br />
      <a-alert message="可用 disabledDate 和 disabledTime 分别禁止选择部分日期和时间，其中 disabledTime 需要和 showTime 一起使用。" type="success" />
    </a-card>

    <a-card title="4.禁用">
      <disabled-date></disabled-date>
    </a-card>

    <a-card title="5.额外的页脚">
      <extend-info></extend-info>
    </a-card>

    <a-card title="6.日期格式">
      <format-date></format-date>
      <br />
      <br />
      <a-alert message="使用 format 属性，可以自定义日期显示格式。" type="success" />
    </a-card>

    <a-card title="7.受控面板">
      <control-panel></control-panel>
      <br />
      <br />
      <a-alert message="通过组合 mode 与 onPanelChange 控制要展示的面板。" type="success" />
    </a-card>

    <a-card title="8.预设范围">
      <set-range></set-range>
      <br />
      <br />
      <a-alert message="可以预设常用的日期范围以提高用户体验。" type="success" />
    </a-card>

    <a-card title="9.三种大小">
      <different-size></different-size>
      <br />
      <br />
      <a-alert message="三种大小的输入框，若不设置，则为 default。" type="success" />
    </a-card>

    <a-card title="10.自定义日期范围选择">
      <custom-range></custom-range>
      <br />
      <br />
      <a-alert message="当 RangePicker 无法满足业务需求时，可以使用两个 DatePicker 实现类似的功能。" type="success" />
      <a-alert message="(1)、通过设置 disabledDate 方法，来约束开始和结束日期" type="success" />
      <a-alert message="(2)、通过 open onOpenChange 来优化交互" type="success" />
    </a-card>

    <a-card title="11.日期时间选择">
      <time-select></time-select>
      <br />
      <br />
      <a-alert message="增加选择时间功能，当 showTime 为一个对象时，其属性会传递给内建的 TimePicker" type="success" />
    </a-card>

    <a-card title="12.自定义渲染">
      <custom-style></custom-style>
      <br />
      <br />
      <a-alert message="增加自定义渲染功能，在默认 slot 中，你可以设置任何你想渲染的组件" type="success" />
    </a-card>

    <a-card title="13.后缀图标">
      <has-icon></has-icon>
    </a-card>

    <a-card title="14.事件日历">
      <event-calendar></event-calendar>
      <br />
      <div class="map-info">
        <h2>组件位置：</h2>
        <p>/src/components/EventCalendar</p>
        <h2>引用组件</h2>
        <P>1、import EventCalendar from '@/components/EventCalendar/EventCalendar'</P>
        <P>2、&lt;event-calendar :events="dateEvents" :options="calendarOptions" @day-changed="chosedDayCall" @month-changed="changeMonthCall"&gt;&lt;/event-calendar&gt;</P>
      </div>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import BasicDate from './Components/BasicDate' // 基本使用
import DateFormat from './Components/DateFormat' // 定制日期单元格
import NotSelectedDate from './Components/NotSelectedDate' // 定制日期单元格
import DisabledDate from './Components/DisabledDate' // 禁用
import ExtendInfo from './Components/ExtendInfo' // 额外的页脚
import FormatDate from './Components/FormatDate' // 日期格式
import ControlPanel from './Components/ControlPanel' // 受控面板
import SetRange from './Components/SetRange' // 预设范围
import DifferentSize from './Components/DifferentSize' // 三种大小
import CustomRange from './Components/CustomRange' // 自定义日期范围选择
import TimeSelect from './Components/TimeSelect' // 日期时间选择
import CustomStyle from './Components/CustomStyle' // 自定义渲染
import HasIcon from './Components/HasIcon' // 后缀图标
import EventCalendar from './Components/EventCalendar' // 事件日历
export default {
  name: 'AutoComplate', // 自动完成
  mixins: [GlobalMixin],
  components: {
    BasicDate,
    DateFormat,
    NotSelectedDate,
    DisabledDate,
    ExtendInfo,
    FormatDate,
    ControlPanel,
    SetRange,
    DifferentSize,
    CustomRange,
    TimeSelect,
    CustomStyle,
    HasIcon,
    EventCalendar
  },
  data () {
    return {
      userName: 'username'
    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
