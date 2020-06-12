<template>
  <div class="frame-content">
    <keep-alive :max="15" :include="cachedViews">
      <router-view :key="$route.fullPath"></router-view>
    </keep-alive>
    <template v-if="isShowThisRouter">

    </template>
    <template v-else>

    </template>

  </div>
</template>

<script>
    export default {
        name: "AppMain",
      data(){
        return{

        }
      },
        mounted() {

        },
      computed:{
        cachedViews(){
          return this.$store.state.cachedViews
        },
        menuOriginalList(){
          return this.$store.state.menuOriginalList
        },
        isShowThisRouter(){
          return this.$store.state.isShowThisRouter
        }
      },
      methods:{
        /**
         * 防止用户恶意访问没有权限的菜单
         */
        checkIsIn(){
          let isIn=false;
          let path=this.$route.path
          for (let i=0;i<this.menuOriginalList.length;i++) {
            if (this.menuOriginalList[i].iscCode===path) {
              isIn=true
            }
          }
          if (
            path=='/index'
            ||path=='/common/login/login'
            ||path=='/common/isc/menu/IscResourceExt'
          ){
            isIn=true
          }
          //开发环境不做对强制通过url访问做限制
          if (process.env.NODE_ENV==='development') {
            isIn=true
          }
          this.$store.commit("setIsShowThisRouter",isIn)
        }
      },
      watch:{
        $route(){
          this.checkIsIn()
        },
        menuOriginalList(){
          this.checkIsIn()
        }
      }
    }
</script>

<style scoped>

</style>
