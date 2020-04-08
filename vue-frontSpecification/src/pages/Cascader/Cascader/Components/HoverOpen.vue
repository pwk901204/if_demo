<template>
  <a-cascader
    :options="options"
    :displayRender="displayRender"
    expandTrigger="hover"
    @change="onChange"
    placeholder="Please select"
  />
</template>
<script>
export default {
  data () {
    return {
      options: [
        {
          value: 'zhejiang',
          label: 'Zhejiang',
          children: [
            {
              value: 'hangzhou',
              label: 'Hangzhou',
              children: [
                {
                  value: 'xihu',
                  label: 'West Lake'
                }
              ]
            }
          ]
        },
        {
          value: 'jiangsu',
          label: 'Jiangsu',
          children: [
            {
              value: 'nanjing',
              label: 'Nanjing',
              children: [
                {
                  value: 'zhonghuamen',
                  label: 'Zhong Hua Men'
                }
              ]
            }
          ]
        }
      ]
    }
  },
  methods: {
    onChange (value) {
      console.log(value)
    },
    displayRender ({ labels }) {
      return labels[labels.length - 1]
    }
  }
}
</script>
