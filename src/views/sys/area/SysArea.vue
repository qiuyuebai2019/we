<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysAreaForm" class="clear">

                <el-form-item class="w25" label="区域名">
                    <el-input v-model="searchSysAreaForm.areaName" placeholder="区域名"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="区域编码">
                    <el-input v-model="searchSysAreaForm.areaCode" placeholder="区域编码"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="创建人">
                    <el-input v-model="searchSysAreaForm.createName" placeholder="创建人"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysAreaForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysArea" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysArea" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysArea(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysAreaSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysArea" @row-click="rowClickSysArea" :data="tableSysArea.tableData" :height="tableHeight"
                      @selection-change="handleSysAreaSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysArea.curPageNum,defaultSearchSysArea.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysArea(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysArea(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="areaName" label="区域名"   width="120"></el-table-column>

                <el-table-column prop="areaCode" label="区域编码"   width="120"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysAreaSizeChange"
                    @current-change="handleSysAreaCurrentChange"
                    :current-page="tableSysArea.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysArea.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysArea.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysAreaTitle"  width="500px" top="10Vh"  :visible.sync="dialogSysAreaFormVisible">
                <el-form :rules="formSysAreaRules" ref="formSysArea" :model="formSysArea" :disabled=isSysAreaDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w100" prop="areaName" label="区域名" verify>
                        <el-input  v-model="formSysArea.areaName" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w100" prop="areaCode" label="区域编码" verify>
                        <el-input  v-model="formSysArea.areaCode" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysAreaFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysAreaForm" v-if="!isSysAreaDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * 区域表维护
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    export default {
        name: "SysArea",
        data() {
            return {
                formSysAreaTitle: "区域表维护",
                dialogSysAreaFormVisible: false,//弹窗是否显示
                formSysArea: {},//表单数据
                formSysAreaRules: {},//校验字段以及规则
                tableSysArea: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysAreaDisabled: false,
                multipleSelectionSysArea: [],//多选时已选择的数据
                searchSysAreaForm: {},
                defaultSearchSysArea: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysArea:{},
                isRowClickSysArea:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickSysArea:function(row){
                if (!this.isRowClickSysArea){
                    this.$refs.tableSysArea.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysArea=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysAreaSearch() {
                this.searchSysAreaForm = {}
                delete this.defaultSearchSysArea.params.filter//移除对象的某个属性
                this.getListSysArea(1)
            },
            //切换每页页数
            handleSysAreaSizeChange(val) {
                this.defaultSearchSysArea.params.pageSize = val
                this.getListSysArea(1)
            },
            //切换当前页码
            handleSysAreaCurrentChange(val) {
                this.getListSysArea(val)
            },
            //打开新增
            goAddSysArea() {
                this.formSysArea = {}
                this.dialogSysAreaFormVisible = true
                this.isSysAreaDisabled=false
            },
            //保存
            saveSysAreaForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysArea',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysArea',
                        data:  _self.formSysArea
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysArea=response.data.result
                        _self.getListSysArea(1);
                    })
            },
            //删除数据
            deleteItemsSysArea() {
                let _self = this
                if (_self.multipleSelectionSysArea.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysArea);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysArea.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysArea',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysArea(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysArea(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysArea/'+ id
                    }
                ).then(function (response) {
                    _self.formSysArea = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysArea(isSysAreaDisabled,rowData) {
                let _self=this
                this.isRowClickSysArea=true
                this.formSysArea = {}
                this.getOneSysArea(rowData.id).then(
                    function () {
                        _self.dialogSysAreaFormVisible = true
                    }
                )
                this.isSysAreaDisabled = isSysAreaDisabled
            },
            handleSysAreaSelectionChange(val) {
                this.multipleSelectionSysArea = val;
            },
            //获取列表
            getListSysArea(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysAreaForm)//拼接查询条件
                _self.defaultSearchSysArea.params.filter = filter
                _self.defaultSearchSysArea.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysArea',
                        params: _self.defaultSearchSysArea.params
                    }
                ).then(function (response) {
                    _self.tableSysArea.tableData = response.data.result.records
                    _self.tableSysArea.total = response.data.result.total
                    _self.tableSysArea.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysArea, _self.dictsSysArea)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysArea(1)
        },
        watch:{
            multipleSelectionSysArea(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


