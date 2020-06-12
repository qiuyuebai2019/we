<template>
  <el-menu :default-active="activePath" unique-opened router class="el-menu-vertical-demo">

    <div @click="addMenuTab('/index','首页')">
      <el-menu-item index="/index">
        <i class="fa fa-fw fa-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
    </div>
<!--    循环一级菜单-->
    <template v-for="first in menu_list" >
<!--      一级菜单是否有子菜单-->
      <template v-if="!first.children">
        <div @click="addMenuTab(first.code,first.name)">
          <el-menu-item :index="first.code">
            <i class="fa fa-fw" v-bind:class="first.icon||'fa-folder'"></i>
            {{first.name}}</el-menu-item>
        </div>
      </template>
      <template v-else>
        <el-submenu  :index="first.code">
          <template slot="title">
            <i class="fa fa-fw" v-bind:class="first.icon||'fa-folder'"></i>
            <span>{{first.name}}</span>
          </template>
          <template v-for="secend in first.children" >
            <template v-if="!secend.children">
              <div @click="addMenuTab(secend.code,secend.name)">
                <el-menu-item :index="secend.code">{{secend.name}}</el-menu-item>
              </div>
            </template>
            <template v-else>
              <el-submenu :index="secend.code">
                <template slot="title">
                  <span>{{secend.name}}</span>
                </template>
                <template v-for="third in secend.children" >
                  <div @click="addMenuTab(third.code,third.name)">
                    <el-menu-item :index="third.code">{{third.name}}</el-menu-item>
                  </div>
                </template>
              </el-submenu>
            </template>
          </template>
        </el-submenu>
      </template>
    </template>
  </el-menu>
</template>

<script>
  export default {
    name: "Menu",
    computed:{
      activePath(){
        return this.$store.state.activePath
      },
    },
    data() {
      return {
        menu_list: [
        ],
        allMenu:null
      }
    },methods:{
      addMenuTab(path,title){
        this.$store.commit(
          'addTab',
          {
            path: path,
            title: title
          }
        )
      },
      //获取菜单url
      getMenu(){
        let requestUrl= 'sysPermission/menu';
        let _self = this
        //请求到后台
        _self.request.base(
                {
                  url: requestUrl
                }
        ).then(function (response) {
          let menuOriginalList=response.data.result;//菜单原始列表
          _self.$store.commit("addMenuOriginalList",menuOriginalList)
          _self.allMenu=_self.generatorMenuTree(menuOriginalList)//菜单树
          console.log( _self.allMenu)
          _self.menu_list= _self.allMenu
        })
      },
      /**
       * 根据菜单原始数据生成tree
       * @param originalMenu
       */
      generatorMenuTree(originalMenu){
        let beginParentId=null
        let dataList=originalMenu
        let formatObj = dataList.reduce((pre, cur) => {
          return {...pre, [cur['id']]: cur}
        }, {});
        let formatArray = dataList.reduce((arr, cur) => {
          let parentId = cur.parentId ? cur.parentId : beginParentId;
          let parent = formatObj[parentId];
          if (parent) {
            parent.children ? parent.children.push(cur) : parent.children=[cur];
          } else {
            arr.push(cur)
          }
          return arr;
        }, []);
        return formatArray;
      }

    },
    mounted() {
      this.getMenu();
    }
  }
</script>

<style scoped>

</style>
