<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysTodoConfigForm" class="clear">
                
                <el-form-item class="w25" label="统计sql">
                    <el-input v-model="searchSysTodoConfigForm.countSql" placeholder="统计sql"></el-input>
                </el-form-item>
                
                <el-form-item class="w25" label="菜单标题">
                    <el-input v-model="searchSysTodoConfigForm.menuTitle" placeholder="菜单标题"></el-input>
                </el-form-item>
                
                <el-form-item class="w25" label="菜单url">
                    <el-input v-model="searchSysTodoConfigForm.menuUrl" placeholder="菜单url"></el-input>
                </el-form-item>
                
<!--                <el-form-item class="w25" label="角色名称">-->
<!--                    <el-input v-model="searchSysTodoConfigForm.roleNames" placeholder="角色名称"></el-input>-->
<!--                </el-form-item>-->
                
<!--                <el-form-item class="w25" label="角色id">-->
<!--                    <el-input v-model="searchSysTodoConfigForm.roleIds" placeholder="角色id"></el-input>-->
<!--                </el-form-item>-->
                
                <el-form-item class="w25" label="所属模块代码">
                    <el-input v-model="searchSysTodoConfigForm.mkdm" placeholder="所属模块代码"></el-input>
                </el-form-item>
<!--                -->
<!--                <el-form-item class="w25" label="排序号">-->
<!--                    <el-input v-model="searchSysTodoConfigForm.pxh" placeholder="排序号"></el-input>-->
<!--                </el-form-item>-->
                
<!--                <el-form-item class="w25" label="备注">-->
<!--                    <el-input v-model="searchSysTodoConfigForm.remark" placeholder="备注"></el-input>-->
<!--                </el-form-item>-->
                
<!--                <el-form-item class="w25" label="创建人">-->
<!--                    <el-input v-model="searchSysTodoConfigForm.createName" placeholder="创建人"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item label="创建时间" class="w50">-->
<!--                    <el-date-picker :editable="false" v-model="searchSysTodoConfigForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>-->
<!--                </el-form-item>-->
<!--                -->
            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysTodoConfig" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysTodoConfig" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysTodoConfig(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysTodoConfigSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysTodoConfig" @row-click="rowClickSysTodoConfig" :data="tableSysTodoConfig.tableData" :height="tableHeight"
                      @selection-change="handleSysTodoConfigSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH" label="#" >
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysTodoConfig.curPageNum,defaultSearchSysTodoConfig.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysTodoConfig(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysTodoConfig(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                
                <el-table-column prop="countSql" label="统计sql"   width="200"></el-table-column>
                
                <el-table-column prop="menuTitle" label="菜单标题"   width="120"></el-table-column>
                
                <el-table-column prop="menuUrl" label="菜单url"   ></el-table-column>
                
                <el-table-column prop="roleNames" label="角色名称"   width="120"></el-table-column>
                
                <el-table-column prop="roleIds" label="角色id"   width="120"></el-table-column>
                
                <el-table-column prop="mkdm" label="所属模块代码"   width="120"></el-table-column>
                
                <el-table-column prop="pxh" label="排序号" align="right" :formatter="commonUtils.formatMoney" width="120"></el-table-column>
                
                <el-table-column prop="remark" label="备注"   width="120"></el-table-column>
                
                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>
                
                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>
                
            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysTodoConfigSizeChange"
                    @current-change="handleSysTodoConfigCurrentChange"
                    :current-page="tableSysTodoConfig.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysTodoConfig.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysTodoConfig.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysTodoConfigTitle"  width="80%" top="10Vh"  :visible.sync="dialogSysTodoConfigFormVisible">
                <el-form :rules="formSysTodoConfigRules" ref="formSysTodoConfig" :model="formSysTodoConfig" :disabled=isSysTodoConfigDisabled class="clear dialog-form"  label-width="100px">
                    

                    <el-form-item  class="w25" prop="menuTitle" label="菜单标题">
                        <el-input  v-model="formSysTodoConfig.menuTitle" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>
                    
                    <el-form-item   class="w25" prop="menuUrl" label="菜单url" >
                        <el-input  v-model="formSysTodoConfig.menuUrl" :maxlength="100"  autocomplete="off"></el-input>
                    </el-form-item>
                        
                    <el-form-item   class="w25" prop="roleNames" label="角色名称" >
                        <el-input  v-model="formSysTodoConfig.roleNames" :maxlength="100"  autocomplete="off"></el-input>
                    </el-form-item>
<!--                        -->
<!--                    <el-form-item   class="w100" prop="roleIds" label="角色id" >-->
<!--                        <el-input  v-model="formSysTodoConfig.roleIds" :maxlength="100" type="textarea" autocomplete="off"></el-input>-->
<!--                    </el-form-item>-->
<!--                        -->
                    <el-form-item  class="w25" prop="mkdm" label="所属模块代码">
                        <el-input  v-model="formSysTodoConfig.mkdm" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                  <el-form-item   class="w100" prop="countSql" label="统计sql" >
                    <el-input  v-model="formSysTodoConfig.countSql" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item  verify can-be-empty  class="w25" prop="pxh" label="排序号" int>
                        <el-input v-model="formSysTodoConfig.pxh" autocomplete="off"></el-input>
                    </el-form-item>
                        
                    <el-form-item   class="w100" prop="remark" label="备注" >
                        <el-input  v-model="formSysTodoConfig.remark" :maxlength="200" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>
                        
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysTodoConfigFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysTodoConfigForm" v-if="!isSysTodoConfigDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * 08待办任务动态配置表
     * Created by Code Generator.
     *
     * @author : 
     * @date : 
     */
    export default {
        name: "SysTodoConfig",
        data() {
            return {
                formSysTodoConfigTitle: "待办任务动态配置",
                dialogSysTodoConfigFormVisible: false,//弹窗是否显示
                formSysTodoConfig: {},//表单数据
                formSysTodoConfigRules: {},//校验字段以及规则
                tableSysTodoConfig: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysTodoConfigDisabled: false,
                multipleSelectionSysTodoConfig: [],//多选时已选择的数据
                searchSysTodoConfigForm: {},
                defaultSearchSysTodoConfig: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysTodoConfig:{},
                isRowClickSysTodoConfig:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickSysTodoConfig:function(row){
                if (!this.isRowClickSysTodoConfig){
                    this.$refs.tableSysTodoConfig.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysTodoConfig=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysTodoConfigSearch() {
                this.searchSysTodoConfigForm = {}
                delete this.defaultSearchSysTodoConfig.params.filter//移除对象的某个属性
                this.getListSysTodoConfig(1)
            },
            //切换每页页数
            handleSysTodoConfigSizeChange(val) {
                this.defaultSearchSysTodoConfig.params.pageSize = val
                this.getListSysTodoConfig(1)
            },
            //切换当前页码
            handleSysTodoConfigCurrentChange(val) {
                this.getListSysTodoConfig(val)
            },
            //打开新增
            goAddSysTodoConfig() {
                this.formSysTodoConfig = {isDelete:'0'}
                this.dialogSysTodoConfigFormVisible = true
                this.isSysTodoConfigDisabled=false
            },
            //保存
            saveSysTodoConfigForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysTodoConfig',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysTodoConfig',
                        data:  _self.formSysTodoConfig
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysTodoConfig=response.data.result
                        _self.getListSysTodoConfig(1);
                    })
            },
            //删除数据
            deleteItemsSysTodoConfig() {
                let _self = this
                if (_self.multipleSelectionSysTodoConfig.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysTodoConfig);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysTodoConfig.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysTodoConfig',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysTodoConfig(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysTodoConfig(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysTodoConfig/'+ id
                    }
                ).then(function (response) {
                    _self.formSysTodoConfig = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysTodoConfig(isSysTodoConfigDisabled,rowData) {
                let _self=this
                this.isRowClickSysTodoConfig=true
                this.formSysTodoConfig = {}
                this.getOneSysTodoConfig(rowData.id).then(
                    function () {
                        _self.dialogSysTodoConfigFormVisible = true
                    }
                )
                this.isSysTodoConfigDisabled = isSysTodoConfigDisabled
            },
            handleSysTodoConfigSelectionChange(val) {
                this.multipleSelectionSysTodoConfig = val;
            },
            //获取列表
            getListSysTodoConfig(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysTodoConfigForm)//拼接查询条件
                _self.defaultSearchSysTodoConfig.params.filter = filter
                _self.defaultSearchSysTodoConfig.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysTodoConfig',
                        params: _self.defaultSearchSysTodoConfig.params
                    }
                ).then(function (response) {
                    _self.tableSysTodoConfig.tableData = response.data.result.records
                    _self.tableSysTodoConfig.total = response.data.result.total
                    _self.tableSysTodoConfig.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysTodoConfig, _self.dictsSysTodoConfig)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysTodoConfig(1)
        },
        watch:{
            multipleSelectionSysTodoConfig(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


