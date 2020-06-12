<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form label-width="110px" :model="searchSysAttachForm" class="clear">

                <el-form-item class="w25" label="附件真实名称">
                    <el-input v-model="searchSysAttachForm.realName" placeholder="附件真实名称"></el-input>
                </el-form-item>

                <el-form-item class="w25" label="创建人">
                    <el-input v-model="searchSysAttachForm.createName" placeholder="创建人"></el-input>
                </el-form-item>

                <el-form-item label="创建时间" class="w50">
                    <el-date-picker :editable="false" v-model="searchSysAttachForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
                </el-form-item>

                <el-form-item class="w25" label="业务类别">
                  <el-select v-model="searchSysAttachForm.busiType" placeholder="请选择" :clearable="true">
                    <el-option
                      v-for="item in dictsSysAttach.busiType"
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

                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListSysAttach(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertSysAttachSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableSysAttach" @row-click="rowClickSysAttach" :data="tableSysAttach.tableData" :height="tableHeight"
                      @selection-change="handleSysAttachSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableSysAttach.curPageNum,defaultSearchSysAttach.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
                <el-table-column width="150" label="操作">
                    <template slot-scope="scope">

                        <el-button type="text" @click="goUpdateSysAttach(true,scope.row)">查看</el-button>
                        <el-button type="text" @click="downloadSysAttach(scope.row)">下载</el-button>
                        <el-button
                          v-show="imgList.indexOf(scope.row.attachName.substring(scope.row.attachName.lastIndexOf('.')))!== -1 "
                          type="text" @click="YlSysAttach(scope.row)">预览</el-button>
                    </template>
                </el-table-column>

                <el-table-column prop="realName" label="附件真实名称"></el-table-column>

                <el-table-column prop="attachName" label="上传后名称"></el-table-column>

                <el-table-column prop="upPath" label="上传路径"   width="200"></el-table-column>

                <el-table-column prop="busiTypeLabel" label="业务类别"   width="150"></el-table-column>

                <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleSysAttachSizeChange"
                    @current-change="handleSysAttachCurrentChange"
                    :current-page="tableSysAttach.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchSysAttach.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableSysAttach.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formSysAttachTitle"  width="80%" top="10Vh"  :visible.sync="dialogSysAttachFormVisible">
                <el-form :rules="formSysAttachRules" ref="formSysAttach" :model="formSysAttach" :disabled=isSysAttachDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item   class="w100" prop="realName" label="附件真实名称" >
                      <el-input  v-model="formSysAttach.realName" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="attachName" label="上传后名称" >
                        <el-input  v-model="formSysAttach.attachName" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="busiType" label="业务类别">
                        <el-select v-model="formSysAttach.busiType" placeholder="请选择">
                          <el-option
                            v-for="item in dictsSysAttach.busiType"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item  class="w25" prop="busiType" label="上传人">
                      <el-input  v-model="formSysAttach.createName" :maxlength="30"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="busiType" label="上传时间">
                      <el-date-picker type="date" placeholder="选择日期" v-model="formSysAttach.createTime" :formatter="commonUtils.formatDate"></el-date-picker>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button plain size="mini" type="primary" icon="el-icon-download" @click="downloadSysAttach(formSysAttach)">下载</el-button>
                    <el-button @click="dialogSysAttachFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveSysAttachForm" v-if="!isSysAttachDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

        <div>
          <el-dialog :title="dialogYLTitle" width="60%" top="10Vh" :visible.sync="dialogYLVisible">
            <div style="text-align: center">
              <img id="img" :src="imgSrc" style="max-width: 90%; max-height: 70%"/>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogYLVisible = false">关 闭</el-button>
            </div>
          </el-dialog>
      </div>
    </div>
</template>

<script>
    /**
     * 附件信息表
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    export default {
        name: "SysAttach",
        data() {
            return {
                formSysAttachTitle: "附件信息表",
                dialogYLTitle: "附件预览",
                dialogSysAttachFormVisible: false,//弹窗是否显示
                formSysAttach: {},//表单数据
                formSysAttachRules: {},//校验字段以及规则
                tableSysAttach: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isSysAttachDisabled: false,
                multipleSelectionSysAttach: [],//多选时已选择的数据
                searchSysAttachForm: {},
                defaultSearchSysAttach: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsSysAttach:{},
                isRowClickSysAttach:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                dialogYLVisible: false, // 预览弹窗默认不显示
                imgSrc: '',  //图片路径
                imgList: ['.jpg', '.png', '.gif']
            }
        },
        methods: {
            //table单击行事件
            rowClickSysAttach:function(row){
                if (!this.isRowClickSysAttach){
                    this.$refs.tableSysAttach.toggleRowSelection(row)//切换选中
                }else {
                    this.isRowClickSysAttach=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertSysAttachSearch() {
                this.searchSysAttachForm = {}
                delete this.defaultSearchSysAttach.params.filter//移除对象的某个属性
                this.getListSysAttach(1)
            },
            //切换每页页数
            handleSysAttachSizeChange(val) {
                this.defaultSearchSysAttach.params.pageSize = val
                this.getListSysAttach(1)
            },
            //切换当前页码
            handleSysAttachCurrentChange(val) {
                this.getListSysAttach(val)
            },

            //保存
            saveSysAttachForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formSysAttach',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'sysAttach',
                        data:  _self.formSysAttach
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formSysAttach=response.data.result
                        _self.getListSysAttach(1);
                    })
            },

            //获取一条
            getOneSysAttach(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'sysAttach/'+ id
                    }
                ).then(function (response) {
                    _self.formSysAttach = response.data.result
                })
            },
            //修改或者查看页
            goUpdateSysAttach(isSysAttachDisabled,rowData) {
                let _self=this
                this.isRowClickSysAttach=true
                this.formSysAttach = {}
                this.getOneSysAttach(rowData.id).then(
                    function () {
                        _self.dialogSysAttachFormVisible = true
                    }
                )
                this.isSysAttachDisabled = isSysAttachDisabled
            },

            // 下载文件
            downloadSysAttach(rowData) {
              let _self=this
              window.open(_self.commonUtils.buildTokenUrl('sysAttach/doDownLoadFile?id=' +rowData.id), '_self');
            },

            // 预览文件
            YlSysAttach(rowData) {
              let _self=this;
              _self.imgSrc = '';
              _self.dialogYLVisible = true;
              _self.imgSrc = _self.commonUtils.buildTokenUrl('sysAttach/doDownLoadFile?id=' + rowData.id);
            },

            handleSysAttachSelectionChange(val) {
                this.multipleSelectionSysAttach = val;
            },
            //获取列表
            getListSysAttach(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchSysAttachForm)//拼接查询条件
                _self.defaultSearchSysAttach.params.filter = filter
                _self.defaultSearchSysAttach.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'sysAttach',
                        params: _self.defaultSearchSysAttach.params
                    }
                ).then(function (response) {
                    _self.tableSysAttach.tableData = response.data.result.records
                    _self.tableSysAttach.total = response.data.result.total
                    _self.tableSysAttach.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableSysAttach, _self.dictsSysAttach)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListSysAttach(1)
        },
        watch:{
            multipleSelectionSysAttach(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


