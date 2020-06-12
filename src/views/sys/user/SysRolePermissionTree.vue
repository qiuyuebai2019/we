<template>
  <el-tree
    class="map-tree"
    ref="tree"
    show-checkbox
    :data="treeData"
    node-key="id"
    :default-expanded-keys="defaultCheckedKeys"
    :default-checked-keys="defaultCheckedKeys"
    @node-click="handleNodeClick"
  ></el-tree>
</template>
<script>
  /**
   * 角色管理中：选择权限树
   */
  import SysPermission from './SysPermission';
export default {
  props: ['roleId'],
  name: 'SysPermissionTree',
  components: { SysPermission },
  data() {
    return {
      containerChild: '角色权限维护',
      //往子组件传参数
      deptData: {},
      //树形结构数据
      treeData: [],

      //根节点 默认展开一层 这里放需要展开的节点id数组
      defaultExpandKeys: [],

      //默认选中的节点
      defaultCheckedKeys: [],

      //接收noed用于重新加载页面
      treeNode: {},

      //接收resolve用于重新加载页面
      treeResolve: {},
      node_had:[],
      resolve_had:[],
    };
  },
  methods: {
    getPermissionTree(){
       let _self = this;
      _self.request
        .getList({
          url: 'sysRole/getPermissionTreeAndRolePermission/'+this.roleId
        })
        .then(function(response) {
          _self.treeData = response.data.result.tree;
          _self.defaultCheckedKeys=response.data.result.checked
        });
    },
    //点击后信息回调方法,父组件向子组件传送参数
    handleNodeClick(obj, node, data) {
      this.deptData = { id: obj.id };
      this.containerChild = '当前位置：' + obj.name;
    },
    //根据角色id保存权限树选中的数据
    postRoleTreeData() {
      let _self = this;
      let data = { id: _self.roleId, tree: _self.$refs.tree.getCheckedNodes() };
      _self.request
        .save({
          url: 'sysRole/saveRoleTreeData',
          data: data
        })
        .then(response => {});
    },
  },
  mounted() {
      this.getPermissionTree()
  }
};
</script>
