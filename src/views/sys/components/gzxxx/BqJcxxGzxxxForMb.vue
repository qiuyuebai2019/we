<template>
    <div>
                <!-- 查询条件 -->
        <div class="map-search-bar">
            <el-form :model="searchBqJcxxGzxxxForm" class="clear">

                <el-form-item label-width="85px" class="w25" label="感知信息项">
                    <el-input v-model="searchBqJcxxGzxxxForm.gzxxx" placeholder="感知信息项"></el-input>
                </el-form-item>

                <el-form-item label-width="135px" class="w30" label="感知信息项编码">
                    <el-input v-model="searchBqJcxxGzxxxForm.gzxxxbm" placeholder="感知信息项编码"></el-input>
                </el-form-item>

                <el-form-item label-width="60px" class="w25" label="单位">
                    <el-input v-model="searchBqJcxxGzxxxForm.dw" placeholder="单位"></el-input>
                </el-form-item>

            </el-form>
        </div>

        <!-- 操作按钮 -->
        <div class="map-handle-bar">
            <el-row>
                <el-col :span="24">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListBqJcxxGzxxx(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertBqJcxxGzxxxSearch" size=small>重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableBqJcxxGzxxx" @select="checkboxClickBqJcxxGzxxx" @row-click="rowClickBqJcxxGzxxx" :data="tableBqJcxxGzxxx.tableData" height="500px"
                      @selection-change="handleBqJcxxGzxxxSelectionChange"  tooltip-effect="dark" stripe  border @select-all="selectAll">
                <el-table-column type="selection" width="35"> </el-table-column>
                  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                        <span>{{commonUtils.getTableIndex(tableBqJcxxGzxxx.curPageNum,defaultSearchBqJcxxGzxxx.params.pageSize,scope.$index)}}</span>
                    </template>
                </el-table-column>
              <!--  <el-table-column width="100" label="操作"  align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateBqJcxxGzxxx(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="goUpdateBqJcxxGzxxx(true,scope.row)">查看</el-button>
                    </template>
                </el-table-column>
-->
                <el-table-column prop="gzxxx" label="感知信息项"   width="120"></el-table-column>

                <el-table-column prop="gzxxxbm" label="感知信息项编码"   width="120"></el-table-column>

                <el-table-column prop="dw" label="单位"   width="60"></el-table-column>

                <el-table-column prop="bz" label="备注"   width="200"></el-table-column>

                <el-table-column prop="createName" label="创建人" align="center"  width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleBqJcxxGzxxxSizeChange"
                    @current-change="handleBqJcxxGzxxxCurrentChange"
                    :current-page="tableBqJcxxGzxxx.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchBqJcxxGzxxx.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableBqJcxxGzxxx.total">
            </el-pagination>
        </div>


                <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formBqJcxxGzxxxTitle"  width="80%" top="10Vh"  :visible.sync="dialogBqJcxxGzxxxFormVisible">
                <el-form :rules="formBqJcxxGzxxxRules" ref="formBqJcxxGzxxx" :model="formBqJcxxGzxxx" :disabled=isBqJcxxGzxxxDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w25" prop="gzxxx" label="感知信息项">
                        <el-input  v-model="formBqJcxxGzxxx.gzxxx" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="gzxxxbm" label="感知信息项编码">
                        <el-input  v-model="formBqJcxxGzxxx.gzxxxbm" :maxlength="64"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="dw" label="单位">
                        <el-input  v-model="formBqJcxxGzxxx.dw" :maxlength="10"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="bz" label="备注" >
                        <el-input  v-model="formBqJcxxGzxxx.bz" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogBqJcxxGzxxxFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveBqJcxxGzxxxForm" v-if="!isBqJcxxGzxxxDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>

    </div>
</template>

<script>
    /**
     * Created by Code Generator.
     * Author: liubo
     * Date: Fri Dec 20 2019 12:09:34 GMT+0800 (GMT+08:00)
     * 感知信息项基础表
     */
    export default {
        name: "BqJcxxGzxxx",
        props: ["bqlxId","mbid","singleSlect","zclxbm"],//mbid模板ID，singleSlect是否单选
        data() {
            return {
                formBqJcxxGzxxxTitle: "感知信息项基础表",
                dialogBqJcxxGzxxxFormVisible: false,//弹窗是否显示
                formBqJcxxGzxxx: {},//表单数据
                formBqJcxxGzxxxRules: {},//校验字段以及规则
                tableBqJcxxGzxxx: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isBqJcxxGzxxxDisabled: false,
                multipleSelectionBqJcxxGzxxx: [],//多选时已选择的数据
                searchBqJcxxGzxxxForm: {},
                defaultSearchBqJcxxGzxxx: {
                    params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
                },
                dictsBqJcxxGzxxx:{},
                isRowClickBqJcxxGzxxx:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                tableBqJcxxGzxxxTwo : [],//用来记录表格单选时的数据
            }
        },
        methods: {
          //表格全选时操作
          selectAll(selection){
            //this.$refs.tableBqJcxxGzxxx.clearSelection();
            //这里将这行的状态又变为了勾选
            //this.$refs.tableBqJcxxGzxxx.toggleRowSelection(this.tableBqJcxxGzxxxTwo, true);
          },
            // 获取选中的数据
            getJcxxGzxxxList(){
              let _self = this
              /*if (_self.multipleSelectionBqJcxxGzxxx.length === 0) {
                _self.$alert("请选择一条数据", '提示', {
                  confirmButtonText: '确定'
                });
                return;
              }*/
              /*if (this.singleSlect){
                return _self.multipleSelectionBqJcxxGzxxx.slice(-1);
              }else {
                return _self.multipleSelectionBqJcxxGzxxx
              }*/
              return _self.multipleSelectionBqJcxxGzxxx
            },
            //单选时点击选择框后选中(此方法参数由点击选择框事件返回)
            checkboxClickBqJcxxGzxxx:function(selection,row){
              if (this.singleSlect){
                //clearSelection：用于多选表格，清空用户的选择
                //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selection为一个数组，里面存放的为当前这一行的数据
                //this.$refs.tableBqJcxxGzxxx.clearSelection();
                //此时selection仍然有值 ，只是勾选状态不显示了。
                if (selection.length === 0) {
                  return;
                }
                //这里将这行的状态又变为了勾选
                this.$refs.tableBqJcxxGzxxx.toggleRowSelection(row, true);
                this.tableBqJcxxGzxxxTwo = row//将单选时的内容进行存储
              }else{
                return;
              }
            },
            //table单击行事件
            rowClickBqJcxxGzxxx:function(row){
                if (!this.isRowClickBqJcxxGzxxx){
                    if (this.singleSlect){//单选时清除其余选项的选种状态
                      //this.$refs.tableBqJcxxGzxxx.clearSelection();
                    }
                    this.$refs.tableBqJcxxGzxxx.toggleRowSelection(row)//切换选中
                    this.tableBqJcxxGzxxxTwo = row//将单选时的内容进行存储
                }else {
                    this.isRowClickBqJcxxGzxxx=false
                }
                //其他行点击事件逻辑
            },
            //重置
            resertBqJcxxGzxxxSearch() {
                this.searchBqJcxxGzxxxForm = {}
                delete this.defaultSearchBqJcxxGzxxx.params.filter//移除对象的某个属性
                this.getListBqJcxxGzxxx(1)
            },
            //切换每页页数
            handleBqJcxxGzxxxSizeChange(val) {
                this.defaultSearchBqJcxxGzxxx.params.pageSize = val
                this.getListBqJcxxGzxxx(1)
            },
            //切换当前页码
            handleBqJcxxGzxxxCurrentChange(val) {
                this.getListBqJcxxGzxxx(val)
            },
            //保存
            saveBqJcxxGzxxxForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formBqJcxxGzxxx',_self)) {return false}//表单校验
                _self.request.save(
                    {
                        url: 'bqJcxxGzxxx',
                        data:  _self.formBqJcxxGzxxx
                    }
                )
                    .then((response) => {
                        //保存后自动将后台信息填充到表单
                        _self.formBqJcxxGzxxx=response.data.result
                        _self.getListBqJcxxGzxxx(1);
                    })
            },
            //获取一条
            getOneBqJcxxGzxxx(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'bqJcxxGzxxx/'+ id
                    }
                ).then(function (response) {
                    _self.formBqJcxxGzxxx = response.data.result
                })
            },
            //修改或者查看页
            goUpdateBqJcxxGzxxx(isBqJcxxGzxxxDisabled,rowData) {
                let _self=this
                this.isRowClickBqJcxxGzxxx=true
                this.formBqJcxxGzxxx = {}
                this.getOneBqJcxxGzxxx(rowData.id).then(
                    function () {
                        _self.dialogBqJcxxGzxxxFormVisible = true
                    }
                )
                this.isBqJcxxGzxxxDisabled = isBqJcxxGzxxxDisabled
            },
            handleBqJcxxGzxxxSelectionChange(val) {
                this.multipleSelectionBqJcxxGzxxx = val;
            },
            //获取列表
            getListBqJcxxGzxxx(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchBqJcxxGzxxxForm)//拼接查询条件
                if (!_self.mbid){
                  filter += "bqlxId="+_self.bqlxId
                }
                _self.defaultSearchBqJcxxGzxxx.params.filter = filter

                _self.defaultSearchBqJcxxGzxxx.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:(_self.mbid?"bqJcxxGzxxx/getGzxxx/"+_self.mbid+'/'+_self.zclxbm:'bqJcxxGzxxx'),
                        params: _self.defaultSearchBqJcxxGzxxx.params
                    }
                ).then(function (response) {
                    _self.tableBqJcxxGzxxx.tableData = response.data.result.records
                    _self.tableBqJcxxGzxxx.total = response.data.result.total
                    _self.tableBqJcxxGzxxx.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableBqJcxxGzxxx, _self.dictsBqJcxxGzxxx)
                })
            }
        },
        //页面加载完成时执行
        mounted() {
            this.getListBqJcxxGzxxx(1)
        },
        watch:{
            multipleSelectionBqJcxxGzxxx(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


