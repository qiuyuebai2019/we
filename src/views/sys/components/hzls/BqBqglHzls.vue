<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchBqBqglHzlsForm" class="clear">

                <el-form-item class="w25" label="设备ID">
                    <el-input v-model="searchBqBqglHzlsForm.rfid" placeholder="设备ID"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="资产名称">
                    <el-input v-model="searchBqBqglHzlsForm.zcmc" placeholder="资产名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="回执类型">
                    <el-select v-model="searchBqBqglHzlsForm.hzlx" placeholder="请选择">
                        <el-option
                                v-for="item in dictsBqBqglHzls.hzlx"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="回执时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchBqBqglHzlsForm.hzsj" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>

                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListBqBqglHzls(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertBqBqglHzlsSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableBqBqglHzls" @row-click="rowClickBqBqglHzls" :data="tableBqBqglHzls.tableData" :height="tableHeight"
                      @selection-change="handleBqBqglHzlsSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableBqBqglHzls.curPageNum,defaultSearchBqBqglHzls.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">

                        <el-button type="text" @click="goUpdateBqBqglHzls(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="rfid" label="设备ID"   width="200"></el-table-column>

                <el-table-column prop="zcmc" label="资产名称"   width="180"></el-table-column>

                <el-table-column prop="hzsj" label="回执时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

                <el-table-column prop="sbzq" label="上报周期（小时）" align="right" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="hzlxLabel" label="回执类型" align="center"  width="90"></el-table-column>

                <el-table-column prop="ywlxbm" label="业务类型编码"   width="120"></el-table-column>

                <el-table-column prop="ywlxmc" label="业务类型名称"   width="120"></el-table-column>

                <el-table-column prop="simId" label="SIM ID"   width="120"></el-table-column>

                <el-table-column prop="gjmsLabel" label="告警模式" align="center"  width="90"></el-table-column>

                <el-table-column prop="sbsj" label="上报时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

                <el-table-column prop="fwqipdz" label="服务器IP地址"   width="120"></el-table-column>

                <el-table-column prop="dkh" label="端口号" align="right" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="gwpmbm" label="PM编码"   width="120"></el-table-column>

                <el-table-column prop="sszz" label="所属组织"   width="120"></el-table-column>

                <el-table-column prop="bz" label="备注"   width="200"></el-table-column>

                <el-table-column prop="sfqyLabel" label="是否启用" align="center"  width="90"></el-table-column>

                <el-table-column prop="gszz" label="归属组织"   width="120"></el-table-column>

                <el-table-column prop="cxmc" label="程序名称"   width="120"></el-table-column>

                <el-table-column prop="bb" label="版本"   width="120"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleBqBqglHzlsSizeChange"
                    @current-change="handleBqBqglHzlsCurrentChange"
                    :current-page="tableBqBqglHzls.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchBqBqglHzls.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableBqBqglHzls.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formBqBqglHzlsTitle"  width="80%" top="10Vh"  :visible.sync="dialogBqBqglHzlsFormVisible">
                <el-form :rules="formBqBqglHzlsRules" ref="formBqBqglHzls" :model="formBqBqglHzls" :disabled=isBqBqglHzlsDisabled class="clear dialog-form"  label-width="130px">

                    <el-form-item  class="w25" prop="rfid" label="设备ID">
                        <el-input  v-model="formBqBqglHzls.rfid" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="zcmc" label="资产名称">
                        <el-input  v-model="formBqBqglHzls.zcmc" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="hzsj" label="回执时间" >
                        <el-date-picker
                                v-model="formBqBqglHzls.hzsj"
                                type="datetime" style="width:100%" :editable="false"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item  verify can-be-empty  class="w25" prop="sbzq" label="上报周期（小时）" int>
                        <el-input v-model="formBqBqglHzls.sbzq" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="ywlxid" label="业务类型id">
                        <el-input  v-model="formBqBqglHzls.ywlxid" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="hzlx" label="回执类型" >
                        <el-select v-model="formBqBqglHzls.hzlx" placeholder="请选择">
                            <el-option
                                v-for="item in dictsBqBqglHzls.hzlx"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="ywlxbm" label="业务类型编码">
                        <el-input  v-model="formBqBqglHzls.ywlxbm" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="ywlxmc" label="业务类型名称">
                        <el-input  v-model="formBqBqglHzls.ywlxmc" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="simId" label="SIM ID">
                        <el-input  v-model="formBqBqglHzls.simId" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="sbsj" label="上报时间" >
                        <el-date-picker
                                v-model="formBqBqglHzls.sbsj"
                                type="datetime" style="width:100%" :editable="false"
                        >
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gjms" label="告警模式" >
                        <el-select v-model="formBqBqglHzls.gjms" placeholder="请选择">
                            <el-option
                                v-for="item in dictsBqBqglHzls.gjms"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="fwqipdz" label="服务器IP地址">
                        <el-input  v-model="formBqBqglHzls.fwqipdz" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  verify can-be-empty  class="w25" prop="dkh" label="端口号" int>
                        <el-input v-model="formBqBqglHzls.dkh" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gwpmbm" label="PM编码">
                        <el-input  v-model="formBqBqglHzls.gwpmbm" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="sszzId" label="所属组织id">
                        <el-input  v-model="formBqBqglHzls.sszzId" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="sszz" label="所属组织">
                        <el-input  v-model="formBqBqglHzls.sszz" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="bz" label="备注" >
                        <el-input  v-model="formBqBqglHzls.bz" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="sfqy" label="是否启用" >
                        <el-select v-model="formBqBqglHzls.sfqy" placeholder="请选择">
                            <el-option
                                v-for="item in dictsBqBqglHzls.sfqy"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gszzId" label="归属组织id">
                        <el-input  v-model="formBqBqglHzls.gszzId" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gszz" label="归属组织">
                        <el-input  v-model="formBqBqglHzls.gszz" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="cxmc" label="程序名称">
                        <el-input  v-model="formBqBqglHzls.cxmc" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="bb" label="版本">
                        <el-input  v-model="formBqBqglHzls.bb" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogBqBqglHzlsFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveBqBqglHzlsForm" v-if="!isBqBqglHzlsDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: liubo
     * Date: Thu Dec 19 2019 10:46:02 GMT+0800 (GMT+08:00)
     * 回执历史
     */
    export default {
        name: "BqBqglHzls",
        props:["rfid"],
        data() {
            return {
                formBqBqglHzlsTitle: "回执历史",
                dialogBqBqglHzlsFormVisible: false,//弹窗是否显示
                formBqBqglHzls: {},//表单数据
                formBqBqglHzlsRules: {},//校验字段以及规则
                tableBqBqglHzls: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isBqBqglHzlsDisabled: false,
                multipleSelectionBqBqglHzls: [],//多选时已选择的数据
                searchBqBqglHzlsForm: {},
                defaultSearchBqBqglHzls: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsBqBqglHzls:{},
                isRowClickBqBqglHzls:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickBqBqglHzls:function(row){
                if (!this.isRowClickBqBqglHzls){
                    this.$refs.tableBqBqglHzls.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickBqBqglHzls=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertBqBqglHzlsSearch() {
                this.searchBqBqglHzlsForm = {}
                delete this.defaultSearchBqBqglHzls.params.filter//移除对象的某个属性
                this.getListBqBqglHzls(1)
            },
            //切换每页页数
            handleBqBqglHzlsSizeChange(val) {
                this.defaultSearchBqBqglHzls.params.pageSize = val
                this.getListBqBqglHzls(1)
            },
            //切换当前页码
            handleBqBqglHzlsCurrentChange(val) {
                this.getListBqBqglHzls(val)
            },

            //保存
            saveBqBqglHzlsForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formBqBqglHzls',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'bqBqglHzls',
                        data:  _self.formBqBqglHzls
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formBqBqglHzls=response.data.result
                        _self.getListBqBqglHzls(1);
                    })
            },

            //获取一条
            getOneBqBqglHzls(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'bqBqglHzls/'+ id
                    }
                ).then(function (response) {
                    _self.formBqBqglHzls = response.data.result
                })
            },

            handleBqBqglHzlsSelectionChange(val) {
                this.multipleSelectionBqBqglHzls = val;
            },
            //获取列表
            getListBqBqglHzls(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchBqBqglHzlsForm)//拼接查询条件
              if (_self.rfid==null||_self.rfid==''){
                filter += "&2=1"
              }else {
                filter += "&rfid="+_self.rfid
              }
                _self.defaultSearchBqBqglHzls.params.filter = filter
                _self.defaultSearchBqBqglHzls.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'bqBqglHzls',
                        params: _self.defaultSearchBqBqglHzls.params
                    }
                ).then(function (response) {
                    _self.tableBqBqglHzls.tableData = response.data.result.records
                    _self.tableBqBqglHzls.total = response.data.result.total
                    _self.tableBqBqglHzls.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableBqBqglHzls, _self.dictsBqBqglHzls)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListBqBqglHzls(1)
        },
        watch:{
            multipleSelectionBqBqglHzls(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


