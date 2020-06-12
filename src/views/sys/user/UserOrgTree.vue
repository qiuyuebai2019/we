<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="(value, key) in this.keys" :key="key">{{ value }}</el-breadcrumb-item>
    </el-breadcrumb>
    <br />
    <el-tree
      class="map-tree"
      ref="tree"
      :data="treeData"
      check-strictly
      show-checkbox
      node-key="id"
      :default-expanded-keys="defaultCheckedKeys"
      :default-checked-keys="defaultCheckedKeys"
      @node-click="handleNodeClick"
      @check-change="selectTreeNode"
    ></el-tree>
  </div>
</template>

<script>
import SysOrg from './SysOrg';
export default {
  props: ['parentId', 'isRadio', 'userId','orgId'], //parentId加载出对应的机构树 isRadio为false则为多选 为true则为单选
  name: 'OrgTree',
  components: { SysOrg },
  data() {
    return {
      containerChild: '组织机构树',
      //往子组件传参数
      deptData: {},

      props: {
        children: 'id',
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
      //显示勾选的数据
      defaultCheckedKeys: [],
      //选中节点的名称
      keys:[],
    };
  },
  methods: {
    //生成一个空白的组织树，并对已有的勾选数据显示出来
    userOrgTree() {
      let _self = this;
      _self.request
        .getList({
          url: 'sysUser/getUserOrg?userId=' + _self.userId
        })
        .then(function(response) {
          _self.treeData = response.data.result.tree;
          _self.defaultCheckedKeys = response.data.result.checked;
          _self.getuserOrgTreeName()
        });
    },
    //显示选中节点的名称
    getuserOrgTreeName() {
      let _self = this;
      _self.request
        .getList({
          url: 'sysUser/getUserOrgName?userId=' + _self.userId
        })
        .then(function(response) {
          _self.keys = response.data.result;
        });
    },
    //点击后信息回调方法,父组件向子组件传送参数
    handleNodeClick(obj, node, data) {
      this.deptData = { id: obj.id };
      this.containerChild = '当前位置：' + obj.name;
    },
    //根据用户id保存组织树选中的数据
    postUserOrgTreeData() {
      let _self = this;
      if (_self.$refs.tree.getCheckedNodes().length === 0) {
        this.commonUtils.message("请选择组织机构");
        return false;
      }
      let data = { id: _self.userId, tree: _self.$refs.tree.getCheckedNodes() };
      _self.request
        .save({
          url: 'sysUser/saveUserOrgTreeData',
          data: data
        })
        .then(response => {});
    },

    //根据组织机构id保存 组织树选中的数据
    postSysOrgTreeData() {
      let _self = this;
      let treeDatas = _self.$refs.tree.getCheckedNodes()
      let data = { id: _self.orgId, treeId:treeDatas[0].id};
      console.log(JSON.stringify(data))
      _self.request
        .save({
          url: 'sysOrg/saveSysOrgTreeData',
          data: data
        })
        .then(response => {});
    },
    /* selectOrgList(val) {
      if (val === true) {
        this.node_had.childNodes = []; //把存起来的node的子节点清空，不然会界面会出现重复树！
        this.getTreeList(this.node_had, this.resolve_had);
      }
    }, */
    //控制单选多选
    selectTreeNode(data, checked, indeterminate) {
      //checked为节点本身是否被选中，因为change事件是选中和取消选择都会触发的
      if (checked) {
        // if (data.children.length == 0) {//说明此节点为叶子节点，即不包含任何的children
        //   this.selectTreeOption = data //selectTreeOption存储当前的check节点；
        // }
        if (this.isRadio === true) {
          //组件传值
          const arr = [data.id];
          this.$refs.tree.setCheckedKeys(arr); //arr可以是一个数组，这一行的意思为对tree进行一个整体的check设置，即实现树的单选操作。
        }
      }
    },
  },
  mounted() {
    this.userOrgTree();
  },

};
</script>
