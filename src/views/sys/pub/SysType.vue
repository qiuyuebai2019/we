<template>
  <div>

    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchSysTypeForm" class="clear">

        <el-form-item label="下拉项值">
          <el-input v-model="searchSysTypeForm.typecode" placeholder="下拉项值"></el-input>
        </el-form-item>

        <el-form-item label="下拉项显示文本">
          <el-input v-model="searchSysTypeForm.typename" placeholder="下拉项显示文本"></el-input>
        </el-form-item>

      </el-form>



    </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
            <el-button @click="goAddSysType" type="primary" icon="el-icon-plus" size="small" v-show="isShowbtn">新增</el-button>
            <el-button @click="deleteItemsSysType" type="primary" icon="el-icon-delete" size="small"  v-show="isShowbtn">删除</el-button>
                    </div>
                </el-col>
        <el-col :span="6" style="float: right">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysType(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysTypeSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysType" @row-click="rowClickSysType" :data="tableSysType.tableData" :height="350"
                      @selection-change="handleSysTypeSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysType.curPageNum,defaultSearchSysType.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center" >
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysType(false,scope.row)"   v-show="isShowbtn">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysType(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="typecode" label="下拉项值"   width="120"></el-table-column>

                <el-table-column prop="typename" label="下拉项显示文本"   width="120"></el-table-column>

                <el-table-column prop="filterCode" label="过滤code"   width="120"></el-table-column>

                <el-table-column prop="pxh" label="排序号"   width="120"></el-table-column>

                <el-table-column prop="remark" label="备注"   width="120"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysTypeSizeChange"
                    @current-change="handleSysTypeCurrentChange"
                    :current-page="tableSysType.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysType.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysType.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysTypeTitle"  width="80%" top="15Vh"  :visible.sync="dialogSysTypeFormVisible" append-to-body>
                <el-form :rules="formSysTypeRules" ref="formSysType" :model="formSysType" :disabled=isSysTypeDisabled class="clear dialog-form"  label-width="100px">

          <el-form-item verify class="w25" prop="typecode" label="下拉项值">
            <el-input  v-model="formSysType.typecode" autocomplete="off"></el-input>
                    </el-form-item>

          <el-form-item  class="w25" prop="typename" label="下拉项显示文本" label-width="150px">
                        <el-input  v-model="formSysType.typename" :maxlength="100"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="filterCode" label="过滤code">
                        <el-input  v-model="formSysType.filterCode" :maxlength="10"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="pxh" label="排序号">
                        <el-input  v-model="formSysType.pxh" :maxlength="4"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="remark" label="备注" >
                        <el-input  v-model="formSysType.remark" :maxlength="200" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysTypeFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveSysTypeForm" v-if="isShowSave" v-show="isShowbtn">保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: liukp
     * Date: Mon Nov 25 2019 17:56:17 GMT+0800 (GMT+08:00)
     * 02下拉项
     */
    export default {
        name: "SysType",
    props:['sjzdxlid','isShowbtn'],// isShowbtn打开子记录标签页时候是否显示 新增 删除 保存按钮
        data() {
            return {
                formSysTypeTitle: "数据字典下拉项",
                dialogSysTypeFormVisible: false,//弹窗是否显示
                isShowSave:true,//控制子表 查看时 按钮是否显示
                formSysType: {},//表单数据
                formSysTypeRules: {},//校验字段以及规则
                tableSysType: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysTypeDisabled: false,
                multipleSelectionSysType: [],//多选时已选择的数据
                searchSysTypeForm: {},
                defaultSearchSysType: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysType:{},
                isRowClickSysType:false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
            }
        },
        methods: {
            //table单击行事件
            rowClickSysType:function(row){
                if (!this.isRowClickSysType){
                    this.$refs.tableSysType.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysType=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysTypeSearch() {
                this.searchSysTypeForm = {}
                delete this.defaultSearchSysType.params.filter//移除对象的某个属性
                this.getListSysType(1)
            },
            //切换每页页数
            handleSysTypeSizeChange(val) {
                this.defaultSearchSysType.params.pageSize = val
                this.getListSysType(1)
            },
            //切换当前页码
            handleSysTypeCurrentChange(val) {
                this.getListSysType(val)
            },
            //打开新增
            goAddSysType() {
                this.formSysType = {}
                if(this.sjzdxlid!=null){
                  this.dialogSysTypeFormVisible = true
                  this.isSysTypeDisabled=false
                  this.formSysTypeTitle= "新增数据字典下拉项";
                }else {
                  this.commonUtils.message("请先保存基本信息");
                }
            },
            //保存
            saveSysTypeForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysType',_self)) {return false}//表单校验
        _self.formSysType.typegroupid=this.sjzdxlid
                _self.request.save(
                    {
                        url: 'sysType',
                        data:  _self.formSysType
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysType=response.data.result
                        _self.getListSysType(1);
                    })
            },
            //删除数据
            deleteItemsSysType() {
                let _self = this
                if (_self.multipleSelectionSysType.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysType);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysType.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysType',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysType(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysType(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysType/'+ id
                    }
                ).then(function (response) {
                    _self.formSysType = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysType(isSysTypeDisabled,rowData) {
                let _self=this
                this.isRowClickSysType=true
                this.formSysType = {}
                this.getOneSysType(rowData.id).then(
                    function () {
                        _self.dialogSysTypeFormVisible = true
                    }
                )
                if(isSysTypeDisabled){
                  this.formSysTypeTitle= "查看数据字典下拉项";
                  this.isShowSave=false;// 下拉项是否显示保存按钮
                }else {
                  this.formSysTypeTitle= "编辑数据字典下拉项";
                  this.isShowSave=true;//下拉项是否显示保存按钮
                }
                this.isSysTypeDisabled = isSysTypeDisabled
            },
            handleSysTypeSelectionChange(val) {
                this.multipleSelectionSysType = val;
            },
            //获取列表
            getListSysType(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysTypeForm)//拼接查询条件
        if(!this.commonUtils.isStrIsNull(_self.sjzdxlid)){
          debugger
          filter+="&typegroupid="+_self.sjzdxlid+"&"
        }else {
          return false;
        }
                _self.defaultSearchSysType.params.filter = filter
                _self.defaultSearchSysType.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysType',
                        params: _self.defaultSearchSysType.params
                    }
                ).then(function (response) {
                    _self.tableSysType.tableData = response.data.result.records
                    _self.tableSysType.total = response.data.result.total
                    _self.tableSysType.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysType, _self.dictsSysType)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysType(1)
        },
        watch:{
		        'sjzdxlid': function (val){
	              if(val != undefined && val != null){
	                  this.getListSysType(1);
	              }
	          },
            multipleSelectionSysType(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


