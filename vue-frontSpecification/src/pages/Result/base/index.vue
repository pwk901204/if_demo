<template>
  <div style="padding:24px">
    <a-card :bordered="false" style="margin: -24px -24px 0px;">
      <result type="success" :description="description" :title="title">
        <template slot="action">
          <a-button type="primary">返回列表</a-button>
          <a-button style="margin-left: 8px">查看项目</a-button>
          <a-button style="margin-left: 8px">打印</a-button>
        </template>
        <div>
          <a-steps :current="1" :direction="directionType.horizontal">
            <a-step>
              <span style="font-size: 14px" slot="title">创建项目</span>
              <template slot="description">
                <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45); text-align: left;" slot="description">
                  <div style="margin: 8px 0 4px">
                    曲丽丽
                  </div>
                  <div>2016-12-12 12:32</div>
                </div>
              </template>
            </a-step>
            <a-step title="部门初审">
              <span style="font-size: 14px" slot="title">部门初审</span>
              <template slot="description">
                <div style="fontSize: 12px; color: rgba(0, 0, 0, 0.45);text-align: left;" slot="description">
                  <div style="margin: 8px 0 4px">
                    周毛毛
                  </div>
                </div>
              </template>
            </a-step>
            <a-step title="财务复核">
              <span style="font-size: 14px" slot="title">财务复核</span>
            </a-step>
            <a-step title="完成">
              <span style="font-size: 14px" slot="title">完成</span>
            </a-step>
          </a-steps>
        </div>
      </result>
    </a-card>
  </div>
</template>

<script>
import Result from '@/components/Result/Result.vue';

const directionType = {
  horizontal: 'horizontal',
  vertical: 'vertical'
};

export default {
  name: 'Success',
  components: {
    Result
  },
  data() {
    return {
      title: '提交成功',
      description:
        '提交结果页用于反馈一系列操作任务的处理结果，\n' +
        ' 如果仅是简单操作，使用 Message 全局提示反馈即可。\n' +
        ' 本文字区域可以展示简单的补充说明，如果有类似展示\n' +
        ' “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。',
      directionType
    };
  }
};
</script>

<style scoped>
</style>
