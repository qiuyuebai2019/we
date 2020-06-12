<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysLogForm" class="clear">

              <el-form-item class="w25" label="事件类型">
                <el-select v-model="searchSysLogForm.logtype" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="item in dictsSysLog.logtype"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>


              <el-form-item class="w25" label="日志级别">
                <el-select v-model="searchSysLogForm.loglevel" placeholder="请选择" :clearable="true">
                  <el-option
                    v-for="item in dictsSysLog.loglevel"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
                <el-form-item label="操作日期" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysLogForm.operatedatetime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>


                <el-form-item class="w25" label="操作类型">
                    <el-select v-model="searchSysLogForm.operatetype" placeholder="请选择" :clearable="true">
                        <el-option
                                v-for="item in dictsSysLog.operatetype"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="w25" label="操作结果">
                    <el-select v-model="searchSysLogForm.operateresult" placeholder="请选择" :clearable="true">
                        <el-option
                                v-for="item in dictsSysLog.operateresult"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="w25" label="模块名称">
                    <el-input v-model="searchSysLogForm.module" placeholder="模块名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="菜单名称">
                    <el-input v-model="searchSysLogForm.menuname" placeholder="菜单名称"></el-input>
                </el-form-item>
            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysLog(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysLogSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysLog" @row-click="rowClickSysLog" :data="tableSysLog.tableData" :height="tableHeight"
                      @selection-change="handleSysLogSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysLog.curPageNum,defaultSearchSysLog.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysLog(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

          <!--      <el-table-column prop="broswer" label="浏览器和版本等信息"   width="120"></el-table-column>

                <el-table-column prop="logcontent" label="日志内容，文字、sql 或者hql信息 要拼接参数、接口接收或者发送的信息   安全测评需要"   width="120"></el-table-column>
-->
                <el-table-column prop="logtypeLabel" label="事件类型" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="loglevelLabel" label="日志级别" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="operatedatetime" label="操作日期" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

<!--                <el-table-column prop="operatetime" label="操作时间存时时:分分:秒秒02:23:23 安全测评需要"   width="120"></el-table-column>-->

                <el-table-column prop="operatetypeLabel" label="操作类型" align="center"  width="90"></el-table-column>

<!--                <el-table-column prop="operateobject" label="操作对象 存实体类名"   width="120"></el-table-column>-->

                <el-table-column prop="operateresultLabel" label="操作结果" align="center"  width="90"></el-table-column>

                <el-table-column prop="usermac" label="操作人mac地址 "   width="120"></el-table-column>

                <el-table-column prop="userip" label="操作人ip" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

<!--                <el-table-column prop="username" label="操作人账号"   width="120"></el-table-column>-->

                <el-table-column prop="realname" label="操作人账号"   width="120"></el-table-column>

                <el-table-column prop="module" label="模块名称"   width="120"></el-table-column>

                <el-table-column prop="menuname" label="菜单名称"   width="120"></el-table-column>

                <el-table-column prop="functionname" label="功能操作 方法名"   width="120"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysLogSizeChange"
                    @current-change="handleSysLogCurrentChange"
                    :current-page="tableSysLog.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysLog.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysLog.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysLogTitle"  width="80%" top="10Vh"  :visible.sync="dialogSysLogFormVisible">
                <el-form :rules="formSysLogRules" ref="formSysLog" :model="formSysLog" :disabled=isSysLogDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w25" prop="broswer" label="浏览器信息">
                        <el-input  v-model="formSysLog.broswer" :maxlength="60"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="logcontent" label="日志内容">
                        <el-input  v-model="formSysLog.logcontent"   autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="operatetype" label="事件类型" >
                      <el-select v-model="formSysLog.logtype" placeholder="请选择">
                        <el-option
                          v-for="item in dictsSysLog.logtype"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item  class="w25" prop="operatetype" label="日志级别" >
                      <el-select v-model="formSysLog.loglevel" placeholder="请选择">
                        <el-option
                          v-for="item in dictsSysLog.loglevel"
                          :key="item.value"
                          :label="item.text"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item  class="w25" prop="operatedatetime" label="操作日期" >
                        <el-date-picker
                                v-model="formSysLog.operatedatetime"
                                type="date" style="width:100%" :editable="false"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item  class="w25" prop="operatetime" label="操作时间">
                        <el-input  v-model="formSysLog.operatetime"   autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="operatetype" label="操作类型" >
                        <el-select v-model="formSysLog.operatetype" placeholder="请选择">
                            <el-option
                                v-for="item in dictsSysLog.operatetype"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="operateobject" label="操作对象">
                        <el-input  v-model="formSysLog.operateobject" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="operateresult" label="操作结果" >
                        <el-select v-model="formSysLog.operateresult" placeholder="请选择">
                            <el-option
                                v-for="item in dictsSysLog.operateresult"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="usermac" label="操作人mac">
                        <el-input  v-model="formSysLog.usermac" :maxlength="30"  autocomplete="off"></el-input>
                    </el-form-item>

                  <el-form-item  class="w25" prop="userip" label="操作人ip">
                    <el-input  v-model="formSysLog.userip" :maxlength="46" autocomplete="off"></el-input>
                  </el-form-item>

                    <el-form-item  class="w25" prop="username" label="操作人账号">
                        <el-input  v-model="formSysLog.username" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="realname" label="操作人账号">
                        <el-input  v-model="formSysLog.realname" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="module" label="模块名称">
                        <el-input  v-model="formSysLog.module" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="menuname" label="菜单名称">
                        <el-input  v-model="formSysLog.menuname" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="functionname" label="功能操作">
                        <el-input  v-model="formSysLog.functionname" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysLogFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysLogForm" v-if="!isSysLogDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: yangzekai
     * Date: Fri Dec 13 2019 16:12:00 GMT+0800 (GMT+08:00)
     * 09操作日志表
     */
    export default {
        name: "SysLog",
        data() {
            return {
                formSysLogTitle: "操作日志表",
                dialogSysLogFormVisible: false,//弹窗是否显示
                formSysLog: {},//表单数据
                formSysLogRules: {},//校验字段以及规则
                tableSysLog: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysLogDisabled: false,
                multipleSelectionSysLog: [],//多选时已选择的数据
                searchSysLogForm: {},
                defaultSearchSysLog: {
                    params: { page: 1, pageSize: 20,sorter:"operatetime=desc"}
                },
                dictsSysLog:{},
                isRowClickSysLog:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickSysLog:function(row){
                if (!this.isRowClickSysLog){
                    this.$refs.tableSysLog.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysLog=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysLogSearch() {
                this.searchSysLogForm = {}
                delete this.defaultSearchSysLog.params.filter//移除对象的某个属性
                this.getListSysLog(1)
            },
            //切换每页页数
            handleSysLogSizeChange(val) {
                this.defaultSearchSysLog.params.pageSize = val
                this.getListSysLog(1)
            },
            //切换当前页码
            handleSysLogCurrentChange(val) {
                this.getListSysLog(val)
            },
            //打开新增
            goAddSysLog() {
                this.formSysLog = {}
                this.dialogSysLogFormVisible = true
                this.isSysLogDisabled=false
            },
            //保存
            saveSysLogForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysLog',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysLog',
                        data:  _self.formSysLog
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysLog=response.data.result
                        _self.getListSysLog(1);
                    })
            },
            //删除数据
            deleteItemsSysLog() {
                let _self = this
                if (_self.multipleSelectionSysLog.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysLog);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysLog.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysLog',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysLog(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysLog(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysLog/'+ id
                    }
                ).then(function (response) {
                    _self.formSysLog = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysLog(isSysLogDisabled,rowData) {
                let _self=this
                this.isRowClickSysLog=true
                this.formSysLog = {}
                this.getOneSysLog(rowData.id).then(
                    function () {
                        _self.dialogSysLogFormVisible = true
                    }
                )
                this.isSysLogDisabled = isSysLogDisabled
            },
            handleSysLogSelectionChange(val) {
                this.multipleSelectionSysLog = val;
            },
            //获取列表
            getListSysLog(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysLogForm)//拼接查询条件
                _self.defaultSearchSysLog.params.filter = filter
                _self.defaultSearchSysLog.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysLog',
                        params: _self.defaultSearchSysLog.params
                    }
                ).then(function (response) {
                    _self.tableSysLog.tableData = response.data.result.records
                    _self.tableSysLog.total = response.data.result.total
                    _self.tableSysLog.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysLog, _self.dictsSysLog)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysLog(1)
        },
        watch:{
            multipleSelectionSysLog(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


