<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysTypegroupForm" class="clear">

                <el-form-item class="w25" label="下拉代码">
                    <el-input v-model="searchSysTypegroupForm.typegroupcode" placeholder="下拉代码"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="下拉名称">
                    <el-input v-model="searchSysTypegroupForm.typegroupname" placeholder="下拉名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="模块代码">
              <el-select v-model="searchSysTypegroupForm.busiType" placeholder="请选择" :clearable="true">
                <el-option
                  v-for="item in dictsSysTypegroup.busiType"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
                </el-form-item>

                <el-form-item class="w25" label="下拉类型">
              <el-select v-model="searchSysTypegroupForm.dropType" placeholder="请选择" :clearable="true">
                <el-option
                  v-for="item in dictsSysTypegroup.dropType"
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
                        <el-button @click="goAddSysTypegroup" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysTypegroup" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysTypegroup(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysTypegroupSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysTypegroup" @row-click="rowClickSysTypegroup" :data="tableSysTypegroup.tableData" :height="tableHeight"
                      @selection-change="handleSysTypegroupSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysTypegroup.curPageNum,defaultSearchSysTypegroup.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysTypegroup(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysTypegroup(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="typegroupcode" label="下拉代码"   width="220"></el-table-column>

                <el-table-column prop="typegroupname" label="下拉名称"   width="120"></el-table-column>

                <el-table-column prop="busiTypeLabel" label="模块代码"   width="120"></el-table-column>

                <el-table-column prop="dropTypeLabel" label="下拉类型"   width="120"></el-table-column>

                <el-table-column prop="dropSql" label="下拉sql"   width="250"></el-table-column>

                <el-table-column prop="remark" label="备注"   width="120"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysTypegroupSizeChange"
                    @current-change="handleSysTypegroupCurrentChange"
                    :current-page="tableSysTypegroup.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysTypegroup.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysTypegroup.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysTypegroupTitle"  width="80%" top="2Vh" :visible.sync="dialogSysTypegroupFormVisible" v-if="dialogSysTypegroupFormVisible" >
                <el-tabs  v-model="activeName">
                 <el-tab-pane label="基本信息" name="first">
                <el-form :rules="formSysTypegroupRules" ref="formSysTypegroup" :model="formSysTypegroup" :disabled=isSysTypegroupDisabled class="clear dialog-form"  label-width="100px" style="height: 474px">

                    <el-form-item verify  class="w25" prop="typegroupcode" label="下拉代码">
                        <el-input  v-model="formSysTypegroup.typegroupcode" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify class="w25" prop="typegroupname" label="下拉名称">
                        <el-input  v-model="formSysTypegroup.typegroupname" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="busiType" label="业务模块代码">
                        <el-select v-model="formSysTypegroup.busiType" placeholder="请选择">
                            <el-option
                                    v-for="item in dictsSysTypegroup.busiType"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item verify class="w25" prop="dropType" label="下拉类型">
                        <el-select v-model="formSysTypegroup.dropType" placeholder="请选择">
                            <el-option
                                    v-for="item in dictsSysTypegroup.dropType"
                                    :key="item.value"
                                    :label="item.text"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                       <el-form-item  class="w100" prop="dropSql" label="下拉sql需要格式" label-width="120px">
                          <el-input type="textarea" v-model="formSysTypegroup.dropSql" autocomplete="off"></el-input>
                      </el-form-item>

                    <el-form-item  class="w100" prop="remark" label="备注" label-width="120px">
                        <el-input type="textarea" v-model="formSysTypegroup.remark" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
			<div class="map-search-handel">
                    <el-button @click="dialogSysTypegroupFormVisible = false">关 闭</el-button>
              <el-button type="primary" @click="saveSysTypegroupForm" v-if="isShowSave">保 存</el-button>
                </div>
                    </el-tab-pane>
                    <el-tab-pane label="数据字典下拉项" name="second"  >
                        <!--主子表注释 引入子表组件-->
                        <SysType :sjzdxlid="formSysTypegroup.id"  :isShowbtn="isShowbtn"  ></SysType>
                        <div class="map-search-handel">
                            <el-button @click="dialogSysTypegroupFormVisible = false">关 闭</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: liukp
     * Date: Mon Nov 25 2019 17:37:16 GMT+0800 (GMT+08:00)
     * 01下拉定义表
     */
    import SysType from "@/views/sys/pub/SysType";
    export default {
        name: "SysTypegroup",
        components:{SysType},//子表
        data() {
            return {
                formSysTypegroupTitle: "01下拉定义表",
                activeName: "first",//tabs默认选项值
              isShowSave:true,//主表是否显示保存按钮
                dialogSysTypegroupFormVisible: false,//弹窗是否显示
                formSysTypegroup: {},//表单数据
                formSysTypegroupRules: {},//校验字段以及规则
              isShowbtn:true,//控制查看时按钮是否显示
                tableSysTypegroup: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysTypegroupDisabled: false,
                multipleSelectionSysTypegroup: [],//多选时已选择的数据
                searchSysTypegroupForm: {},
                defaultSearchSysTypegroup: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysTypegroup:{},
                isRowClickSysTypegroup:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickSysTypegroup:function(row){
                if (!this.isRowClickSysTypegroup){
                    this.$refs.tableSysTypegroup.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysTypegroup=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysTypegroupSearch() {
                this.searchSysTypegroupForm = {}
                delete this.defaultSearchSysTypegroup.params.filter//移除对象的某个属性
                this.getListSysTypegroup(1)
            },
            //切换每页页数
            handleSysTypegroupSizeChange(val) {
                this.defaultSearchSysTypegroup.params.pageSize = val
                this.getListSysTypegroup(1)
            },
            //切换当前页码
            handleSysTypegroupCurrentChange(val) {
                this.getListSysTypegroup(val)
            },
            //打开新增
            goAddSysTypegroup() {
                this.formSysTypegroup = {}
                this.dialogSysTypegroupFormVisible = true
                this.isSysTypegroupDisabled=false
                this.activeName= "first"
                this.formSysTypegroupTitle="新增数据字典";
                this.isShowSave=true; //不加这句的话，在点击“查看”后，再点“新增”的话，就不会显示“保存”按钮。
            },
            //保存
            saveSysTypegroupForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysTypegroup',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysTypegroup',
                        data:  _self.formSysTypegroup
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysTypegroup=response.data.result
                        _self.getListSysTypegroup(1);
                    })
            },
            //删除数据
            deleteItemsSysTypegroup() {
                let _self = this
                if (_self.multipleSelectionSysTypegroup.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysTypegroup);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysTypegroup.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysTypegroup',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysTypegroup(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysTypegroup(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysTypegroup/'+ id
                    }
                ).then(function (response) {
                    _self.formSysTypegroup = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysTypegroup(isSysTypegroupDisabled,rowData) {
                let _self=this
                this.isRowClickSysTypegroup=true
                this.formSysTypegroup = {}
                this.getOneSysTypegroup(rowData.id).then(


                    function () {
                        _self.dialogSysTypegroupFormVisible = true
                    }
                )
              if(isSysTypegroupDisabled){
               this.isShowbtn = false //子表是否显示保存按钮
                this.formSysTypegroupTitle="查看数据字典";
              this.isShowSave=false
              }else {
               this.isShowbtn = true //子表是否显示保存按钮
                this.formSysTypegroupTitle="编辑数据字典";
               this.isShowSave=true
              }
                this.activeName= "first"
                this.isSysTypegroupDisabled = isSysTypegroupDisabled
            },
            handleSysTypegroupSelectionChange(val) {
                this.multipleSelectionSysTypegroup = val;
            },
            //获取列表
            getListSysTypegroup(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysTypegroupForm)//拼接查询条件
                _self.defaultSearchSysTypegroup.params.filter = filter
                _self.defaultSearchSysTypegroup.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysTypegroup',
                        params: _self.defaultSearchSysTypegroup.params
                    }
                ).then(function (response) {
                    _self.tableSysTypegroup.tableData = response.data.result.records
                    _self.tableSysTypegroup.total = response.data.result.total
                    _self.tableSysTypegroup.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysTypegroup, _self.dictsSysTypegroup)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysTypegroup(1)
        },
        watch:{
            multipleSelectionSysTypegroup(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


