<template>
  <el-container class="frame-cont">
    <el-header class="frame-header">
      <!--<a id="leftmenu-trigger" class="pull-left head-float" title="收起/展开导航栏">
        <i class="fa fa-align-left"></i>
      </a>-->
      <!--<img src="../assets/logo-dky.png" class="pull-left" style="margin-left: 15px;"> 外网图标1-->
      <h3 class="pull-left head-logo">{{constant.common.title}}</h3>
      <a @click="logoff" class="pull-right head-float" title="退出登录">
        <i class="fa fa-power-off"></i>
      </a>
      <div class="head-user pull-right">
        <span>{{orgName||'无部门'}}</span>
        <el-divider direction="vertical"></el-divider>
<!--        <span>{{realname||'未登录'}}</span>-->
        <!--          <img src="./assets/user.jpg" alt>-->
        <span v-if="realname==null" style="color:#ade6e1;">{{'未登录'}}</span>
        <el-dropdown @command="handleCommand" trigger="click">
          <span v-if="realname!=null" style="color:#ade6e1;">
            {{realname}}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" v-if="realname!=null">
            <!--参考https://element.eleme.cn/#/zh-CN/component/dropdown#dropdown-menu-item-attributes-->
            <el-dropdown-item command="openDialogChangePasswordForm">修改密码</el-dropdown-item>
            <el-dropdown-item command="openDialogPersonalInformationForm">个人信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="pull-right head-tool-group">
        <!--<span class="head-tool">
          <el-badge :value="11" :max="99">
          <i class="fa fa-fw fa-tasks" ></i>
        </el-badge>
        </span>
        原来写法
        -->
        <span class="head-tool">
          <el-popover
            placement="right"   ref="popTodo"
            width="300"
            trigger="click">
            <el-table :data="todoData" @row-click="rowClickTodoList" >
              <el-table-column type="index"  label="#" align="center" :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{scope.$index +1}}</span>
                    </template>
                </el-table-column>

              <el-table-column width="150" property="menuTitle" label="业务名称"></el-table-column>
              <el-table-column width="80" property="todoNum" label="数量">
                 <template slot-scope="scope">
                        <el-button type="text" @click="addMenuTab(scope.row.menuUrl,scope.row.menuTitle)">{{scope.row.todoNum}}</el-button>
                    </template>
              </el-table-column>
            </el-table>

          </el-popover>
         <el-button v-popover:popTodo  type="text">
           <el-badge :value="todoDataCount" :max="99">
              <i class="fa fa-fw fa-tasks" ></i>
            </el-badge>
         </el-button>
        </span>
<!--        <a class="head-tool">-->
<!--          <i class="fa fa-fw fa-bell"></i>-->
<!--        </a>-->
<!--        <a class="head-tool">-->
<!--          <i class="fa fa-fw fa-envelope"></i>-->
<!--        </a>-->
      </div>
    </el-header>
    <el-container class="frame-body">
      <div class="frame-nav">
        <menu-bar :menu-click="addTab"></menu-bar>
      </div>
      <el-main>
      <!--  快捷导航      -->
        <div class="map-tab-nav clear">
          <div  class="map-tab-nav-item" v-bind:class="{'map-tab-nav-item-active':activePath===view.path}"
               v-for="view in visitedViews"
               :key="view.path">
            <span @click="addTab(view.path)">
              <router-link
                @click.middle.native="closeMenu"
                @contextmenu.prevent.native="openMenu(view,$event)"
                :to="view.path"
              >{{ view.title }}
              </router-link>
            </span>
            <template v-if="!view.affix">
              <el-button type="text" icon="el-icon-close" @click="closeTab(view)"></el-button>
            </template>
          </div>
        </div>
        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
          <li @click="refreshView">刷新</li>
          <li @click="closeAllViews">关闭所有</li>
          <li @click="closeOtherViews">关闭其他</li>
        </ul>
        <app-main/>
        <el-dialog title="修改密码" :visible.sync="dialogChangePasswordFormVisible" width="400px" top="10Vh" append-to-body>
          <el-form :model="formChangePassword">
            <el-form-item verify class="w100" prop="oldPassword" label="原密码">
              <el-input  v-model="formChangePassword.oldPassword" :maxlength="200" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item verify class="w100" prop="newPassword" label="新密码">
              <el-input  v-model="formChangePassword.newPassword" :maxlength="200" type="password" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item verify class="w100" prop="repeatPassword" label="重复密码">
              <el-input  v-model="formChangePassword.repeatPassword" :maxlength="200" type="password" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChangePasswordFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="changePassword">确 定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="个人信息" :visible.sync="dialogPersonalInformationFormVisible" width="400px" top="10Vh" append-to-body>
          <el-form :model="formPersonalInformation" :disabled="formPersonalInformationDisabled">
            <el-form-item class="w100" prop="username" label="用户名">
              <el-input  v-model="formPersonalInformation.username" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="w100" prop="realname" label="姓名">
              <el-input  v-model="formPersonalInformation.realname" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="w100" prop="orgName" label="部门">
              <el-input  v-model="formPersonalInformation.orgName" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item class="w100" prop="email" label="邮箱">
              <el-input  v-model="formPersonalInformation.email" :maxlength="200" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogPersonalInformationFormVisible = false">关 闭</el-button>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import MenuBar from "@/components/common/Menu"
  import AppMain from '@/layouts/components/AppMain'
  import commonUtils from "../utils/common";
    export default {
      name: "LayoutIndex",
      components:{MenuBar,AppMain},
      data(){
        return{
          setshow: false,
          version:0,
          visible: false,
          top: 0,
          left: 1,
          realname:null,
          orgName:null,
          dialogChangePasswordFormVisible:false,//修改密码弹窗，默认不显示
          formChangePassword: {},//formChangePassword表单的表单数据
          username:null,//用户名，例如admin
          dialogPersonalInformationFormVisible:false,//个人信息弹窗，默认不显示
          formPersonalInformation: {},//formPersonalInformation表单的表单数据
          formPersonalInformationDisabled: true,//formPersonalInformation不可编辑
          todoData:[],//待办任务记录
          todoDataCount:"0",// 待办任务总数
        }
      },
      computed:{
        visitedViews(){
          return this.$store.state.visitedViews
        },
        cachedViews(){
          return this.$store.state.cachedViews
        },
        activePath(){
          return this.$store.state.activePath
        },
        lastView(){
          return this.$store.state.lastView
        },
        isShowThisRouter(){
          return this.$store.state.isShowThisRouter
        }
      },
      mounted() {

        let userDetail=JSON.parse(localStorage.getItem("userDetail"))
        if (userDetail.department){
          this.orgName= userDetail.department.orgName
        }
        this.realname=userDetail.realname
        this.username=userDetail.username

        //获取“个人信息”表单需要的数据
        this.formPersonalInformation.username=userDetail.username;
        this.formPersonalInformation.realname=userDetail.realname;
        if (userDetail.department){
          this.formPersonalInformation.orgName=userDetail.department.orgName
        }else{
          this.formPersonalInformation.orgName='';
        }
        if (userDetail.email){
          this.formPersonalInformation.email=userDetail.email
        }else{
          this.formPersonalInformation.email='';
        }

        this.$store.commit('initVisitedViews')

          setTimeout(() => {
            this.$store.commit('updateViewIsOpen',this.$route.path)
            const isOpen=this.$store.state.viewIsOpen
            if (!isOpen) {
              let code=this.$route.path.replace(/\//g,',')
              let requestUrl= 'sysPermission/menu/'+code;
              let _self = this
              //请求到后台
              _self.request.base(
                {
                  url: requestUrl
                }
              ).then(function (response) {
                if (response.data.result){
                  _self.addTab(
                    _self.$route.path,
                    response.data.result.name
                  )
                }
              })
            }else{
              this.$store.commit('updateActivePath',this.$route.path)
            }
          }, 1000)

        this.getUserInfo();
        //定时刷新 待办任务 每20秒
        this.getUserTodoList();// 获取待办任务信息//第一次加载的是先查询一下，不然 会等20秒之后才查出来了
          this.timer = setInterval(() =>{
            this.getUserTodoList();// 获取待办任务信息
          },1000* 20)

        let storage=window.localStorage;
        let headtheme=storage['head-theme'];
        let navtheme=storage['nav-theme'];
        if (!headtheme){
          headtheme='theme1'
        }
        if (!navtheme){
          navtheme='theme1'
        }
        //页面加载完成之后将loaclStorage中的主题取出来
        this.changeHeadTheme(headtheme);
        this.changeNavTheme(navtheme);
        //监听浏览器的前进后退，默认为刷新页面
        //window.history.pushState('forward', null, '#');
        var browser=navigator.appName
        var b_version=navigator.appVersion
        var version=b_version.split(";");
        var trim_Version=version[1].replace(/[ ]/g,"");
        if(!browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0")
        {
          window.history.pushState('forward', null, '#');
        }
        window.history.forward(1);
        window.addEventListener("popstate", function(e) {
          location.reload()
        })
      },
      created(){

      },
      watch:{
        visible(value) {
          if (value) {
            document.body.addEventListener('click', this.closeMenu)
          } else {
            document.body.removeEventListener('click', this.closeMenu)
          }
        },
        $route() {
          this.addCachedViews()
        },
        lastView(val){
          if (!commonUtils.isStrIsNull(val)){
            this.$router.push(val)
            //清空lastView，原因：如果两次lastView都为相同（例如/index）则不会触发跳转
            this.$store.commit('clearLastView')
          }
        }
      },
      methods:{
        /**
         * 点击todo列表跳转路由
         * */
        rowClickTodoList: function (row) {
          this.addMenuTab(row.menuUrl,row.menuTitle);
        },
        /**
         * 跳转路由，打开tab页
         * @param path
         * @param title
         */
        addMenuTab(path,title){
          debugger
          this.$router.push(path)
          this.$store.commit(
            'addTab',
            {
              path: path,
              title: title
            }
          )
        },
        getUserInfo(){
          let _self = this
          // if (this.commonUtils.getUserInfo()!=null){
          //   this.realname=this.commonUtils.getUserInfo().name
          //   return
          // }
          //请求到后台
          return
          _self.request.base(
            {
              methods:'post',
              url: 'mapCommon/rest/loginuser/getUserInfo'
            }
          ).then(function (response) {
            let userInfo=response.data.resultValue;
            _self.commonUtils.setUserInfo(userInfo)
            _self.realname=userInfo.name
          })
        },
        getUserTodoList(){
          let _self = this
          _self.request.baseNoMask(
            {
              methods:'post',
              url: 'sysTodoConfig/getTodoList',
            }
          ).then(function (response) {
            _self.todoData=response.data.result.records;
            _self.todoDataCount=response.data.result.total
          })
        },
        //退出登录
        logoff(){
          let _self = this
          this.$confirm('确定要退出当前登录吗？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            _self.commonUtils.clearUserInfo()
            _self.$router.push('/login')
          })
        },
        //增加缓存组件
        addCachedViews(){
          let name=this.$route.matched[1].components.default.name
          this.$store.commit('addCachedViews',name)
        },

        //关闭所有页面
        closeAllViews(){
          this.$store.commit('closeAllViews')
        },
        //关闭其他页面
        closeOtherViews(){
          let name=this.$route.matched[0].components.default.name
          this.$store.commit('closeOtherViews',name)
        },
        //关闭标签
        closeTab(view){
          let name=this.$route.matched[0].components.default.name
          this.$store.commit('closeTab',view,name);
        },
        //关闭浮动菜单
        closeMenu(){
          this.visible=false
        },
        //右键打开浮动菜单
        openMenu(view,e){
          const menuMinWidth = 115
          const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
          const offsetWidth = this.$el.offsetWidth // container width
          const maxLeft = offsetWidth - menuMinWidth // left boundary
          const left = e.clientX - offsetLeft + 15 // 15: margin right

          if (left > maxLeft) {
            this.left = maxLeft
          } else {
            this.left = left
          }

          this.top = e.clientY
          this.visible = true
        },
        //刷新页面
        refreshView(){
          let fullPath=this.activePath
          let _self=this
          this.$nextTick(() => {
            ++_self.version
            this.$router.replace({
              path:  fullPath+'?v='+_self.version
            })
          })
        },
        //新增tab页
        addTab(path, title) {
          this.$store.commit(
            'addTab',
            {
              path: path,
              title: title
            }
          )
        },
        changeHeadTheme(theme){
          window.document.documentElement.setAttribute('head-theme',theme);
          //切换主题时将主题信息存放在localStorage中
          let storage=window.localStorage;
          storage['head-theme']=theme;
        },
        changeNavTheme(theme){
          window.document.documentElement.setAttribute('nav-theme',theme);
          //切换主题时将主题信息存放在localStorage中
          let storage=window.localStorage;
          storage['nav-theme']=theme;
        },
        //dropdown组件点击事件（下拉菜单中菜单项的点击事件）
        handleCommand(command){
          let _self = this;
          if(command=='openDialogChangePasswordForm'){
            //点击的“修改密码”菜单
            _self.dialogChangePasswordFormVisible = true;
          }
          if(command=='openDialogPersonalInformationForm'){
            //点击的“个人信息”菜单
            _self.dialogPersonalInformationFormVisible = true;
          }
        },
        //formChangePassword 修改密码弹窗中单击“确定”
        changePassword(){
          let _self = this;
          let oldPassword = _self.formChangePassword.oldPassword;
          let newPassword = _self.formChangePassword.newPassword;
          let repeatPassword = _self.formChangePassword.repeatPassword;
          _self.request.post(
            {
              url: "sysUser/changePassWord/",
              data: {"username":_self.username,"oldPassword":oldPassword,"newPassword":newPassword,"repeatPassword":repeatPassword}
            }
          ).then((response) => {
            _self.dialogChangePasswordFormVisible = false
          })
        }
      }
    }
</script>


<style lang="scss">

  #app {
    height: 100%;
  }
  .frame-breadcrumb .btn-toolbar{
    line-height: 40px;
  }
  .frame-breadcrumb .btn-toolbar{
    line-height: 40px;
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    -webkit-box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
  }
  .contextmenu li{
    margin: 0;
    padding: 7px 16px;
    cursor: pointer;
  }
  .contextmenu li:hover {
    background: #eee;
  }
  /*.map-task-badge{*/
  /*  padding: 0 10px;*/
  /*}*/
  /*.map-task-badge .el-badge__content.is-fixed{*/
  /*  top: 16px;*/
  /*}*/

  /*.frame-header i {*/
  /*  font-size: 18px;*/
  /*  margin-top: 22px;*/
  /*}*/
</style>

