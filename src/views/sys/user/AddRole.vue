<template>
    <div>
        <!-- 查询条件 -->
        <div class="map-search-bar">
          <el-form label-width="110px" :model="searchSysRoleForm" class="clear">
            <el-form-item class="w50" label="角色编号">
              <el-input v-model="searchSysRoleForm.code" placeholder="角色编号"></el-input>
            </el-form-item>

            <el-form-item class="w50" label="角色名称">
              <el-input v-model="searchSysRoleForm.name" placeholder="角色名称"></el-input>
            </el-form-item>
          </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
          <el-row>
            <el-col :span="24">
              <div class="map-search-handel">
                <el-button type="primary" @click="getListSysUserRole(1)" size=small>查询</el-button>
                <el-button type="primary" @click="resertSysUserRoleSearch" size=small>重置</el-button>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysUserRole" @row-click="rowClickSysUserRole" :data="tableSysUserRole.tableData" height="450px"
                      @selection-change="handleSysUserRoleSelectionChange"  tooltip-effect="dark" stripe  border append-to-body>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysUserRole.curPageNum,defaultSearchSysUserRole.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="角色编码"   width="120"></el-table-column>
                <el-table-column prop="name" label="角色名称"   width="120"></el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysUserRoleSizeChange"
                    @current-change="handleSysUserRoleCurrentChange"
                    :current-page="tableSysUserRole.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysUserRole.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysUserRole.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: yangzekai
     * Date: Sat Nov 30 2019 10:42:13 GMT+0800 (GMT+08:00)
     * 用户角色关联表
     */
    export default {
      props:['userId'],
        name: "SysUserRole",
        data() {
            return {
                formSysUserRoleTitle: "用户角色关联表",
                formSysUserRole: {},//表单数据
                formSysUserRoleRules: {},//校验字段以及规则
                tableSysUserRole: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                multipleSelectionSysUserRole: [],//多选时已选择的数据
                searchSysRoleForm: {},
                searchSysRoleForm: {},
                defaultSearchSysUserRole: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysUserRole:{},
                isRowClickSysUserRole:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
          //保存
          saveSysUserRole1() {
            let _self = this
            let roleIds = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysUserRole);
              _self.request.post(
                {
                  url: 'sysRole/saveRoleToUser/',
                  data: {'userId': _self.userId, 'roleId': roleIds}
                }
              ).then((response) => {
                //保存给父组件传值   this.$emit()
                this.$emit('funToRoleList', false)
                _self.formSysUserRole = response.data.result
              })
          },
            //table单击行事件
            rowClickSysUserRole:function(row){
                if (!this.isRowClickSysUserRole){
                    this.$refs.tableSysUserRole.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysUserRole=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysUserRoleSearch() {
              this.searchSysRoleForm = {}
              delete this.defaultSearchSysUserRole.params.filter//移除对象的某个属性
              this.getListSysUserRole(1)
            },
            //切换每页页数
            handleSysUserRoleSizeChange(val) {
                this.defaultSearchSysUserRole.params.pageSize = val
                this.getListSysUserRole(1)
            },
            //切换当前页码
            handleSysUserRoleCurrentChange(val) {
                this.getListSysUserRole(val)
            },

            //获取一条
            getOneSysUserRole(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysUserRole/'+ id
                    }
                ).then(function (response) {
                    _self.formSysUserRole = response.data.result
                })
            },

            handleSysUserRoleSelectionChange(val) {
                this.multipleSelectionSysUserRole = val;
            },
            //获取列表
            getListSysUserRole(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysRoleForm)//拼接查询条件
                _self.defaultSearchSysUserRole.params.filter = filter
                _self.defaultSearchSysUserRole.params.page = page
                //请求到后台
                _self.request.get(
                  {
                    url: 'sysRole/getByUserIdNotHasRole/' + _self.userId,
                    params: _self.defaultSearchSysUserRole.params
                  }
                ).then(function (response) {
                  _self.tableSysUserRole.tableData = response.data.result.records
                  _self.tableSysUserRole.total = response.data.result.total
                  _self.tableSysUserRole.curPageNum = page
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysUserRole(1)
        },
        watch:{
            multipleSelectionSysUserRole(){
                this.commonUtils.toggleSelectTrStyle(this)
            },

        }
    }
</script>


