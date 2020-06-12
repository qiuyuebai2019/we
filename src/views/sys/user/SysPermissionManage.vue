<template>
  <el-container>
    <el-header style="height: 20%" class="h1-title">
      <span v-text="containerChild" style="font-size: 16px; color: #999;"></span>
    </el-header>
    <el-container style="height: 80%" class="show-container">
      <el-aside class="map-tree-wrapper" style="width: 14%">
        <el-button @click="refreshView" type="primary" icon="el-icon-refresh-left" size="small">返回根节点</el-button>
        <el-tree v-if="treeShow" class="map-tree" ref="tree" :props="props" check-strictly :load="getTreeList" lazy
                 node-key="id"
                 :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main class="show-main">
        <SysPermission @sysPermissionTree="sysPermissionTree" @refresh-tree="refreshTree"
                       :dept-data="deptData"></SysPermission>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SysPermission from "./SysPermission"
    export default {
      name: "SysPermissionManage",
      components:{SysPermission},
      data(){
          return{
            containerChild:"权限维护",
            //往子组件传参数
            deptData: {},
            props:{
              children:'id',
              label:'name',
              isLeaf: 'leaf'
            },
            //树形结构数据
            treeData: [],
            //根节点 默认展开一层 这里放需要展开的节点id数组
            defaultExpandKeys: [],
            //接收noed用于重新加载页面
            treeNode: {},
            //接收resolve用于重新加载页面
            treeResolve: {},
            node_had:[],
            resolve_had:[],
            treeShow:true,
            viewShow:true
          }

      },
      methods: {
        //刷新树
        refreshTree(){
          this.treeShow=false;
          this.$nextTick(() => {
            this.treeShow=true;
          })
        },
        //刷新整个视图
        refreshView(){
          this.deptData={}
        },
        //点击后信息回调方法,父组件向子组件传送参数
        handleNodeClick(obj, node, data){

          this.deptData={"id":obj.id}
          this.containerChild = "当前位置："+obj.name
        },
        sysPermissionTree(val) {

          if (val === true) {
            this.node_had.childNodes = [];//把存起来的node的子节点清空，不然会界面会出现重复树！
            this.getTreeList(this.node_had, this.resolve_had)
          }
        },

        //获取树形菜单数据
        async getTreeList(node,resolve){
          let _self = this
          _self.node_had = node;//这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
          _self.resolve_had = resolve;//同上，把node.level == 0的resolve也存起来
          let id=''
          if(node.level==0){

          }else{
            id=node.key
          }
          _self.treeNode = node
          _self.treeResolve = resolve
          _self.request.getList(
            {
              url: 'sysPermission/getTreeList?parentId='+id,
            }
          ).then(function (response) {
            _self.treeData = response.data.result
            //console.log(_self.treeData)
            let data = []
            for (let i = 0; i < _self.treeData.length; i++) {
              //判断是否叶子节点
              let isLeafTemp=false;
              if( _self.treeData[i].type==2){
                //对于模块-菜单树来说  type=2 菜单 就是叶子节点
                isLeafTemp=true
              }
              data.push({name: _self.treeData[i].name, id: _self.treeData[i].id,leaf:isLeafTemp})
               if (_self.treeData[i].id == '') {
                _self.defaultExpandKeys.push(_self.treeData[0].id)
                _self.containerChild = "当前位置："+_self.treeData[i].name
                _self.deptData={"id":_self.treeData[i].id}
                }
            }

            return resolve(data);
          })
        },

      },

    }
</script>

<style scoped>

</style>
