<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysPermissionForm" class="clear">

                <el-form-item class="w25" label="许可编码">
                    <el-input v-model="searchSysPermissionForm.code" placeholder="许可编码"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="许可名称">
                    <el-input v-model="searchSysPermissionForm.name" placeholder="许可名称"></el-input>
                </el-form-item>

       <!--         <el-form-item class="w25" label="类型">
                    <el-input v-model="searchSysPermissionForm.type" placeholder="类型"></el-input>
                </el-form-item>-->

              <el-form-item  verify can-be-empty  class="w25" prop="type" label="类型" int>
                <el-select v-model="searchSysPermissionForm.type" placeholder="请选择" :clearable="true">
                  <el-option v-for="item in dictsSysPermission.type" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
              </el-form-item>



                <el-form-item class="w25" label="图标">
                    <el-input v-model="searchSysPermissionForm.icon" placeholder="图标"></el-input>
                </el-form-item>

           <!--     <el-form-item class="w25" label="是否无效:是1，否0">
                    <el-input v-model="searchSysPermissionForm.isDisable" placeholder="是否无效"></el-input>
                </el-form-item>-->


              <el-form-item  verify can-be-empty  class="w25" prop="isDisable" label="是否无效" int>
                <el-select v-model="searchSysPermissionForm.isDisable" placeholder="请选择" :clearable="true">
                  <el-option v-for="item in dictsSysPermission.isDisable" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
              </el-form-item>




                <el-form-item class="w25" label="创建人名称">
                    <el-input v-model="searchSysPermissionForm.createName" placeholder="创建人名称"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysPermissionForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysPermission" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysPermission" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysPermission(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysPermissionSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysPermission" @row-click="rowClickSysPermission" :data="tableSysPermission.tableData" :height="tableHeight"
                      @selection-change="handleSysPermissionSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysPermission.curPageNum,defaultSearchSysPermission.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysPermission(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysPermission(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="code" label="许可编码"   width="180"></el-table-column>

                <el-table-column prop="name" label="许可名称"></el-table-column>

                <el-table-column prop="typeLabel" label="类型" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="icon" label="图标"   width="120"></el-table-column>

                <el-table-column prop="isDisableLabel" label="是否无效" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

                <el-table-column prop="createName" label="创建人名称"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

                <el-table-column prop="xh" label="序号" align="center" width="65"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysPermissionSizeChange"
                    @current-change="handleSysPermissionCurrentChange"
                    :current-page="tableSysPermission.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysPermission.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysPermission.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysPermissionTitle"  width="600px" top="10Vh"  :visible.sync="dialogSysPermissionFormVisible">
                <el-form :rules="formSysPermissionRules" ref="formSysPermission" :model="formSysPermission" :disabled=isSysPermissionDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item verify class="w100" prop="code" label="许可编码">
                        <el-input  v-model="formSysPermission.code" :maxlength="30"  autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item verify class="w100" prop="name" label="许可名称">
                        <el-input  v-model="formSysPermission.name" :maxlength="50"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify   class="w100" prop="type" label="类型" >
                      <el-select v-model="formSysPermission.type" placeholder="请选择">
                        <el-option v-for="item in dictsSysPermission.type" :key="item.value" :label="item.text" :value="item.value"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item  class="w100" prop="icon" label="图标">
                        <el-input  v-model="formSysPermission.icon" :maxlength="30"  autocomplete="off"></el-input>
                    </el-form-item>

                  <el-form-item verify can-be-empty  class="w100" prop="isDisable" label="是否无效" int>
                    <el-select v-model="formSysPermission.isDisable" placeholder="请选择">
                      <el-option v-for="item in dictsSysPermission.isDisable"
                                 :key="item.value"
                                 :label="item.text"
                                 :value="item.value">

                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item  class="w100" prop="xh" label="序号">
                    <el-input  v-model="formSysPermission.xh" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item  v-if="isShow" class="w100" prop="button" label="权限结构">
                    <el-input   v-model="sysPermissionPath" :maxlength="30"  autocomplete="off" @focus="permissionTree"></el-input>
                  </el-form-item>

                </el-form >
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysPermissionFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysPermissionForm">保 存</el-button>
                </div>
            </el-dialog>
        </div>

        <!--权限树弹窗-->
      <div class="map-form">
        <el-dialog title="选择父权限" width="40%" top="15Vh" :visible.sync="dialogSysPermissionTreeVisible" append-to-body>
          <!--显示权限树-->
          <GetParentPermissionList v-if="dialogSysPermissionTreeVisible" ref="GetParentPermissionList"  :id="id" :isRadio="true" :checkedKeys="checkedKeys"></GetParentPermissionList>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogSysPermissionTreeVisible = false">关 闭</el-button>
            <el-button type="primary" @click="saveSysRoleTree(id)">保 存</el-button>
          </div>
        </el-dialog>
      </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: wanghaotian
     * Date: Tue Nov 26 2019 15:34:00 GMT+0800 (China Standard Time)
     *
     */
    import GetParentPermissionList from "./GetParentPermissionList";
    export default {
        name: "SysPermission",
      components: {GetParentPermissionList},
      props:['deptData'],
        data() {
            return {
                formSysPermissionTitle: "权限管理",
                dialogSysPermissionFormVisible: false,//弹窗是否显示
                formSysPermission: {},//表单数据
                formSysPermissionRules: {},//校验字段以及规则
                tableSysPermission: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysPermissioisabled: false,
                multipleSelectionSysPermission: [],//多选时已选择的数据
                searchSysPermissionForm: {},
                defaultSearchSysPermission: {//columns:"TYPE",
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysPermission:{},
                isRowClickSysPermission:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                isSysPermissionDisabled:false,
                dialogSysPermissionTreeVisible:false, //权限树弹窗是否显示
                sysPermissionPath:"",
                checkedKeys:[],//给子组件传送组织选中数据
                id:'',
                isShow:true
            }
        },
        methods: {
          //选择父权限保存
          async saveSysRoleTree(id) {
            await this.$refs.GetParentPermissionList.savePermissionTree();
            this.getOneSysPermission(id);
            this.getListSysPermission(1);
            this.$emit("refresh-tree")
            this.dialogSysPermissionTreeVisible=false
          },
          permissionTree(){
            let _self = this
            this.dialogSysPermissionTreeVisible=true
          },
          //子组件向父组件传值(传送多条数据)
          postPermissionTreeData(val) {
            if (val === true) {
              this.$emit("sysPermissionTree", true)
            } else {
              this.$emit("sysPermissionTree", false)
            }
          },
            //table单击行事件
            rowClickSysPermission:function(row){
                if (!this.isRowClickSysPermission){
                    this.$refs.tableSysPermission.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysPermission=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysPermissionSearch() {
                this.searchSysPermissionForm = {}
                delete this.defaultSearchSysPermission.params.filter//移除对象的某个属性
                this.getListSysPermission(1)
            },
            //切换每页页数
            handleSysPermissionSizeChange(val) {
                this.defaultSearchSysPermission.params.pageSize = val
                this.getListSysPermission(1)
            },
            //切换当前页码
            handleSysPermissionCurrentChange(val) {
                this.getListSysPermission(val)
            },
            //打开新增
            goAddSysPermission() {
                this.formSysPermission = {}
                this.dialogSysPermissionFormVisible = true
                this.isSysPermissionDisabled=false
                this.isShow=false
            },
            //保存
            saveSysPermissionForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysPermission',_self)) {return false}//表单校验
                 if(!_self.commonUtils.isStrIsNull(_self.deptData.id)){
                _self.formSysPermission.parentId=_self.deptData.id
                }
                _self.request.save(
                    {
                        url: 'sysPermission',
                        data:  _self.formSysPermission
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysPermission=response.data.result
                        _self.postPermissionTreeData(true)
                        _self.getListSysPermission(1);
                    })
            },
            //删除数据
            deleteItemsSysPermission() {
                let _self = this
                if (_self.multipleSelectionSysPermission.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysPermission);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysPermission.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysPermission',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.postPermissionTreeData(true)
                        _self.getListSysPermission(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysPermission(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysPermission/'+ id
                    }
                ).then(function (response) {
                    _self.formSysPermission = response.data.result
                    _self.sysPermissionPath=response.data.message;
                    _self.deptData.id = response.data.result.parentId
                })
            },
            //修改或者查看页
            goUpdateSysPermission(isSysPermissionDisabled,rowData) {
                let _self=this
                this.isRowClickSysPermission=true
                this.isShow=true
                this.formSysPermission = {}
                this.getOneSysPermission(rowData.id).then(
                    function () {
                        _self.dialogSysPermissionFormVisible = true
                    }
                )
                 this.id = rowData.id
                this.isSysPermissionDisabled = isSysPermissionDisabled
            },
            handleSysPermissionSelectionChange(val) {
                this.multipleSelectionSysPermission = val;
            },
            //获取列表
            getListSysPermission(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysPermissionForm)//拼接查询条件
              if(!_self.commonUtils.isStrIsNull(_self.deptData.id)){
                filter+='&parentId='+_self.deptData.id
                }
                _self.defaultSearchSysPermission.params.filter = filter
                _self.defaultSearchSysPermission.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysPermission',
                        params: _self.defaultSearchSysPermission.params
                    }
                ).then(function (response) {
                    _self.tableSysPermission.tableData = response.data.result.records
                    _self.tableSysPermission.total = response.data.result.total
                    _self.tableSysPermission.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysPermission, _self.dictsSysPermission)
                })
            },
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysPermission(1)
        },
        watch:{

            deptData:function (val) {
              if(val != undefined && val != null){
                this.getListSysPermission(1)
              }
            },


            multipleSelectionSysPermission(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>
