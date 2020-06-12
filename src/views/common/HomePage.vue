<template>
  <div :style="{'width':'100%','height':'(height)'}">
      <img src="http://img.pconline.com.cn/images/upload/upc/tx/wallpaper/1308/17/c2/24561028_1376699679457.jpg" width="100%" height="100%">
  </div>
</template>

<script>

  export default {
    name: "HomePage",
    data() {
      return {
        height: window.innerHeight-130 + 'px'
      }
    },
    methods: {
    },
    mounted() {
    },
  }
</script>
<style scoped>
  .el-header{
    padding: 0 !important;
  }
</style>


