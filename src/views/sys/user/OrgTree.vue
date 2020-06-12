<template>
  <el-container>
    <el-aside class="map-tree-wrapper" style="width: 12%">
      <el-header><span style="font-size: 20px; color: #999;  text-align:center; ">组织维护</span></el-header>
      <el-tree v-if="treeShow" class="map-tree" ref="tree" :props="props"  check-strictly :load="getTreeList" lazy node-key="id"
               :default-expanded-keys="defaultExpandKeys" @node-click="handleNodeClick"></el-tree>
    </el-aside>
    <el-container  style="height: 80%">
      <el-header style="height: 20%">
        <span v-text="containerChild" style="font-size: 16px; color: #999;"></span>
      </el-header>
      <el-main>
       <SysOrg  :dept-data="deptData" @selectOrgList="selectOrgList" @refresh-tree="refreshTree"></SysOrg>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SysOrg from "./SysOrg"
    export default {
      name: "OrgTree",
      components:{SysOrg},
      data(){
          return{
            containerChild:"组织维护",
            //往子组件传参数
            deptData: {},

            props:{
              children:'id',
              label:'name',
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
        //点击后信息回调方法,父组件向子组件传送参数
        handleNodeClick(obj, node, data){
          this.deptData={"id":obj.id}
          this.containerChild = "当前位置："+obj.name
        },
        selectOrgList(val) {
debugger
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
              url: 'sysOrg/getTreeList?parentId='+id,
            }
          ).then(function (response) {

            _self.treeData = response.data.result
            let data = []
            for (let i = 0; i < _self.treeData.length; i++) {
              data.push({name: _self.treeData[i].orgName, id: _self.treeData[i].id})
              if (_self.treeData[i].id == '') {
                _self.defaultExpandKeys.push(_self.treeData[i].id)
                _self.containerChild = "当前位置："+_self.treeData[i].orgName
                _self.deptData={"id":_self.treeData[i].id}
              }
            }
            return resolve(data);
          })
        },


      },
      mounted() {

      },

    }
</script>
