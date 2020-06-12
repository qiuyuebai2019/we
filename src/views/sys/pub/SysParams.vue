<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysParamsForm" class="clear">

                <el-form-item class="w25" label="参数代码">
                    <el-input v-model="searchSysParamsForm.paramCode" placeholder="参数代码"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="参数名称">
                    <el-input v-model="searchSysParamsForm.paramName" placeholder="参数名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="参数值">
                    <el-input v-model="searchSysParamsForm.paramValue" placeholder="参数值"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="备注">
                    <el-input v-model="searchSysParamsForm.remark" placeholder="备注"></el-input>
                </el-form-item>

               <!-- <el-form-item class="w25" label="创建人">
                    <el-input v-model="searchSysParamsForm.createName" placeholder="创建人"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysParamsForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item> -->

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysParams" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysParams" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysParams(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysParamsSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysParams" @row-click="rowClickSysParams" :data="tableSysParams.tableData" :height="tableHeight"
                      @selection-change="handleSysParamsSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysParams.curPageNum,defaultSearchSysParams.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysParams(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysParams(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="paramCode" label="参数代码"   width="140"></el-table-column>

                <el-table-column prop="paramName" label="参数名称"   width="200"></el-table-column>

                <el-table-column prop="paramValue" label="参数值"   width="200"></el-table-column>

                <el-table-column prop="remark" label="备注"   width="250"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysParamsSizeChange"
                    @current-change="handleSysParamsCurrentChange"
                    :current-page="tableSysParams.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysParams.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysParams.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysParamsTitle"  width="40%" top="10Vh"  :visible.sync="dialogSysParamsFormVisible">
                <el-form :rules="formSysParamsRules" ref="formSysParams" :model="formSysParams" :disabled=isSysParamsDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item verify class="w50" prop="paramCode" label="参数代码">
                        <el-input  v-model="formSysParams.paramCode" :maxlength="42"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify class="w50" prop="paramName" label="参数名称">
                        <el-input  v-model="formSysParams.paramName" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify class="w100" prop="paramValue" label="参数值" >
                        <el-input  v-model="formSysParams.paramValue" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="remark" label="备注" >
                        <el-input  v-model="formSysParams.remark" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysParamsFormVisible = false" >关 闭</el-button>
                    <el-button type="primary" @click="saveSysParamsForm" v-if="bcshow">保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: qindonghui
     * Date: Wed Nov 27 2019 10:41:11 GMT+0800 (GMT+08:00)
     * 系统参数表
     */
    export default {
        name: "SysParams",
        data() {
            return {
                formSysParamsTitle: "系统参数表",
                dialogSysParamsFormVisible: false,//弹窗是否显示
                formSysParams: {},//表单数据
                formSysParamsRules: {},//校验字段以及规则
                tableSysParams: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysParamsDisabled: false,
                multipleSelectionSysParams: [],//多选时已选择的数据
                searchSysParamsForm: {},
                defaultSearchSysParams: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysParams:{},
                isRowClickSysParams:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                bcshow:true,//编辑 查看时保存按钮控制标记

            }
        },
        methods: {
            //table单击行事件
            rowClickSysParams:function(row){
                if (!this.isRowClickSysParams){
                    this.$refs.tableSysParams.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysParams=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysParamsSearch() {
                this.searchSysParamsForm = {}
                delete this.defaultSearchSysParams.params.filter//移除对象的某个属性
                this.getListSysParams(1)
            },
            //切换每页页数
            handleSysParamsSizeChange(val) {
                this.defaultSearchSysParams.params.pageSize = val
                this.getListSysParams(1)
            },
            //切换当前页码
            handleSysParamsCurrentChange(val) {
                this.getListSysParams(val)
            },
            //打开新增
            goAddSysParams() {
                this.formSysParams = {}
                this.dialogSysParamsFormVisible = true
                this.isSysParamsDisabled=false
                this.bcshow=true;

            },
            //保存
            saveSysParamsForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysParams',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysParams',
                        data:  _self.formSysParams
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysParams=response.data.result
                        _self.getListSysParams(1);
                    })
            },
            //删除数据
            deleteItemsSysParams() {
                let _self = this
                if (_self.multipleSelectionSysParams.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysParams);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysParams.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysParams',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysParams(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysParams(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysParams/'+ id
                    }
                ).then(function (response) {
                    _self.formSysParams = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysParams(isSysParamsDisabled,rowData) {
                let _self=this
                this.isRowClickSysParams=true
                this.formSysParams = {}
                if(isSysParamsDisabled){

                  _self.bcshow=false;
                }else{

                  _self.bcshow=true;
                }
                this.getOneSysParams(rowData.id);
                _self.dialogSysParamsFormVisible = true
                this.isSysParamsDisabled = isSysParamsDisabled
                this.getListSysParams(1)
            },
            handleSysParamsSelectionChange(val) {
                this.multipleSelectionSysParams = val;
            },
            //获取列表
            getListSysParams(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysParamsForm)//拼接查询条件
                _self.defaultSearchSysParams.params.filter = filter
                _self.defaultSearchSysParams.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysParams',
                        params: _self.defaultSearchSysParams.params
                    }
                ).then(function (response) {
                    _self.tableSysParams.tableData = response.data.result.records
                    _self.tableSysParams.total = response.data.result.total
                    _self.tableSysParams.curPageNum = page
                    /* let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysParams, _self.dictsSysParams) */
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysParams(1)
        },
        watch:{
            multipleSelectionSysParams(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>
