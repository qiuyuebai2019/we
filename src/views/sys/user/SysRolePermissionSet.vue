<template>

  <el-container>


      <el-aside class="map-tree-wrapper" style="width: 14%">
        <el-button @click="refreshView" type="primary" icon="el-icon-search" size="small">权限目录</el-button>
        <el-tree v-if="treeShow" class="map-tree" ref="tree" :props="treeprops"  :load="getTreeList" :lazy="lazy"
                 node-key="id"  show-checkbox   @check="getCheckBox"
                 :default-expanded-keys="defaultExpandKeys" @node-click="handleMenuNodeClick"></el-tree>
      </el-aside>
      <el-main class="show-main">
        <!-- 加入filter即开启搜索框 -->
        <!-- 设置 filterable 为 true 即可开启搜索模式。默认情况下，若数据项的 label 属性包含搜索关键字，则会在搜索结果中显示。你也可以使用 filter-method 定义自己的搜索逻辑。 -->
        <tree-transfer :title="twoTitle" :from_data='fromData' :to_data='toData' :defaultProps="{label:'label'}"            @addBtn='insert' @removeBtn='remove' :mode='mode' height='540px'  openAll>
        </tree-transfer>
      </el-main>

  </el-container>






</template>

<script>
  /**
   * 角色管理中：选择权限树
   */
   import treeTransfer from 'el-tree-transfer' // 引入
export default {
  props: ['roleId'],
  name: 'SysRolePermissionSet',
    components:{ treeTransfer },
  data() {
    return {
      containerChild:"权限维护",
      //往子组件传参数
      deptData: {},
      treeprops:{
        children:'id',
        label:'name',
        menuType:'type',
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
      viewShow:true,
      selectMenuNode:[],// 当前需要显示权限授权情况的菜单

      twoTitle:['未授权','已授权'],//穿梭框的左右标题
      mode: "transfer", // transfer addressList
      fromData:[],
      toData:[],
      treeDataNew:[],
      lazy:true,
    }
  },
  methods: {
    //刷新整个视图
    refreshView(){
      debugger
      let _self=this
      this.deptData={}
      let data=[]
      _self.request.postWithNoMessage({
        url:'sysRole/getSysRolePermissionList',
      }).then(function (response) {
        debugger
        _self.request
          .postWithNoMessage({
            url: 'sysRole/getPermissionTreeAndRolePermissionForTransfer?roleId='+_self.roleId,
            data:response.data.result
          })
          .then(function(response) {
            //该按钮功能只显示已授权  不显示未授权
            _self.toData=[]//已授权数据
            let toData=[]//已授权   第一层菜单
            let b=[]//已授权 第二层菜单
            let pid//第二层菜单 pid
            let bg=[]//已授权 第三层菜单
            let zpid//第三层菜单pid
            if(response.data.result!==null && response.data.result!==undefined){
              if(response.data.result.list1!==null && response.data.result.list1!==undefined){//已授权
                let list1 =response.data.result.list1
                for(let i=0;i<list1.length;i++){
                  //拼接第一层菜单
                  if(list1[i].type===1 && list1[i].ts==null){
                    b=[]
                    toData.push({id:list1[i].id,pid:0,label:list1[i].name,children:b})
                    pid=list1[i].id
                  }
                  //拼接第二层菜单
                  if(list1[i].type===2 && list1[i].ts===null){
                    bg=[]
                    b.push({id:list1[i].id,pid,label:list1[i].name,children:bg})
                    zpid=list1[i].id
                  }
                  //拼接第三层菜单
                  if(list1[i].type===3 && list1[i].ts===null){
                    bg.push({id:list1[i].id,pid:zpid,label:list1[i].name})
                  }

                  //单独菜单  例：资产状态
                  //第一层菜单
                  if(list1[i].type===2 && list1[i].ts==='1'){
                    b=[]
                    toData.push({id:list1[i].id,pid:0,label:list1[i].name,children:b})
                    pid=list1[i].id
                  }
                  //第二层菜单
                  if(list1[i].type===3 && list1[i].ts==='1'){
                    bg=[]
                    b.push({id:list1[i].id,pid,label:list1[i].name,children:bg})
                    zpid=list1[i].id
                  }
                  data.push({name:list1[i].name,id:list1[i].id})
                }

              }
            }
            _self.toData=toData
            debugger
            _self.$refs.tree.setCheckedNodes(data)
          });
      })
    },
    //刷新树
    refreshTree(){
      this.treeShow=false;
      this.$nextTick(() => {
        this.treeShow=true;
      })
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
        debugger
        _self.treeData = response.data.result
        let data = []
        for (let i = 0; i < _self.treeData.length; i++) {
          //判断是否叶子节点
          let isLeafTemp=false;
          if( _self.treeData[i].type==2){
            //对于模块-菜单树来说  type=2 菜单 就是叶子节点
            isLeafTemp=true
          }
          data.push({name: _self.treeData[i].name, id: _self.treeData[i].id,leaf:isLeafTemp,'type':_self.treeData[i].type})
          if (_self.treeData[i].id == '') {
            _self.defaultExpandKeys.push(_self.treeData[0].id)
            _self.containerChild = "当前位置："+_self.treeData[i].name
            _self.deptData={"id":_self.treeData[i].id}
          }
        }

        return resolve(data);
      })
    },


    /**
     * 树节点 复选框点击事件 选中或取消选中
     * @param obj  当前复选框对应的节点
     * @param data 当前选中的记录集合 示例：
     * {"checkedNodes":[{"name":"资产状态","id":"1c1a890e784b3e854e9d0180acf7eb00","leaf":true},{"name":"巡检管理","id":"3f9850e223651031412025944fe5e0c1","leaf":false}],"checkedKeys":["1c1a890e784b3e854e9d0180acf7eb00","3f9850e223651031412025944fe5e0c1"],"halfCheckedNodes":[],"halfCheckedKeys":[]},obj={"name":"巡检管理","id":"3f9850e223651031412025944fe5e0c1","leaf":false}
     */
    getCheckBox(obj,data){
      let _self=this
      if(data!==undefined){
        if(data.checkedNodes!==undefined && data.checkedNodes!==null){
          _self.selectMenuNode=data.checkedNodes
        }
      }
      _self.request
        .postWithNoMessage({
          url: 'sysRole/getPermissionTreeAndRolePermissionForTransfer?roleId='+_self.roleId,
          data:_self.selectMenuNode
        })
        .then(function(response) {
          _self.fromData=[]//未授权数据
          _self.toData=[]//已授权数据
          let formData=[]//未授权   第一层菜单
          let toData=[]//已授权   第一层菜单
          let c=[]//未授权 第二层菜单
          let b=[]//已授权 第二层菜单
          let pid//第二层菜单 pid
          let cg=[]//未授权 第三层菜单
          let bg=[]//已授权 第三层菜单
          let zpid//第三层菜单pid
          if(response.data.result!==null && response.data.result!==undefined){
            if(response.data.result.list1!==null && response.data.result.list1!==undefined){//已授权
              let list1 =response.data.result.list1
              for(let i=0;i<list1.length;i++){
                //拼接第一层菜单
                if(list1[i].type===1 && list1[i].ts==null){
                     b=[]
                     toData.push({id:list1[i].id,pid:0,label:list1[i].name,children:b})
                     pid=list1[i].id
                }
                //拼接第二层菜单
                if(list1[i].type===2 && list1[i].ts===null){
                  bg=[]
                  b.push({id:list1[i].id,pid,label:list1[i].name,children:bg})
                  zpid=list1[i].id
                }
                //拼接第三层菜单
                if(list1[i].type===3 && list1[i].ts===null){
                  bg.push({id:list1[i].id,pid:zpid,label:list1[i].name})
                }

                //单独菜单  例：资产状态
                //第一层菜单
                if(list1[i].type===2 && list1[i].ts==='1'){
                  b=[]
                  toData.push({id:list1[i].id,pid:0,label:list1[i].name,children:b})
                  pid=list1[i].id
                }
                //第二层菜单
                if(list1[i].type===3 && list1[i].ts==='1'){
                  bg=[]
                  b.push({id:list1[i].id,pid,label:list1[i].name,children:bg})
                  zpid=list1[i].id
                }
              }
              _self.toData=toData
            }

            if(response.data.result.list2!==null && response.data.result.list2!==undefined) {//未授权
              let list2 =response.data.result.list2
                for(let i=0;i<list2.length;i++){
                  //拼接第一层菜单
                  if(list2[i].type===1 && list2[i].ts==null){
                    c=[]
                    formData.push({id:list2[i].id,pid:0,label:list2[i].name,children:c})
                    pid=list2[i].id
                  }
                  //拼接第二层菜单
                  if(list2[i].type===2 && list2[i].ts===null){
                    cg=[]
                    c.push({id:list2[i].id,pid,label:list2[i].name,children:cg})
                    zpid=list2[i].id
                  }
                  //拼接第三层菜单
                  if(list2[i].type===3 && list2[i].ts===null){
                    cg.push({id:list2[i].id,pid:zpid,label:list2[i].name})
                  }
                  //单独菜单  例：资产状态
                  //第一层菜单
                  if(list2[i].type===2 && list2[i].ts==='1'){
                    c=[]
                    formData.push({id:list2[i].id,pid:0,label:list2[i].name,children:c})
                    pid=list2[i].id
                  }
                  //第二层菜单
                  if(list2[i].type===3 && list2[i].ts==='1'){
                    cg=[]
                    c.push({id:list2[i].id,pid,label:list2[i].name,children:cg})
                    zpid=list2[i].id
                  }

                }
              _self.fromData=formData
            }
          }
          _self.toData=toData
          _self.fromData=formData
        });
    },

    //点击后信息回调方法,父组件向子组件传送参数 点击后刷新 源数据树
    handleMenuNodeClick(obj, node, data) {//节点点击事件 注意这个不是复选框事件
      debugger
      this.deptData = { id: obj.id };
      this.containerChild = '当前位置：' + obj.name;
      //主动触发复选框的点击事件 原来是选中的时候 改为不选中 原来是不选择改为选中
      this.$refs.tree.setChecked(node, !node.checked);
      if(node.childNodes.length>0){
        for(let i=0;i<node.childNodes.length;i++){
          this.$refs.tree.setChecked(node.childNodes[i], !node.childNodes[i].checked);
        }
      }
      let checkedNodes =this.$refs.tree.getCheckedNodes();
      let datanew={checkedNodes:checkedNodes}
      this.getCheckBox(obj,datanew)
      this.lazy=false
    },

    /**
     *  获取这些菜单未授权 和已授权的集合
     */
    getPermissionTree(){
      let _self = this;
      _self.request
        .getList({
          url: 'sysRole/getPermissionTreeAndRolePermission/'+this.selectMenuNode
        })
        .then(function(response) {
          _self.treeData = response.data.result.tree;
         // _self.defaultCheckedKeys=response.data.result.checked
        });
    },


    // 切换模式 现有树形穿梭框模式transfer 和通讯录模式addressList
    changeMode() {

      if (this.mode == "transfer") {
        this.mode = "addressList";
      } else {
        this.mode = "transfer";
      }

    },

    // 监听穿梭框组件添加

    insert(fromData,toData,obj){
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的        {keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let _self = this;
      let queryMenu=obj.keys
      let insertORdeleteSysRolePermission='1'
      _self.request
        .postWithNoMessage({
          url: 'sysRole/insertORdeleteSysRolePermission?roleId='+_self.roleId+'&insertORdeleteSysRolePermission='+insertORdeleteSysRolePermission,
          data:queryMenu
        }).then(function(response) {
        let checkedNodes =_self.$refs.tree.getCheckedNodes();
        let datanew={checkedNodes:checkedNodes}
        _self.getCheckBox(obj,datanew)
      });
    },

    // 监听穿梭框组件移除

    remove(fromData,toData,obj){
      // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
      // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
      let _self = this;
      let queryMenu=obj.keys
      let insertORdeleteSysRolePermission='2'
      _self.request
        .postWithNoMessage({
          url: 'sysRole/insertORdeleteSysRolePermission?roleId='+_self.roleId+'&insertORdeleteSysRolePermission='+insertORdeleteSysRolePermission,
          data:queryMenu
        })
      let checkedNodes =this.$refs.tree.getCheckedNodes();
      let datanew={checkedNodes:checkedNodes}
      this.getCheckBox(null,datanew)
    }

  },
  mounted() {
  },
  watch:{
  },
};
</script>
