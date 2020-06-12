<template>
  <el-container>
    <el-header style="height: 20%" class="h1-title">
      <span v-text="containerChild" style="font-size: 16px; color: #999;"></span>
    </el-header>
    <el-container style="height: 80%" class="show-container">
      <el-aside class="map-tree-wrapper" style="width: 14%">
        <el-button @click="refreshView" type="primary" icon="el-icon-refresh-left" size="small">返回根节点</el-button>
        <el-tree class="map-tree" ref="tree" :props="props" :data="treeData" :expand-on-click-node="false"
                 node-key="id" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main class="show-main">
        <SysPermission ref="sysPermission" @sysPermissionTree="sysPermissionTree" @refresh-tree="refreshTree"
                       :deptId="deptData"></SysPermission>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import SysPermission from "./SysPermission"

  export default {
    name: "SysPermissionManage",
    components: {SysPermission},
    data() {
      return {
        containerChild: "权限维护",
        //往子组件传参数
        deptData: '',
        props: {
          children: 'children',
          label: 'name'
        },
        //树形结构数据
        treeData: [],
        //根节点 默认展开一层 这里放需要展开的节点id数组
        defaultExpandKeys: [],
        //接收noed用于重新加载页面
        treeNode: {},
        //接收resolve用于重新加载页面
        treeResolve: {},
        node_had: [],
        resolve_had: [],
        treeShow: true,
        viewShow: true
      }

    },
    methods: {
      //刷新树
      refreshTree() {
        this.getTreeList()
      },
      //刷新整个视图
      refreshView() {
        this.deptData = ''
      },
      //点击后信息回调方法,父组件向子组件传送参数
      handleNodeClick(obj, node, data) {
        this.containerChild = "当前位置：" + obj.name
        this.deptData = obj.id
      },
      sysPermissionTree(val) {

        if (val === true) {
          this.node_had.childNodes = [];//把存起来的node的子节点清空，不然会界面会出现重复树！
          this.getTreeList(this.node_had, this.resolve_had)
        }
      },

      //获取树形菜单数据
      getTreeList() {
        let _self = this;
        _self.request.get(
            {
              url: 'websiteMenu/getMenuTree'
            }
        ).then(function (response) {
          if(response.data.result.records){
            _self.treeData = response.data.result.records
          }
        })
      },

    },

    mounted() {
      this.getTreeList();
    }
  }
</script>

<style scoped>

</style>
