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

               <!-- <el-form-item class="w25" label="密码(加密后)">
                    <el-input v-model="searchSysUserForm.password" placeholder="密码(加密后)"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="加密盐">
                    <el-input v-model="searchSysUserForm.salt" placeholder="加密盐"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysUserForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

                <el-form-item class="w25" label="创建人名称">
                    <el-input v-model="searchSysUserForm.createName" placeholder="创建人名称"></el-input>
                </el-form-item>
                -->
            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="18">
                    <div class="grid-content">
                        <el-button @click="goAddSysUser" type="primary" icon="el-icon-plus" size="small">新增</el-button>
                        <el-button @click="deleteItemsSysUser" type="primary" icon="el-icon-delete" size="small">删除</el-button>
                        <el-button @click="resetPassWord" type="primary" icon="el-icon-refresh-left" size="small">密码重置</el-button>
                    </div>
                </el-col>
                <el-col :span="6">
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
                <el-table-column width="260" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateSysUser(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateSysUser(true,scope.row)">查看</el-button>
                        <el-button type="text" @click="openSysUserRole(scope.row)">角色</el-button>
                        <el-button type="text" @click="userFreeze(scope.row)" v-if="scope.row.isDisabled">启用</el-button>
                        <el-button type="text" @click="userFreeze(scope.row)" v-else>冻结</el-button>
                        <el-button type="text" @click="userOrgTree(scope.row)" >组织机构</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="username" label="用户名(登录名)"   width="120"></el-table-column>

                <el-table-column prop="realname" label="真实姓名"   width="120"></el-table-column>

                <el-table-column prop="email" label="邮箱"   width="200"></el-table-column>

                <el-table-column prop="lastLoginTime" label="最后一次登录时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

                <el-table-column prop="lastLoginIp" label="最后一次登录IP" align="center"  width="140"></el-table-column>

               <!-- <el-table-column prop="password" label="密码(加密后)"   width="120"></el-table-column>

                <el-table-column prop="salt" label="加密盐"   width="120"></el-table-column>-->

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

                <!-- <el-table-column prop="createName" label="创建人名称" align="center"  width="120"></el-table-column> -->

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

        <div class="map-form">
          <el-dialog title="角色列表" width="800px" top="10Vh" :visible.sync="dialogSysRoleListVisible">
            <!--分配角色弹窗-->
            <RoleList v-if="dialogSysRoleListVisible" :userId="userId"></RoleList>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogSysRoleListVisible = false">关 闭</el-button>
            </div>
          </el-dialog>
        </div>

                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysUserTitle"  width="40%" top="10Vh"  :visible.sync="dialogSysUserFormVisible">
                <el-form :rules="formSysUserRules" ref="formSysUser" :model="formSysUser" :disabled=isSysUserDisabled class="clear dialog-form"  label-width="150px">

                    <el-form-item  class="w100" prop="username" label="用户名(登录名)" >
                        <el-input  v-model="formSysUser.username" :maxlength="50"  autocomplete="off" ></el-input>
                    </el-form-item>

                    <el-form-item  class="w100" prop="realname" label="真实姓名"  >
                        <el-input  v-model="formSysUser.realname" :maxlength="50"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w100" prop="email" label="邮箱">
                        <el-input  v-model="formSysUser.email" :maxlength="50"  autocomplete="off"></el-input>
                    </el-form-item>

                   <!-- <el-form-item   class="w100" prop="password" label="密码(加密后)" >
                        <el-input  v-model="formSysUser.password" :maxlength="200" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="salt" label="加密盐">
                        <el-input  v-model="formSysUser.salt" :maxlength="10"  autocomplete="off"></el-input>
                    </el-form-item> -->

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogSysUserFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysUserForm" v-if="bcshow">保 存</el-button>
                </div>
            </el-dialog>

          <!--密码重置-->
          <el-dialog title="密码重置" width="400px" top="10Vh" :visible.sync="dialogFormVisible">


            <el-form :model="formSysUser">
              <el-form-item verify class="w100" prop="password" label="输入密码">
                <el-input  v-model="formSysUser.password" :maxlength="200" type="password" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item verify class="w100" prop="password" label="确认密码">
                <el-input  v-model="formSysUser.ispassword" :maxlength="200" type="password" autocomplete="off"></el-input>
              </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click="isReset">确 定</el-button>
            </div>
          </el-dialog>
        </div>

 <div class="map-form">
      <!--组织机构树弹窗-->
      <el-dialog title="选择组织机构" width="26%" top="15Vh" :visible.sync="dialogSysUserOrgTreeVisible" append-to-body>
        <UserOrgTree v-if="dialogSysUserOrgTreeVisible" ref="UserOrgTree"  :isRadio="true" :userId="userId" ></UserOrgTree>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogSysUserOrgTreeVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveUserOrgTree()">保 存</el-button>
        </div>
      </el-dialog>
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

    import RoleList from "./RoleList";
    import request from "../../../utils/request";
    import UserOrgTree from "./UserOrgTree";
    export default {
        name: "SysUser",
      components:{RoleList,UserOrgTree},
        data() {
            return {
                formSysUserTitle: "系统用户表",
                dialogSysUserFormVisible: false,//弹窗是否显示
                formSysUser: {},//表单数据
                formSysUserRules: {
                  username: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { min: 2,  message: '最少输入2个字符', trigger: 'blur' }
                  ],
                  realname: [
                    { required: true, message: '必填', trigger: 'blur' },
                    { min: 2,  message: '最少输入2个字符', trigger: 'blur' }
                  ],
                },//校验字段以及规则
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
                userId:{},
                dialogFormVisible: false,
                dialogSysUserOrgTreeVisible:false,//控制组织机构弹窗显示

            }
        },
        methods: {
          //打开组织机构树弹框，对用户拥有的组织树展示选中
          userOrgTree(row){
            let _self = this
            _self.userId=row.id
            _self.dialogSysUserOrgTreeVisible=true
          },
          //按用户id保存组织机构树勾选数据
          saveUserOrgTree(){
              this.$refs.UserOrgTree.postUserOrgTreeData();
          },
          // 密码重置
          resetPassWord(){
            let _self = this
            if (_self.multipleSelectionSysUser.length === 0) {
              this.commonUtils.message("请至少选择一位用户");
              return false;
            }
            _self.dialogFormVisible = true
          },
          isReset() {
            let _self = this
            let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysUser);
            let passWord = _self.formSysUser.password;
            let ispassword = _self.formSysUser.ispassword;
            if (passWord != ispassword){
              this.commonUtils.message("两次输入的密码不一致");
              return false;
            }
            _self.request.post(
              {
                url: "sysUser/resetPassWord/",
                data: {"userIds": ids, "password": passWord}

              }
            ).then((response) => {
              _self.dialogFormVisible = false
              _self.getListSysUser(1)
            })
          },
          //冻结/启用
          userFreeze(rowData){
            let _self=this
            _self.userId = rowData.id   // 拿到userid
            return _self.$confirm('此操作会将选中数据冻结/启用,是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              // 去后台
              _self.request.post(
                {
                  url: 'sysUser/iceOrFire',
                  data: {"userId":_self.userId}
                }
              ).then((response) => {
                _self.getListSysUser(1)//调用查询取消选中
              })
            }).catch(() => {
              _self.$message({
                type: 'info',
                message: '已取消操作'
              })
              _self.getListSysUser(1)//调用查询取消选中
            })

          },
          //打开SysUSerRole.vue
          openSysUserRole(rowData) {
            let _self=this
            _self.userId = rowData.id
            _self.dialogSysRoleListVisible=true
          },
            //table单击行事件
            rowClickSysUser:function(row){
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
            //打开新增
            goAddSysUser() {
                this.formSysUser = {}
                this.dialogSysUserFormVisible = true
                this.isSysUserDisabled=false
                this.bcshow=true
            },
            //保存
            saveSysUserForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysUser',_self)) {return false}//表单校验
                 _self.commonUtils.encryptionData(_self.formSysUser,{email:['email']})//脱敏
                _self.request.save(
                    {
                        url: 'sysUser',
                        data:  _self.formSysUser
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysUser=response.data.result
                        _self.getListSysUser(1);
                    })
            },
            //删除数据
            deleteItemsSysUser() {
                let _self = this
                if (_self.multipleSelectionSysUser.length === 0) {
                    this.commonUtils.message("请至少选择一条再删除");
                    return false;
                }
                let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionSysUser);
                return  this.$confirm('此操作将永久删除已选中的' +_self.multipleSelectionSysUser.length+ '条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'sysUser',
                            data: ids
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListSysUser(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneSysUser(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysUser/'+ id
                    }
                ).then(function (response) {
                    _self.formSysUser = response.data.result
                })
            },
            //修改或者查看页
          goUpdateSysUser(isSysUserDisabled,rowData) {
            let _self=this
            this.isRowClickSysUser=true
            this.formSysUser = {}
            if(isSysUserDisabled){
              _self.bcshow=false
            }else{
              _self.bcshow=true
            }
            this.getOneSysUser(rowData.id).then(
              function () {
                _self.dialogSysUserFormVisible = true
              }
            )
            this.isSysUserDisabled = isSysUserDisabled
          },
            handleSysUserSelectionChange(val) {
                this.multipleSelectionSysUser = val;
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
                        url:'sysUser',
                        params: _self.defaultSearchSysUser.params
                    }
                ).then(function (response) {
                    _self.tableSysUser.tableData = response.data.result.records
                    _self.tableSysUser.total = response.data.result.total
                    _self.tableSysUser.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysUser, _self.dictsSysUser)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysUser(1)
        },
        watch:{
            multipleSelectionSysUser(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>
