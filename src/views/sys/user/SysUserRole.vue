<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysUserRoleForm" class="clear">

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysUserRole" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysUserRole" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysUserRole(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysUserRoleSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysUserRole" @row-click="rowClickSysUserRole" :data="tableSysUserRole.tableData" :height="tableHeight"
                      @selection-change="handleSysUserRoleSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysUserRole.curPageNum,defaultSearchSysUserRole.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysUserRole(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysUserRole(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

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


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysUserRoleTitle"  width="80%" top="10Vh"  :visible.sync="dialogSysUserRoleFormVisible">
                <el-form :rules="formSysUserRoleRules" ref="formSysUserRole" :model="formSysUserRole" :disabled=isSysUserRoleDisabled class="clear dialog-form"  label-width="100px">

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysUserRoleFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysUserRoleForm">保 存</el-button>
                </div>
            </el-dialog>
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
        name: "SysUserRole",
        data() {
            return {
                formSysUserRoleTitle: "用户角色关联表",
                dialogSysUserRoleFormVisible: false,//弹窗是否显示
                formSysUserRole: {},//表单数据
                formSysUserRoleRules: {},//校验字段以及规则
                tableSysUserRole: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysUserRoleDisabled: false,
                multipleSelectionSysUserRole: [],//多选时已选择的数据
                searchSysUserRoleForm: {},
                defaultSearchSysUserRole: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysUserRole:{},
                isRowClickSysUserRole:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
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
                this.searchSysUserRoleForm = {}
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
            //打开新增
            goAddSysUserRole() {
                this.formSysUserRole = {}
                this.dialogSysUserRoleFormVisible = true
                this.isSysUserRoleDisabled=false
            },
            //保存
            saveSysUserRoleForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysUserRole',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysUserRole',
                        data:  _self.formSysUserRole
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysUserRole=response.data.result
                        _self.getListSysUserRole(1);
                    })
            },
            //删除数据
            deleteItemsSysUserRole() {
                let _self = this
                if (_self.multipleSelectionSysUserRole.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysUserRole);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysUserRole.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysUserRole',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysUserRole(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
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
            //修改或者查看页
            goUpdateSysUserRole(isSysUserRoleDisabled,rowData) {
                let _self=this
                this.isRowClickSysUserRole=true
                this.formSysUserRole = {}
                this.getOneSysUserRole(rowData.id).then(
                    function () {
                        _self.dialogSysUserRoleFormVisible = true
                    }
                )
                this.isSysUserRoleDisabled = isSysUserRoleDisabled
            },
            handleSysUserRoleSelectionChange(val) {
                this.multipleSelectionSysUserRole = val;
            },
            //获取列表
            getListSysUserRole(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysUserRoleForm)//拼接查询条件
                _self.defaultSearchSysUserRole.params.filter = filter
                _self.defaultSearchSysUserRole.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysUserRole',
                        params: _self.defaultSearchSysUserRole.params
                    }
                ).then(function (response) {
                    _self.tableSysUserRole.tableData = response.data.result.records
                    _self.tableSysUserRole.total = response.data.result.total
                    _self.tableSysUserRole.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysUserRole, _self.dictsSysUserRole)
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
            }
        }
    }
</script>


