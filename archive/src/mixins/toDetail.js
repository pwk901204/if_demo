export default {
  data () {
    return {
      name: 'mixin'
    }
  },
  created () {
    console.log('mixin...', this.name)
  },
  mounted () { },
  methods: {
    JumpToDetail (type, info) {
      debugger
      if (type === '1') {
        // this.$router.push({ name: 'dashboard' })
      } else if (type === '2') {
        // this.$router.push({ name: 'dashboard' })
      } else {
        // this.$router.push({ name: 'dashboard' })
      }
    }
  }
}
