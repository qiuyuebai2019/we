<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchBqReceiveLogForm" class="clear">

                <el-form-item class="w25" label="设备ID">
                  <el-input v-model="searchBqReceiveLogForm.rfid" placeholder="设备ID"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="类型">
                  <el-select v-model="searchBqReceiveLogForm.type" placeholder="请选择" :clearable="true">
                    <el-option
                      v-for="item in dictsBqReceiveLog.type"
                      :key="item.value"
                      :label="item.text"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>


                <el-form-item class="w25" label="是否成功">
                  <el-select v-model="searchBqReceiveLogForm.isSuccess" placeholder="请选择" :clearable="true">
                    <el-option
                      v-for="item in dictsBqReceiveLog.isSuccess"
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
                <!--<el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddBqReceiveLog" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsBqReceiveLog" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>-->
                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListBqReceiveLog(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertBqReceiveLogSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableBqReceiveLog" @row-click="rowClickBqReceiveLog" :data="tableBqReceiveLog.tableData" :height="tableHeight"
                      @selection-change="handleBqReceiveLogSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableBqReceiveLog.curPageNum,defaultSearchBqReceiveLog.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <!--<el-button type="text" @click="goUpdateBqReceiveLog(false,scope.row)">编辑</el-button>-->
                        <el-button type="text" @click="goUpdateBqReceiveLog(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="typeLabel" label="类型" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>
                <el-table-column prop="rfid" label="设备ID" width="200"></el-table-column>
                <el-table-column prop="isSuccessLabel" label="是否成功" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>
                <el-table-column prop="payload" label="消息内容"   width="200"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleBqReceiveLogSizeChange"
                    @current-change="handleBqReceiveLogCurrentChange"
                    :current-page="tableBqReceiveLog.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchBqReceiveLog.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableBqReceiveLog.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formBqReceiveLogTitle"  width="40%" top="30Vh"  :visible.sync="dialogBqReceiveLogFormVisible">
                <el-form :rules="formBqReceiveLogRules" ref="formBqReceiveLog" :model="formBqReceiveLog" :disabled=isBqReceiveLogDisabled class="clear dialog-form"  label-width="100px">

                  <el-form-item class="w50" prop="type" label="类型">
                    <el-select v-model="formBqReceiveLog.type" placeholder="请选择">
                      <el-option
                        v-for="item in dictsBqReceiveLog.type"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item class="w50" prop="isSuccess" label="是否成功">
                    <el-select v-model="formBqReceiveLog.isSuccess" placeholder="请选择">
                      <el-option
                        v-for="item in dictsBqReceiveLog.isSuccess"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>

                    <el-form-item   class="w100" prop="payload" label="消息内容" >
                        <el-input  v-model="formBqReceiveLog.payload" :maxlength="10000" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogBqReceiveLogFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveBqReceiveLogForm" v-if="!isBqReceiveLogDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * 标签数据接收日志
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    export default {
        name: "BqReceiveLog",
        data() {
            return {
                formBqReceiveLogTitle: "标签数据接收日志",
                dialogBqReceiveLogFormVisible: false,//弹窗是否显示
                formBqReceiveLog: {},//表单数据
                formBqReceiveLogRules: {},//校验字段以及规则
                tableBqReceiveLog: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isBqReceiveLogDisabled: false,
                multipleSelectionBqReceiveLog: [],//多选时已选择的数据
                searchBqReceiveLogForm: {},
                defaultSearchBqReceiveLog: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsBqReceiveLog:{},
                isRowClickBqReceiveLog:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickBqReceiveLog:function(row){
                if (!this.isRowClickBqReceiveLog){
                    this.$refs.tableBqReceiveLog.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickBqReceiveLog=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertBqReceiveLogSearch() {
                this.searchBqReceiveLogForm = {}
                delete this.defaultSearchBqReceiveLog.params.filter//移除对象的某个属性
                this.getListBqReceiveLog(1)
            },
            //切换每页页数
            handleBqReceiveLogSizeChange(val) {
                this.defaultSearchBqReceiveLog.params.pageSize = val
                this.getListBqReceiveLog(1)
            },
            //切换当前页码
            handleBqReceiveLogCurrentChange(val) {
                this.getListBqReceiveLog(val)
            },
            //打开新增
            goAddBqReceiveLog() {
                this.formBqReceiveLog = {}
                this.dialogBqReceiveLogFormVisible = true
                this.isBqReceiveLogDisabled=false
            },
            //保存
            saveBqReceiveLogForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formBqReceiveLog',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'bqReceiveLog',
                        data:  _self.formBqReceiveLog
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formBqReceiveLog=response.data.result
                        _self.getListBqReceiveLog(1);
                    })
            },
            //删除数据
            deleteItemsBqReceiveLog() {
                let _self = this
                if (_self.multipleSelectionBqReceiveLog.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqReceiveLog);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionBqReceiveLog.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'bqReceiveLog',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListBqReceiveLog(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneBqReceiveLog(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'bqReceiveLog/'+ id
                    }
                ).then(function (response) {
                    _self.formBqReceiveLog = response.data.result
                })
            },
            //修改或者查看页
            goUpdateBqReceiveLog(isBqReceiveLogDisabled,rowData) {
                let _self=this
                this.isRowClickBqReceiveLog=true
                this.formBqReceiveLog = {}
                this.getOneBqReceiveLog(rowData.id).then(
                    function () {
                        _self.dialogBqReceiveLogFormVisible = true
                    }
                )
                this.isBqReceiveLogDisabled = isBqReceiveLogDisabled
            },
            handleBqReceiveLogSelectionChange(val) {
                this.multipleSelectionBqReceiveLog = val;
            },
            //获取列表
            getListBqReceiveLog(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchBqReceiveLogForm)//拼接查询条件
                _self.defaultSearchBqReceiveLog.params.filter = filter
                _self.defaultSearchBqReceiveLog.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'bqReceiveLog',
                        params: _self.defaultSearchBqReceiveLog.params
                    }
                ).then(function (response) {
                    _self.tableBqReceiveLog.tableData = response.data.result.records
                    _self.tableBqReceiveLog.total = response.data.result.total
                    _self.tableBqReceiveLog.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableBqReceiveLog, _self.dictsBqReceiveLog)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListBqReceiveLog(1)
        },
        watch:{
            multipleSelectionBqReceiveLog(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


