<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysOrgForm" class="clear">

                <el-form-item class="w25" label="机构名称">
                    <el-input v-model="searchSysOrgForm.orgName" placeholder="组织机构名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="机构编码">
                    <el-input v-model="searchSysOrgForm.orgCode" placeholder="组织机构编码"></el-input>
                </el-form-item>



                <el-form-item class="w25" label="地址">
                    <el-input v-model="searchSysOrgForm.address" placeholder="地址"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="机构类型">
                    <el-select v-model="searchSysOrgForm.orgType" placeholder="请选择" :clearable="true">
                        <el-option
                                v-for="item in dictsSysOrg.orgType"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <!-- <el-form-item class="w25" label="联系电话">
                    <el-input v-model="searchSysOrgForm.tel" placeholder="联系电话"></el-input>
                </el-form-item> -->

               <!-- <el-form-item class="w25" label="创建人名称">
                    <el-input v-model="searchSysOrgForm.createName" placeholder="创建人名称"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysOrgForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item> -->

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysOrg" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysOrg" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysOrg(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysOrgSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysOrg" @row-click="rowClickSysOrg" :data="tableSysOrg.tableData" :height="tableHeight"
                      @selection-change="handleSysOrgSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysOrg.curPageNum,defaultSearchSysOrg.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysOrg(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysOrg(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="orgName" label="机构名称"   width="120"></el-table-column>

                <el-table-column prop="orgCode" label="机构编码"   width="120"></el-table-column>

                <el-table-column prop="description" label="描述"   width="200"></el-table-column>

                <el-table-column prop="address" label="地址"   width="120"></el-table-column>

                <el-table-column prop="orgTypeLabel" label="机构类型"   width="120"></el-table-column>

                <el-table-column prop="tel" label="联系电话"   width="120"></el-table-column>

                <el-table-column prop="createName" label="创建人名称"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysOrgSizeChange"
                    @current-change="handleSysOrgCurrentChange"
                    :current-page="tableSysOrg.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysOrg.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysOrg.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysOrgTitle"  width="80%" top="10Vh"  :visible.sync="dialogSysOrgFormVisible">
                <el-form :rules="formSysOrgRules" ref="formSysOrg" :model="formSysOrg" :disabled=isSysOrgDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item verify class="w25" prop="orgName" label="机构名称">
                        <el-input  v-model="formSysOrg.orgName" :maxlength="200"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify class="w25" prop="orgCode" label="机构编码">
                        <el-input  v-model="formSysOrg.orgCode" :maxlength="50"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item verify class="w25" prop="orgType" label="机构类型" >
                        <el-select v-model="formSysOrg.orgType" placeholder="请选择">
                            <el-option
                                v-for="item in dictsSysOrg.orgType"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="tel" label="联系电话">
                        <el-input  v-model="formSysOrg.tel" :maxlength="60"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="description" label="描述" >
                        <el-input  v-model="formSysOrg.description" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="address" label="地址" >
                        <el-input  v-model="formSysOrg.address" :maxlength="200" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>


                    <el-form-item  class="w100" prop="button" label="所属机构">
                      <el-input  v-model="SysOrgPath" :maxlength="30"  autocomplete="off" @focus="sysOrgTree"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysOrgFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysOrgForm" v-if="bcshow">保 存</el-button>
                </div>
            </el-dialog>
        </div>

        <!--机构树弹窗-->
        <div class="map-form">
          <el-dialog title="选择父权限" width="40%" top="15Vh" :visible.sync="dialogSysOrgTreeVisible" append-to-body>
            <!--显示权限树-->
            <!--ref="UserOrgTree"  :id="id" :isRadio="true" :checkedKeys="checkedKeys"-->
            <UserOrgTree v-if="dialogSysOrgTreeVisible" ref="UserOrgTree"  :isRadio="true" :orgId="orgId"></UserOrgTree>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogSysOrgTreeVisible = false">关 闭</el-button>
              <el-button type="primary" @click="saveSysOrgTree(orgId)">保 存</el-button>
            </div>
          </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: qindonghui
     * Date: Fri Nov 29 2019 12:07:04 GMT+0800 (GMT+08:00)
     * 组织机构表
     */
    import UserOrgTree from "./UserOrgTree";
    export default {

        name: "SysOrg",
        components: {UserOrgTree},
        props:['deptData'],

        data() {
            return {
                formSysOrgTitle: "组织机构表",
                dialogSysOrgFormVisible: false,//弹窗是否显示
                formSysOrg: {},//表单数据
                formSysOrgRules: {},//校验字段以及规则
                tableSysOrg: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysOrgDisabled: false,
                multipleSelectionSysOrg: [],//多选时已选择的数据
                searchSysOrgForm: {},
                defaultSearchSysOrg: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysOrg:{},
                isRowClickSysOrg:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                bcshow:true,//编辑 查看时保存按钮控制标记
                tel:[],//需要脱敏的电话号字段
                address:[],//地址脱敏
                SysOrgPath:'',
                dialogSysOrgTreeVisible:false, //机构树弹窗是否显示
                orgId:{}
            }
        },
        methods: {
          //选择父权限保存
          saveSysOrgTree(id) {
            this.$refs.UserOrgTree.postSysOrgTreeData();
            this.getOneSysOrg(id);
            this.getListSysOrg(1);
            this.$emit("refresh-tree")
            this.dialogSysOrgTreeVisible=false
          },
            sysOrgTree(){
              let _self = this
              this.dialogSysOrgTreeVisible=true
            },
            //table单击行事件
            rowClickSysOrg:function(row){
                if (!this.isRowClickSysOrg){
                    this.$refs.tableSysOrg.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysOrg=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysOrgSearch() {
                this.searchSysOrgForm = {}
                delete this.defaultSearchSysOrg.params.filter//移除对象的某个属性
                this.getListSysOrg(1)
            },
            //切换每页页数
            handleSysOrgSizeChange(val) {
                this.defaultSearchSysOrg.params.pageSize = val
                this.getListSysOrg(1)
            },
            //切换当前页码
            handleSysOrgCurrentChange(val) {
                this.getListSysOrg(val)
            },
            //打开新增
            goAddSysOrg() {
                this.formSysOrg = {}
                this.dialogSysOrgFormVisible = true
                this.isSysOrgDisabled=false
                this.bcshow=true
            },
            //保存
            saveSysOrgForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysOrg',_self)) {return false}//表单校验
                _self.commonUtils.encryptionData(_self.formSysOrg,{tel:['tel'],address:['address']})//脱敏
                if(!_self.commonUtils.isStrIsNull(_self.deptData.id)){
                    _self.formSysOrg.parentId=_self.deptData.id
                }
                _self.request.save(
                    {
                        url: 'sysOrg',
                        data:  _self.formSysOrg
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        debugger
                        _self.formSysOrg=response.data.result
                        _self.postOrgListData(true)
                        _self.getListSysOrg(1);
                    })
            },
            //删除数据
            deleteItemsSysOrg() {
                let _self = this
                if (_self.multipleSelectionSysOrg.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysOrg);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysOrg.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysOrg',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.postOrgListData(true)
                        _self.getListSysOrg(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysOrg(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysOrg/'+ id
                    }
                ).then(function (response) {
                    _self.formSysOrg = response.data.result
                  _self.SysOrgPath = response.data.message;
                })
            },
            //修改或者查看页
            goUpdateSysOrg(isSysOrgDisabled,rowData) {
                let _self=this
                this.isRowClickSysOrg=true
                this.formSysOrg = {}
                if(isSysOrgDisabled){
                  _self.bcshow=false
                }else{
                   _self.bcshow=true
                }
                this.getOneSysOrg(rowData.id).then(
                    function () {
                        _self.dialogSysOrgFormVisible = true
                    }
                )
                this.orgId = rowData.id
                this.isSysOrgDisabled = isSysOrgDisabled
            },
            handleSysOrgSelectionChange(val) {
                this.multipleSelectionSysOrg = val;
            },
            //获取列表
            getListSysOrg(page) {
                let _self = this

                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysOrgForm)//拼接查询条件

                if(!_self.commonUtils.isStrIsNull(_self.deptData.id)){
                     filter+='&parentId='+_self.deptData.id+'&'
                }
                _self.defaultSearchSysOrg.params.filter = filter
                _self.defaultSearchSysOrg.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysOrg',
                        params: _self.defaultSearchSysOrg.params
                    }
                ).then(function (response) {
                    _self.tableSysOrg.tableData = response.data.result.records
                    _self.tableSysOrg.total = response.data.result.total
                    _self.tableSysOrg.curPageNum = page

                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysOrg, _self.dictsSysOrg)
                })
            },
            //子组件向父组件传值(传送多条数据)
            postOrgListData(val) {
              debugger
              if (val === true) {
                this.$emit("selectOrgList", true)
              } else {
                this.$emit("selectOrgList", false)
              }
            },
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysOrg(1)
        },
        watch:{
          deptData:function (val) {
            if(val != undefined && val != ""){
              this.getListSysOrg(1)
            }
          },
            multipleSelectionSysOrg(){
                this.commonUtils.toggleSelectTrStyle(this)
            },
        }
    }
</script>
