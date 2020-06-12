<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysAppHistoryForm" class="clear">

                <el-form-item class="w25" label="版本号（字符串：例如1.0.0）" label-width="200px">
                    <el-input  v-model="searchSysAppHistoryForm.version" :maxlength="10"  autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="版本说明">
                    <el-input v-model="searchSysAppHistoryForm.releaseNotes" placeholder="版本说明"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="是否必须更新">
                    <el-select v-model="searchSysAppHistoryForm.sfbxgx" placeholder="请选择" :clearable="true">
                        <el-option
                                v-for="item in dictsSysAppHistory.sfbxgx"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysAppHistory" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysAppHistory" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysAppHistory(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysAppHistorySearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysAppHistory" @row-click="rowClickSysAppHistory" :data="tableSysAppHistory.tableData" :height="tableHeight"
                      @selection-change="handleSysAppHistorySelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysAppHistory.curPageNum,defaultSearchSysAppHistory.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysAppHistory(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysAppHistory(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="version" label="版本号"  width="90"></el-table-column>

                <el-table-column prop="releaseNotes" label="版本说明"   width="180"></el-table-column>

                <el-table-column prop="checkCode" label="校验码"   width="280"></el-table-column>

                <el-table-column prop="sfbxgxLabel" label="是否必须更新" align="center"  width="110"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysAppHistorySizeChange"
                    @current-change="handleSysAppHistoryCurrentChange"
                    :current-page="tableSysAppHistory.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysAppHistory.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysAppHistory.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysAppHistoryTitle"  width="40%" top="10Vh"  :visible.sync="dialogSysAppHistoryFormVisible" :before-close="handleClose"><!--关闭时的回调-->
                <el-form :rules="formSysAppHistoryRules" ref="formSysAppHistory" :model="formSysAppHistory" :disabled=isSysAppHistoryDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w100" prop="version" label="版本号（字符串：例如1.0.0）"  label-width="200px">
                      <el-input  v-model="formSysAppHistory.version" :maxlength="10"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w100" prop="sfbxgx" label="是否必须更新" >
                      <el-select v-model="formSysAppHistory.sfbxgx" placeholder="请选择" :clearable="true">
                        <el-option
                          v-for="item in dictsSysAppHistory.sfbxgx"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item   class="w100" prop="releaseNotes" label="版本说明" >
                        <el-input  v-model="formSysAppHistory.releaseNotes" :maxlength="100" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item label="安装包" class="w100" label-width="100px" >
                      <!--暂时先不限制文件上传类型 2019-10-17 10:38:40 wht :accept-type="constant.common.IMAGE+constant.common.PDF"-->
                      <sys-attach-show-num
                        :acceptType="constant.common.APK"
                        :action="fjEdit" :busiId="formSysAppHistory.fjid"
                        busiType="xtglappsjwh" numType="S" v-if="isSysAttachShowNum"><!-- xtglappsjwh：系统管理/APP升级维护 -->
                      </sys-attach-show-num>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                  <!--因为可能会更新安装包但没点保存（实际校验码变了），所以点击“关闭”时，需要刷新列表-->
                    <el-button @click="dialogSysAppHistoryFormVisible = false
                    getListSysAppHistory(1);">关 闭</el-button>
                    <el-button type="primary" @click="saveSysAppHistoryForm" v-if="!isSysAppHistoryDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * app升级基础表
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    import SysAttachShowNum from "@/views/common/SysAttachShowNum";//附件上传
    export default {
        name: "SysAppHistory",
        components:{SysAttachShowNum},
        data() {
            return {
                formSysAppHistoryTitle: "APP升级维护",
                dialogSysAppHistoryFormVisible: false,//弹窗是否显示
                formSysAppHistory: {},//表单数据
                formSysAppHistoryRules: {},//校验字段以及规则
                tableSysAppHistory: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysAppHistoryDisabled: false,
                multipleSelectionSysAppHistory: [],//多选时已选择的数据
                searchSysAppHistoryForm: {},
                defaultSearchSysAppHistory: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysAppHistory:{},
                isRowClickSysAppHistory:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                fjEdit:'view',
                fjid:'',
              isSysAttachShowNum:false,
            }
        },
        methods: {
            //关闭前的回调
            handleClose(){
                let _self = this;
                _self.dialogSysAppHistoryFormVisible = false;
                _self.getListSysAppHistory(1);
            },
            //table单击行事件
            rowClickSysAppHistory:function(row){
                if (!this.isRowClickSysAppHistory){
                    this.$refs.tableSysAppHistory.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysAppHistory=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysAppHistorySearch() {
                this.searchSysAppHistoryForm = {}
                delete this.defaultSearchSysAppHistory.params.filter//移除对象的某个属性
                this.getListSysAppHistory(1)
            },
            //切换每页页数
            handleSysAppHistorySizeChange(val) {
                this.defaultSearchSysAppHistory.params.pageSize = val
                this.getListSysAppHistory(1)
            },
            //切换当前页码
            handleSysAppHistoryCurrentChange(val) {
                this.getListSysAppHistory(val)
            },
            //打开新增
            goAddSysAppHistory() {
                this.formSysAppHistory = {}

                this.fjEdit='view'//新增时不允许上传附件，否则生成的checkCode(MD5)无法保存到sysAppHistory中
                this.isSysAttachShowNum=true
                this.formSysAppHistory.fjid=this.commonUtils.uuid();
                this.dialogSysAppHistoryFormVisible = true
                this.isSysAppHistoryDisabled=false
            },
            //保存
            saveSysAppHistoryForm() {
                let _self = this
                this.isSysAttachShowNum=false
                if (!_self.commonUtils.checkForm('formSysAppHistory',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysAppHistory',
                        data:  _self.formSysAppHistory
                    }
                )
                    .then((response) => {
                      //保存后自动将后台信息填充到表单
                      _self.formSysAppHistory=response.data.result
                      _self.fjEdit='edit';
                      _self.isSysAttachShowNum=true
                      _self.dialogSysAppHistoryFormVisible = true;
                      _self.getListSysAppHistory(1);
                    })
            },
            //删除数据
            deleteItemsSysAppHistory() {
                let _self = this
                if (_self.multipleSelectionSysAppHistory.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysAppHistory);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysAppHistory.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysAppHistory',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysAppHistory(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysAppHistory(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysAppHistory/'+ id
                    }
                ).then(function (response) {
                    _self.formSysAppHistory = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysAppHistory(isSysAppHistoryDisabled,rowData) {
                let _self=this
                this.isRowClickSysAppHistory=true
                this.formSysAppHistory = {}
                this.getOneSysAppHistory(rowData.id).then(
                    function () {
                        _self.dialogSysAppHistoryFormVisible = true
                    }
                )
              if(isSysAppHistoryDisabled){
                _self.fjEdit='view';
              }else{
                _self.fjEdit='edit';
              }
                this.isSysAttachShowNum=true
                this.isSysAppHistoryDisabled = isSysAppHistoryDisabled
            },
            handleSysAppHistorySelectionChange(val) {
                this.multipleSelectionSysAppHistory = val;
            },
            //获取列表
            getListSysAppHistory(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysAppHistoryForm)//拼接查询条件
                _self.defaultSearchSysAppHistory.params.filter = filter
                _self.defaultSearchSysAppHistory.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysAppHistory',
                        params: _self.defaultSearchSysAppHistory.params
                    }
                ).then(function (response) {
                    _self.tableSysAppHistory.tableData = response.data.result.records
                    _self.tableSysAppHistory.total = response.data.result.total
                    _self.tableSysAppHistory.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysAppHistory, _self.dictsSysAppHistory)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysAppHistory(1)
        },
        watch:{
            multipleSelectionSysAppHistory(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


