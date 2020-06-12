<template>
<div class="login-cont">
        <div class="login-top">
            <div class="container clearfix">
                <div class="login-img">
                   <!-- <img src="../../assets/login/logo.png" alt=""> 外网图标-->
                </div>
                <ul class="login-tab">
                    <!-- <li class="login-tab-item active"><a href="">首页</a></li>
                    <li class="login-tab-item"><a href="">新闻中心</a></li> -->
                    <li class="login-tab-item"><a  @click="dld">App下载</a></li>
                    <li class="login-tab-item"><a href="javascript:void(0)">关于我们</a></li>
                </ul>
            </div>
        </div>
        <div class="login-main">
            <div class="form-content">
                <h1 class="form-title">{{constant.common.title}}</h1>
                <form action="">
                    <div class="form-group">
                        <input type="text" placeholder="用户名" v-model="loginInfo.username">
                        <i class="input-icon el-icon-user"></i>
                    </div>
                    <div class="form-group">
                        <input type="password" placeholder="密码" v-model="loginInfo.password" >
                        <i class="input-icon el-icon-key"></i>
                    </div>
                    <button type="button" class="el-button el-button--success is-round form-btn"
                    @click="doLogin"
                    >登录</button>
                </form>
            </div>
        </div>
        <div class="login-bottom">

        </div>
    </div>
</template>

<script>
    import userInfo from "../../utils/userInfo";

    export default {
        name: "login",
        data(){
            return{
                loginInfo:{
                    username:process.env.DEFAULT_USERNAME,
                    password:process.env.DEFAULT_PASSWORD
                }
            }
        },
        methods:{
          dld(){
            // window.open(this.request.api_pre+'app/android/download', '_self');
            window.open(_self.commonUtils.buildTokenUrl('app/android/download'), '_self');
            /*      this.request.get({
                    url:'app/android/download'
                  }).then(function (res) {
                    console.log(JSON.stringify(res))
                  })*/
          },
          /**
           * 登录
           */
            doLogin(){
                let _self=this
                this.request.post(
                    {
                        url:'login',
                        data:_self.loginInfo
                    }
                ).then(function (res) {
                    if (!_self.commonUtils.isStrIsNull(userInfo.getJwt())){
                        localStorage.setItem("userDetail",JSON.stringify(res.data.result))
                        _self.$router.push('/index')
                    }
                })
            }
        }
    }
</script>
<style scoped lang="scss">
  @import "~@/scss/components/login.scss";
</style>
