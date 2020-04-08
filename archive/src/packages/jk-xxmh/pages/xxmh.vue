<template>
  <div>
    kkk
    <archives-detail :id="record.objectId" :categoryId="record.categoryId" :title="title">Preview</archives-detail>
  </div>
</template>
<script>
import ArchivesDetail from '@/components/Preview/main' // ????
export default {
  name: 'xxml',
  components: { ArchivesDetail },
  data () {
    return {
      title: 'Preview',
      record: {
        objectId: '1',
        categoryId: '11'
      }
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
