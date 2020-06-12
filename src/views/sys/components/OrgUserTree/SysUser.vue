<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysUserForm" class="clear">

                <el-form-item class="w25" label="用户名(登录名)">
                    <el-input v-model="searchSysUserForm.username" placeholder="用户名(登录名)"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="真实姓名">
                    <el-input v-model="searchSysUserForm.realname" placeholder="真实姓名"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="邮箱">
                    <el-input v-model="searchSysUserForm.email" placeholder="邮箱"></el-input>
                </el-form-item>


            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysUser(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysUserSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysUser" @row-click="rowClickSysUser" :data="tableSysUser.tableData" :height="tableHeight"
                      @selection-change="handleSysUserSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysUser.curPageNum,defaultSearchSysUser.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>


                <el-table-column prop="username" label="用户名(登录名)"   width="120"></el-table-column>

                <el-table-column prop="realname" label="真实姓名"   width="120"></el-table-column>

                <el-table-column prop="email" label="邮箱"   width="200"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysUserSizeChange"
                    @current-change="handleSysUserCurrentChange"
                    :current-page="tableSysUser.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysUser.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysUser.total">
            </el-pagination>
        </div>



    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: qindonghui
     * Date: Fri Nov 29 2019 11:00:01 GMT+0800 (GMT+08:00)
     * 系统用户表
     */

    export default {
        name: "SysUser",
        props:['deptData', 'ispd'],
        data() {
            return {
                formSysUserTitle: "系统用户表",
                dialogSysUserFormVisible: false,//弹窗是否显示
                formSysUser: {},//表单数据
                formSysUserRules: {},//校验字段以及规则
                tableSysUser: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysUserDisabled: false,
                multipleSelectionSysUser: [],//多选时已选择的数据
                searchSysUserForm: {},
                defaultSearchSysUser: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysUser:{},
                isRowClickSysUser:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                bcshow:true,//编辑 查看时保存按钮控制标记
                email:[],//需要脱敏的邮箱字段
                dialogSysRoleListVisible:false, //RoleList这个子组件是否隐藏
                userIdList:[],
                dialogFormVisible: false,
                dialogSysUserOrgTreeVisible:false,//控制组织机构弹窗显示

            }
        },
        methods: {

            //table单击行事件
            rowClickSysUser:function(row){
               this.$refs.tableSysUser.clearSelection();//设置列表单选
               this.multipleSelectionSysUser=[];
                if (!this.isRowClickSysUser){
                    this.$refs.tableSysUser.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysUser=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysUserSearch() {
                this.searchSysUserForm = {}
                delete this.defaultSearchSysUser.params.filter//移除对象的某个属性
                this.getListSysUser(1)
            },
            //切换每页页数
            handleSysUserSizeChange(val) {
                this.defaultSearchSysUser.params.pageSize = val
                this.getListSysUser(1)
            },
            //切换当前页码
            handleSysUserCurrentChange(val) {
                this.getListSysUser(val)
            },

            handleSysUserSelectionChange(val) {
                if(this.ispd === true){
                  if (val.length > 1) {
                    this.$refs.tableSysUser.clearSelection()
                    this.$refs.tableSysUser.toggleRowSelection(val.pop())
                  } else {
                    this.multipleSelectionSysUser = val;
                  }
                } else {
                  this.multipleSelectionSysUser = val;
                }
            },
             //获取选中的数据
            getUserList() {
               let _self = this;
               if(_self.multipleSelectionSysUser.length===0){
                _self.commonUtils.error("请选择人员信息。")
                 return false
               }
               return _self.multipleSelectionSysUser;
             },

            //获取列表
            getListSysUser(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysUserForm)//拼接查询条件

                _self.defaultSearchSysUser.params.filter = filter
                _self.defaultSearchSysUser.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysUser/getOrgUserList/'+_self.deptData.id,
                        params: _self.defaultSearchSysUser.params
                    }
                ).then(function (response) {
                     _self.tableSysUser.tableData= response.data.result.records
                    _self.tableSysUser.total = response.data.result.total
                    _self.tableSysUser.curPageNum = page

                })
            },
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysUser(1)
        },
        watch:{
            multipleSelectionSysUser(){
                this.commonUtils.toggleSelectTrStyle(this)
            },
            deptData:function (val) {
              if(val != undefined && val != ""){
                this.getListSysUser(1)
              }
            },

        }
    }
</script>
