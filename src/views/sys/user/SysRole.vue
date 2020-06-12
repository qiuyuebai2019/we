<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchSysRoleForm" class="clear">
        <el-form-item class="w25" label="角色编码"><el-input v-model="searchSysRoleForm.code" placeholder="角色编码"></el-input></el-form-item>

        <el-form-item class="w25" label="角色名称"><el-input v-model="searchSysRoleForm.name" placeholder="角色名称"></el-input></el-form-item>

        <!-- <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysRoleForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item> -->
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddSysRole" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsSysRole" type="primary" icon="el-icon-delete" size="small">删除</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListSysRole(1)" size="small">查询</el-button>
            <el-button type="primary" @click="resertSysRoleSearch" size="small">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table
        ref="tableSysRole"
        @row-click="rowClickSysRole"
        :data="tableSysRole.tableData"
        :height="tableHeight"
        @selection-change="handleSysRoleSelectionChange"
        tooltip-effect="dark"
        stripe
        border
      >
        <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{ commonUtils.getTableIndex(tableSysRole.curPageNum, defaultSearchSysRole.params.pageSize, scope.$index) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="220" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateSysRole(false, scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateSysRole(true, scope.row)">查看</el-button>
            <el-button type="text" @click="goUpdateSysRoleTree(scope.row)">权限</el-button>
            <el-button type="text" @click="goUpdateSysRoleTree2(scope.row)">授权</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="角色编码" width="140"></el-table-column>

        <el-table-column prop="name" label="角色名称" width="140"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="160"></el-table-column>

        <el-table-column prop="createName" label="创建人名称" align="center" width="140"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleSysRoleSizeChange"
        @current-change="handleSysRoleCurrentChange"
        :current-page="tableSysRole.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchSysRole.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableSysRole.total"
      ></el-pagination>
    </div>

    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formSysRoleTitle" width="30%" top="10Vh" :visible.sync="dialogSysRoleFormVisible">
        <el-form :rules="formSysRoleRules" ref="formSysRole" :model="formSysRole" :disabled="isSysRoleDisabled" class="clear dialog-form" label-width="100px">
          <el-form-item verify class="w100" prop="code" label="角色编码"><el-input v-model="formSysRole.code" :maxlength="50" autocomplete="off"></el-input></el-form-item>

          <el-form-item verify class="w100" prop="name" label="角色名称"><el-input v-model="formSysRole.name" :maxlength="50" autocomplete="off"></el-input></el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSysRoleFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveSysRoleForm" v-if="bcshow">保 存</el-button>
        </div>
      </el-dialog>
    </div>

    <div class="map-form">
      <!--角色库弹窗-->
      <el-dialog title="选择角色权限" width="20%" top="15Vh" :visible.sync="dialogSysUserRoleTreeVisible">
        <!--显示的角色信息  为当前用户所没有的角色-->
        <SysRolePermissionTree v-if="dialogSysUserRoleTreeVisible" ref="SysRolePermissionTree"  :roleId="roleId" ></SysRolePermissionTree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSysUserRoleTreeVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveSysRoleTree()">保 存</el-button>
        </div>
      </el-dialog>
      <!--角色库弹窗-->
      <el-dialog title="角色授权" width="80%" top="15Vh" :visible.sync="dialogTransfe2">
        <!--显示的角色信息  为当前用户所没有的角色-->
        <SysRolePermissionSet v-if="dialogTransfe2" ref="SysRolePermissionSet"  :roleId="roleId" ></SysRolePermissionSet>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogTransfe2 = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/**
 * Created by Code Generator.
 * Author: qindonghui
 * Date: Wed Nov 27 2019 17:15:52 GMT+0800 (GMT+08:00)
 * 系统角色表
 */
import SysRolePermissionTree from './SysRolePermissionTree';
import SysRolePermissionSet from './SysRolePermissionSet';
export default {
  props: ['userId'],
  name: 'SysRole',
  components: { SysRolePermissionTree,SysRolePermissionSet},
  data() {
    return {
      formSysRoleTitle: '系统角色表',
      dialogSysRoleFormVisible: false, //弹窗是否显示
      formSysRole: {}, //表单数据
      formSysRoleRules: {}, //校验字段以及规则
      tableSysRole: {
        tableData: [],
        page: 1,
        total: null,
        curPageNum: 1
      },
      isSysRoleDisabled: false,
      multipleSelectionSysRole: [], //多选时已选择的数据
      searchSysRoleForm: {},
      defaultSearchSysRole: {
        params: { page: 1, pageSize: 20, sorter: 'createTime=desc' }
      },
      dictsSysRole: {},
      isRowClickSysRole: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      bcshow: true, //编辑 查看时保存按钮控制标记
      dialogSysUserRoleTreeVisible: false, //角色权限弹框控制
      dialogTransfe2: false, //角色权限弹框控制 穿梭框
      checkedKeys: [], //给子组件传送权限默认选中数据
      roleId: '' ,//给子组件传送列表选中的角色id
      treeData2: []
    };
  },
  methods: {
    //table单击行事件
    rowClickSysRole: function(row) {
      if (!this.isRowClickSysRole) {
        this.$refs.tableSysRole.toggleRowSelection(row); //切换选中
      } else {
        this.isRowClickSysRole = false;
      }
      //其他行点击事件逻辑
    },
    //重置
    resertSysRoleSearch() {
      this.searchSysRoleForm = {};
      delete this.defaultSearchSysRole.params.filter; //移除对象的某个属性
      this.getListSysRole(1);
    },
    //切换每页页数
    handleSysRoleSizeChange(val) {
      this.defaultSearchSysRole.params.pageSize = val;
      this.getListSysRole(1);
    },
    //切换当前页码
    handleSysRoleCurrentChange(val) {
      this.getListSysRole(val);
    },
    //打开新增
    goAddSysRole() {
      this.formSysRole = {};
      this.dialogSysRoleFormVisible = true;
      this.isSysRoleDisabled = false;
      this.bcshow = true;
    },
    //保存
    saveSysRoleForm() {
      let _self = this;
      if (!_self.commonUtils.checkForm('formSysRole', _self)) {
        return false;
      } //表单校验
      _self.request
        .save({
          url: 'sysRole',
          data: _self.formSysRole
        })
        .then(response => {
          //保存后自动将后台信息填充到表单
          _self.formSysRole = response.data.result;
          _self.getListSysRole(1);
        });
    },
    //删除数据
    deleteItemsSysRole() {
      let _self = this;
      if (_self.multipleSelectionSysRole.length === 0) {
        this.commonUtils.message('请至少选择一条再删除');
        return false;
      }
      let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysRole);
      return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionSysRole.length + '条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _self.request
            .delete({
              url: 'sysRole',
              data: ids
            })
            .then(function(response) {
              //删除完成后需要执行的方法
              _self.getListSysRole(1);
            });
        })
        .catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //获取一条
    getOneSysRole(id) {
      let _self = this;
      return _self.request
        .getOne({
          url: 'sysRole/' + id
        })
        .then(function(response) {
          _self.formSysRole = response.data.result;
        });
    },
    //修改或者查看页
    goUpdateSysRole(isSysRoleDisabled, rowData) {
      let _self = this;
      this.isRowClickSysRole = true;
      this.formSysRole = {};
      if (isSysRoleDisabled) {
        _self.bcshow = false;
      } else {
        _self.bcshow = true;
      }
      this.getOneSysRole(rowData.id);
      _self.dialogSysRoleFormVisible = true;

      this.isSysRoleDisabled = isSysRoleDisabled;
      this.getListSysRole(1);
    },
    handleSysRoleSelectionChange(val) {
      this.multipleSelectionSysRole = val;
    },
    //对角色拥有的权限展示选中勾选
    goUpdateSysRoleTree2(row) {
      let _self = this;
      _self.roleId = row.id;
      _self.dialogTransfe2 = true;
    },
    goUpdateSysRoleTree(row) {
      let _self = this;
      _self.roleId = row.id;
      _self.dialogSysUserRoleTreeVisible = true;
    },
    //保存角色权限树勾选数据
    saveSysRoleTree() {
      this.$refs.SysRolePermissionTree.postRoleTreeData();
    },
    //获取列表
    getListSysRole(page) {
      let _self = this;
      let filter = _self.commonUtils.getDefaultFilter(_self.searchSysRoleForm); //拼接查询条件
      _self.defaultSearchSysRole.params.filter = filter;
      _self.defaultSearchSysRole.params.page = page;
      //请求到后台
      _self.request
        .getList({
          url: 'sysRole',
          params: _self.defaultSearchSysRole.params
        })
        .then(function(response) {
          _self.tableSysRole.tableData = response.data.result.records;
          _self.tableSysRole.total = response.data.result.total;
          _self.tableSysRole.curPageNum = page;
        });
    }
  },
  //页面加载完成时执行
  mounted() {
    this.getListSysRole(1);
  },
  watch: {
    multipleSelectionSysRole() {
      this.commonUtils.toggleSelectTrStyle(this);
    }
  }
};
</script>
