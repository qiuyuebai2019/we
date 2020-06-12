<template>
    <div class="box">
      <h1  style="font-size: 35px">开发中</h1>
      <div class="err-info">
        <div style="font-size: 20px"> 功能开发中，敬请期待。</div>
        <div class="err-button">
<!--          <el-button type="primary" @click="$router.push('/index')">-->
<!--            回到首页-->
<!--          </el-button>-->
        </div>
      </div>

    </div>
</template>

<script>
    export default {
      name: "NotFound",
      mounted() {
          console.log(this.$route)
      }
    }
</script>

<style scoped>
  .box{
    padding: 40px;
    margin: auto;
    height: 200px;
    position: absolute;
    top: 20%;
    left: 0;
    z-index: 200;
    right: 0;
    width:500px;
    color:#666;
    border-radius: 3px;
    background: #FFF;
    margin-bottom: 100px;
    box-shadow: 0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23);
    overflow: hidden;
  }
  .box h1{
    font-size: 50px;

  }
  .box .err-info,.box .err-button{
    margin-top: 20px;

  }
  .box .err-button{
    margin-top: 30px;
  }
</style>
