<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchSysPermissionForm" class="clear">

        <el-form-item class="w25" label="许可编码">
          <el-input v-model="searchSysPermissionForm.code" placeholder="许可编码"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="许可名称">
          <el-input v-model="searchSysPermissionForm.name" placeholder="许可名称"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="类型">
          <el-select v-model="searchSysPermissionForm.type" placeholder="请选择" :clearable="true">
            <el-option v-for="item in dictsSysPermission.type" :key="item.value" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="是否无效">
          <el-select v-model="searchSysPermissionForm.isDisable" placeholder="请选择" :clearable="true">
            <el-option v-for="item in dictsSysPermission.isDisable" :key="item.value" :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddSysPermission" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsSysPermission" type="primary" icon="el-icon-delete" size="small">删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListSysPermission(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertSysPermissionSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableSysPermission" @row-click="rowClickSysPermission" :data="tableSysPermission.tableData"
                :height="tableHeight"
                @selection-change="handleSysPermissionSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableSysPermission.curPageNum,defaultSearchSysPermission.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateSysPermission(false,scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateSysPermission(true,scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="code" label="许可编码" width="120"></el-table-column>

        <el-table-column prop="name" label="许可名称" width="120"></el-table-column>

        <el-table-column prop="typeLabel" label="类型" align="right" :formatter="commonUtils.formatMoney"
                         width="120"></el-table-column>

        <el-table-column prop="icon" label="图标" width="120"></el-table-column>

        <el-table-column prop="isDisableLabel" label="是否无效" align="right" :formatter="commonUtils.formatMoney"
                         width="120"></el-table-column>

        <el-table-column prop="createName" label="创建人名称" width="120"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate"
                         width="140"></el-table-column>

        <el-table-column prop="xh" label="序号" align="right" :formatter="commonUtils.formatMoney"
                         width="120"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleSysPermissionSizeChange"
        @current-change="handleSysPermissionCurrentChange"
        :current-page="tableSysPermission.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchSysPermission.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableSysPermission.total">
      </el-pagination>
    </div>


    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formSysPermissionTitle" width="30%" top="10Vh" :visible.sync="dialogSysPermissionFormVisible">
        <el-form :rules="formSysPermissionRules" ref="formSysPermission" :model="formSysPermission"
                 :disabled=isSysPermissionDisabled class="clear dialog-form" label-width="100px">

          <el-form-item verify class="w100" prop="code" label="许可编码">
            <el-input v-model="formSysPermission.code" :maxlength="30" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="name" label="许可名称">
            <el-input v-model="formSysPermission.name" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify can-be-empty class="w100" prop="type" label="类型" int>
            <el-select v-model="formSysPermission.type" placeholder="请选择">
              <el-option v-for="item in dictsSysPermission.type" :key="item.value" :label="item.text"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="w100" prop="icon" label="图标">
            <el-input v-model="formSysPermission.icon" :maxlength="30" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify can-be-empty class="w100" prop="isDisable" label="是否无效" int>
            <el-select v-model="formSysPermission.isDisable" placeholder="请选择">
              <el-option v-for="item in dictsSysPermission.isDisable"
                         :key="item.value"
                         :label="item.text"
                         :value="item.value">

              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item verify can-be-empty class="w100" prop="xh" label="序号" int>
            <el-input v-model="formSysPermission.xh" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="button" label="权限结构">
            <el-input v-model="sysPermissionPath" :maxlength="30" autocomplete="off" @focus="permissionTree"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSysPermissionFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveSysPermissionForm" v-if="!isSysPermissionDisabled">保 存</el-button>
        </div>
      </el-dialog>
    </div>
    <!--权限树弹窗-->
    <div class="map-form">
      <el-dialog title="选择父权限" width="30%" top="15Vh" :visible.sync="dialogSysPermissionTreeVisible" append-to-body>
        <!--显示权限树-->
        <GetParentPermissionList v-if="dialogSysPermissionTreeVisible"
                                 ref="GetParentPermissionList"
                                 :id="id"
                                 :isRadio="true"
                                 :checkedKeys="checkedKeys"
                                 :parentId="parentId"
                                 @refresh="refresh"></GetParentPermissionList>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSysPermissionTreeVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveSysRoleTree(id)">保 存</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  /**
   * 系统权限表
   * Created by Code Generator.
   *
   * @author :
   * @date :
   */
  import GetParentPermissionList from "./GetParentPermissionList";

  export default {
    name: "SysPermission",
    components: {GetParentPermissionList},
    props: ['deptId'],
    data() {
      return {
        formSysPermissionTitle: "系统权限表",
        dialogSysPermissionFormVisible: false,//弹窗是否显示
        formSysPermission: {},//表单数据
        formSysPermissionRules: {},//校验字段以及规则
        tableSysPermission: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isSysPermissionDisabled: false,
        multipleSelectionSysPermission: [],//多选时已选择的数据
        searchSysPermissionForm: {},
        defaultSearchSysPermission: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsSysPermission: {},
        isRowClickSysPermission: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
        id: '',
        checkedKeys: [],//给子组件传送组织选中数据
        parentId: '', //选中数据的父级
        dialogSysPermissionTreeVisible: false, //权限树弹窗是否显示
        sysPermissionPath: ''
      }
    },
    methods: {
      //选择父权限保存
      saveSysRoleTree(id) {
        this.$refs.GetParentPermissionList.savePermissionTree();
      },

      // 刷新
      refresh(){
        this.$emit("refresh-tree");
        this.getOneSysPermission(this.id);
        this.getListSysPermission(1);
        this.$nextTick(() => {
          this.dialogSysPermissionTreeVisible = false
        })
      },

      // 打开权限弹窗
      permissionTree() {
        let _self = this;
        _self.parentId = _self.formSysPermission.parentId
        _self.dialogSysPermissionTreeVisible = true
      },

      //table单击行事件
      rowClickSysPermission: function (row) {
        if (!this.isRowClickSysPermission) {
          this.$refs.tableSysPermission.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickSysPermission = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertSysPermissionSearch() {
        this.searchSysPermissionForm = {}
        delete this.defaultSearchSysPermission.params.filter//移除对象的某个属性
        this.getListSysPermission(1)
      },
      //切换每页页数
      handleSysPermissionSizeChange(val) {
        this.defaultSearchSysPermission.params.pageSize = val
        this.getListSysPermission(1)
      },
      //切换当前页码
      handleSysPermissionCurrentChange(val) {
        this.getListSysPermission(val)
      },
      //打开新增
      goAddSysPermission() {
        this.formSysPermission = {}
        this.dialogSysPermissionFormVisible = true
        this.isSysPermissionDisabled = false
      },
      //保存
      saveSysPermissionForm() {
        let _self = this
        if (!_self.formSysPermission.parentId) {
          _self.formSysPermission.parentId = this.deptId
        }
        _self.formSysPermission.isWebsite = 1
        if (!_self.commonUtils.checkForm('formSysPermission', _self)) {
          return false
        }//表单校验
        _self.request.save(
            {
              url: 'sysPermission',
              data: _self.formSysPermission
            }
        )
            .then((response) => {
              //保存后自动将后台信息填充到表单
              _self.formSysPermission = response.data.result
              _self.getListSysPermission(1);
              _self.$emit("refresh-tree")
            })
      },
      //删除数据
      deleteItemsSysPermission() {
        let _self = this
        if (_self.multipleSelectionSysPermission.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysPermission);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionSysPermission.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
              {
                url: 'sysPermission',
                data: ids
              }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListSysPermission(1)
            _self.$emit("refresh-tree")
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneSysPermission(id) {
        let _self = this
        return _self.request.getOne(
            {
              url: 'sysPermission/' + id
            }
        ).then(function (response) {
          _self.formSysPermission = response.data.result;
          _self.sysPermissionPath = response.data.message;
        })
      },
      //修改或者查看页
      goUpdateSysPermission(isSysPermissionDisabled, rowData) {
        let _self = this
        this.isRowClickSysPermission = true
        this.formSysPermission = {}
        this.getOneSysPermission(rowData.id).then(
            function () {
              _self.dialogSysPermissionFormVisible = true
            }
        )
        this.isSysPermissionDisabled = isSysPermissionDisabled
        this.id = rowData.id
      },
      handleSysPermissionSelectionChange(val) {
        this.multipleSelectionSysPermission = val;
      },
      //获取列表
      getListSysPermission(page) {
        let _self = this
        if (_self.deptId) {
          _self.searchSysPermissionForm.parentId = _self.deptId
        } else {
          _self.searchSysPermissionForm.parentId = ''
        }
        _self.searchSysPermissionForm.isWebsite = 1;
        let filter = _self.commonUtils.getDefaultFilter(_self.searchSysPermissionForm) //拼接查询条件
        _self.defaultSearchSysPermission.params.filter = filter
        _self.defaultSearchSysPermission.params.page = page
        //请求到后台
        _self.request.getList(
            {
              url: 'sysPermission',
              params: _self.defaultSearchSysPermission.params
            }
        ).then(function (response) {
          _self.tableSysPermission.tableData = response.data.result.records
          _self.tableSysPermission.total = response.data.result.total
          _self.tableSysPermission.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableSysPermission, _self.dictsSysPermission)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListSysPermission(1)
    },
    watch: {
      multipleSelectionSysPermission() {
        this.commonUtils.toggleSelectTrStyle(this)
      },

      deptId: function (val) {
        this.getListSysPermission(1)
      },
    }
  }
</script>


