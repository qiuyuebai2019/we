<template>
  <el-tree class="map-tree" ref="tree" :props="props" check-strictly show-checkbox :load="getTreeList" lazy node-key="id"
           :default-expanded-keys="defaultExpandKeys"  @node-click="handleNodeClick"@check-change="selectTreeNode"></el-tree>
</template>

<script>
import SysOrg from './SysOrg';
export default {
  props: ['id', 'isRadio','userId','checkedKeys'],//parentId加载出对应的机构树 isRadio为false则为多选 为true则为单选
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
      node_had: [],
      resolve_had: [],
      checkedKey:[],
      checkedKeyParentId:'',
    };
  },
  methods: {
    //根据角色id保存权限树选中的数据
    savePermissionTree() {
      let _self = this;
      let treeDatas = _self.$refs.tree.getCheckedNodes()
      let data = { id: _self.id, treeId:treeDatas[0].id};
      _self.request
        .save({
          url: 'sysPermission/savesysPermissionTreeData',
          data: data
        })
        .then(response => {});
    },
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
        let data = []
        for (let i = 0; i < _self.treeData.length; i++) {
          data.push({name: _self.treeData[i].name, id: _self.treeData[i].id})
          if (_self.treeData[i].id == '') {
            _self.defaultExpandKeys.push(_self.treeData[0].id)
            _self.containerChild = "当前位置："+_self.treeData[i].name
            _self.deptData={"id":_self.treeData[i].id}
          }
        }

        return resolve(data);
      })
    },
    //点击后信息回调方法,父组件向子组件传送参数
    handleNodeClick(obj, node, data) {
      this.deptData = { id: obj.id };
      this.containerChild = '当前位置：' + obj.name;
    },
    //根据用户id保存组织树选中的数据
    postUserOrgTreeData() {
      let _self = this;
      let data = { id: _self.userId, tree: _self.$refs.tree.getCheckedNodes() };
      _self.request
        .save({
          url: 'sysUser/saveUserOrgTreeData',
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
    selectTreeNode(data, checked, indeterminate) {//checked为节点本身是否被选中，因为change事件是选中和取消选择都会触发的
      if (checked) {
        // if (data.children.length == 0) {//说明此节点为叶子节点，即不包含任何的children
        //   this.selectTreeOption = data //selectTreeOption存储当前的check节点；
        // }
        if (this.isRadio === true) {//组件传值
          const arr = [data.id]
          this.$refs.tree.setCheckedKeys(arr)//arr可以是一个数组，这一行的意思为对tree进行一个整体的check设置，即实现树的单选操作。
        }
      }
    },

    //获取树形菜单数据
    async getTreeList1(node, resolve) {
      let _self = this;
      _self.node_had = node; //这里是关键！在data里面定义一个变量，将node.level == 0的node存起来
      _self.resolve_had = resolve; //同上，把node.level == 0的resolve也存起来
      let id = '';
      if (node.level == 0) {
      if(_self.commonUtils.isStrIsNull(_self.parentId)){
        id=''//组件传值
        }
      } else {
        id = node.key;
      }
      _self.treeNode = node;
      _self.treeResolve = resolve;
      _self.request
        .getList({
          url: 'sysOrg/getTreeList?parentId=' + id
        })
        .then(function(response) {
          _self.treeData = response.data.result;
          let data = [];
          for (let i = 0; i < _self.treeData.length; i++) {
            data.push({ name: _self.treeData[i].orgName, id: _self.treeData[i].id });

            if (_self.treeData[i].id == _self.checkedKeyParentId) {
              _self.defaultExpandKeys.push(_self.treeData[i].id);
              _self.containerChild = '当前位置：' + _self.treeData[i].orgName;
              _self.deptData = { id: _self.treeData[i].id };
            }
          }
          return resolve(data);
        });
    }
  },
  mounted() {},
  watch: {
      checkedKeys:{
         immediate:true,
         handler: function(val) {
            let _self = this;

           if(!_self.commonUtils.isStrIsNull(val)){
                _self.checkedKey.push(val[0])
                _self.checkedKeyParentId=val[1]
           }else{
              _self.checkedKey=[]
              _self.checkedKeyParentId=''
           }

           },
           deep: true,
      },

    },
};
</script>
