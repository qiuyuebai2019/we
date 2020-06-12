<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchBqJcbjLogForm" class="clear">

                <el-form-item class="w25" label="设备ID">
                    <el-input v-model="searchBqJcbjLogForm.rfid" placeholder="设备ID"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="感知信息">
                    <!--<el-input v-model="searchBqJcbjLogForm.gzxx" placeholder="感知信息"></el-input>-->
                  <el-select v-model="searchBqJcbjLogForm.gzxx" placeholder="请选择" :clearable="true">
                    <el-option
                      v-for="item in dictsBqJcbjLog.gzxx"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="w25" label="数值">
                    <el-input v-model="searchBqJcbjLogForm.gzxsz" placeholder="数值"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchBqJcbjLogForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <!--<el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddBqJcbjLog" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsBqJcbjLog" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>-->
                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListBqJcbjLog(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertBqJcbjLogSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableBqJcbjLog" @row-click="rowClickBqJcbjLog" :data="tableBqJcbjLog.tableData" :height="tableHeight"
                      @selection-change="handleBqJcbjLogSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableBqJcbjLog.curPageNum,defaultSearchBqJcbjLog.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <!--<el-button type="text" @click="goUpdateBqJcbjLog(false,scope.row)">编辑</el-button>-->
                        <el-button type="text" @click="goUpdateBqJcbjLog(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="rfid" label="设备ID" align="center"  width="200"></el-table-column>

                <el-table-column prop="gzxxLabel" label="感知信息" align="center" :formatter="commonUtils.formatMoney" width="100"></el-table-column>

                <el-table-column prop="gzxsz" label="数值" align="right"  width="100"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="160"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleBqJcbjLogSizeChange"
                    @current-change="handleBqJcbjLogCurrentChange"
                    :current-page="tableBqJcbjLog.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchBqJcbjLog.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableBqJcbjLog.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formBqJcbjLogTitle"  width="80%" top="10Vh"  :visible.sync="dialogBqJcbjLogFormVisible">
                <el-form :rules="formBqJcbjLogRules" ref="formBqJcbjLog" :model="formBqJcbjLog" :disabled=isBqJcbjLogDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w25" prop="rfid" label="设备ID">
                        <el-input  v-model="formBqJcbjLog.rfid" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  verify can-be-empty  class="w25" prop="gzxx" label="感知信息" int>
                       <!-- <el-input v-model="formBqJcbjLog.gzxx" autocomplete="off"></el-input>-->
                      <el-select v-model="formBqJcbjLog.gzxx" placeholder="请选择">
                        <el-option
                          v-for="item in dictsBqJcbjLog.gzxx"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gzxsz" label="数值">
                        <el-input  v-model="formBqJcbjLog.gzxsz" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogBqJcbjLogFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveBqJcbjLogForm" v-if="!isBqJcbjLogDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * 自动解除报警日志
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    export default {
        name: "BqJcbjLog",
        data() {
            return {
                formBqJcbjLogTitle: "自动解除报警日志",
                dialogBqJcbjLogFormVisible: false,//弹窗是否显示
                formBqJcbjLog: {},//表单数据
                formBqJcbjLogRules: {},//校验字段以及规则
                tableBqJcbjLog: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isBqJcbjLogDisabled: false,
                multipleSelectionBqJcbjLog: [],//多选时已选择的数据
                searchBqJcbjLogForm: {},
                defaultSearchBqJcbjLog: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsBqJcbjLog:{},
                isRowClickBqJcbjLog:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickBqJcbjLog:function(row){
                if (!this.isRowClickBqJcbjLog){
                    this.$refs.tableBqJcbjLog.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickBqJcbjLog=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertBqJcbjLogSearch() {
                this.searchBqJcbjLogForm = {}
                delete this.defaultSearchBqJcbjLog.params.filter//移除对象的某个属性
                this.getListBqJcbjLog(1)
            },
            //切换每页页数
            handleBqJcbjLogSizeChange(val) {
                this.defaultSearchBqJcbjLog.params.pageSize = val
                this.getListBqJcbjLog(1)
            },
            //切换当前页码
            handleBqJcbjLogCurrentChange(val) {
                this.getListBqJcbjLog(val)
            },
            //打开新增
            goAddBqJcbjLog() {
                this.formBqJcbjLog = {}
                this.dialogBqJcbjLogFormVisible = true
                this.isBqJcbjLogDisabled=false
            },
            //保存
            saveBqJcbjLogForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formBqJcbjLog',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'bqJcbjLog',
                        data:  _self.formBqJcbjLog
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formBqJcbjLog=response.data.result
                        _self.getListBqJcbjLog(1);
                    })
            },
            //删除数据
            deleteItemsBqJcbjLog() {
                let _self = this
                if (_self.multipleSelectionBqJcbjLog.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqJcbjLog);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionBqJcbjLog.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'bqJcbjLog',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListBqJcbjLog(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneBqJcbjLog(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'bqJcbjLog/'+ id
                    }
                ).then(function (response) {
                    _self.formBqJcbjLog = response.data.result
                })
            },
            //修改或者查看页
            goUpdateBqJcbjLog(isBqJcbjLogDisabled,rowData) {
                let _self=this
                this.isRowClickBqJcbjLog=true
                this.formBqJcbjLog = {}
                this.getOneBqJcbjLog(rowData.id).then(
                    function () {
                        _self.dialogBqJcbjLogFormVisible = true
                    }
                )
                this.isBqJcbjLogDisabled = isBqJcbjLogDisabled
            },
            handleBqJcbjLogSelectionChange(val) {
                this.multipleSelectionBqJcbjLog = val;
            },
            //获取列表
            getListBqJcbjLog(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchBqJcbjLogForm)//拼接查询条件
                _self.defaultSearchBqJcbjLog.params.filter = filter
                _self.defaultSearchBqJcbjLog.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'bqJcbjLog',
                        params: _self.defaultSearchBqJcbjLog.params
                    }
                ).then(function (response) {
                    _self.tableBqJcbjLog.tableData = response.data.result.records
                    _self.tableBqJcbjLog.total = response.data.result.total
                    _self.tableBqJcbjLog.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableBqJcbjLog, _self.dictsBqJcbjLog)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListBqJcbjLog(1)
        },
        watch:{
            multipleSelectionBqJcbjLog(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


