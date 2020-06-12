<template>
    <div>
                <!-- 查询条件 -->
<!--        <div class="map-search-bar">-->
<!--            <el-form label-width="110px" :model="searchBqXjglXjmbXjxForm" class="clear">-->
<!--                -->
<!--                <el-form-item class="w25" label="巡检模板id">-->
<!--                    <el-input v-model="searchBqXjglXjmbXjxForm.mbid" placeholder="巡检模板id"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item class="w25" label="巡检项类型 gzxxx 感知信息项  bzhyq 标准和要求">-->
<!--                    <el-select v-model="searchBqXjglXjmbXjxForm.xjxlx" placeholder="请选择">-->
<!--                        <el-option-->
<!--                                v-for="item in dictsBqXjglXjmbXjx.xjxlx"-->
<!--                                :key="item.value"-->
<!--                                :label="item.text"-->
<!--                                :value="item.value">-->
<!--                        </el-option>-->
<!--                    </el-select>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item class="w25" label="巡检项">-->
<!--                    <el-input v-model="searchBqXjglXjmbXjxForm.xjx" placeholder="巡检项"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item class="w25" label="巡检项来源id 感知信息项id 或者巡检对照项id">-->
<!--                    <el-input v-model="searchBqXjglXjmbXjxForm.xjxlyid" placeholder="巡检项来源id 感知信息项id 或者巡检对照项id"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item class="w25" label="说明 感知项的一些上限下限">-->
<!--                    <el-input v-model="searchBqXjglXjmbXjxForm.sm" placeholder="说明 感知项的一些上限下限"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item class="w25" label="创建人">-->
<!--                    <el-input v-model="searchBqXjglXjmbXjxForm.createName" placeholder="创建人"></el-input>-->
<!--                </el-form-item>-->
<!--                -->
<!--                <el-form-item label="创建时间" class="w50">-->
<!--                    <el-date-picker :editable="false" v-model="searchBqXjglXjmbXjxForm.createTime" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>-->
<!--                </el-form-item>-->
<!--                -->
<!--            </el-form>-->
<!--        </div>-->

        <!-- 操作按钮 -->
        <div class="map-handle-bar" v-if="isEdit">
            <el-row>
                <el-col :span="24">
                    <div class="grid-content">
                        <el-button @click="goAddBqXjglXjmbXjx(true)" type="primary" icon="el-icon-plus" size="small">添加标签感知项</el-button>
                        <el-button @click="goAddBqXjglXjmbXjx(false)" type="primary" icon="el-icon-plus" size="small">添加标准和要求</el-button>
                    </div>
                </el-col>
                <!--<el-col :span="6">
                    <div class="map-search-handel">
                        <el-button type="primary" @click="getListBqXjglXjmbXjx(1)" size=small>查询</el-button>
                        <el-button type="primary" @click="resertBqXjglXjmbXjxSearch" size=small>重置</el-button>
                    </div>
                </el-col>-->
            </el-row>
        </div>

                <!-- 表格 -->
        <div class ="map-table">
            <el-table ref="tableBqXjglXjmbXjx" @select="checkboxClickBqXjglXjmbXjx" @row-click="rowClickBqXjglXjmbXjx" :data="tableBqXjglXjmbXjx.tableData" :height="tableHeight"
                      @selection-change="handleBqXjglXjmbXjxSelectionChange"  tooltip-effect="dark" stripe  border>
                <el-table-column type="selection" width="35" v-if="isEdit"> </el-table-column>
              <!--  <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
                  <template slot-scope="scope">
                      <span>{{commonUtils.getTableIndex(tableBqXjglXjmbXjx.curPageNum,defaultSearchBqXjglXjmbXjx.params.pageSize,scope.$index)}}</span>
                  </template>
              </el-table-column>-->
              <el-table-column prop="pxh" label="序号"   width="50"></el-table-column>
                <el-table-column width="100" label="操作" v-if="isEdit" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" @click="goUpdateBqXjglXjmbXjx(false,scope.row)">编辑</el-button>
                        <el-button type="text" @click="deleteItemsBqXjglXjmbXjx(scope.row)">删除</el-button>
                    </template>
                </el-table-column>


                <!--<el-table-column prop="mbid" label="巡检模板id"   width="120"></el-table-column>-->

                <el-table-column prop="xjxlxLabel" label="巡检项类型" align="center"  width="90"></el-table-column>

                <el-table-column prop="xjx" label="标准要求或感知项"   ></el-table-column>

                <!--<el-table-column prop="xjxlyid" label="巡检项来源id 感知信息项id 或者巡检对照项id"   width="120"></el-table-column>-->

                <el-table-column prop="sm" label="说明"   ></el-table-column>

                <!--<el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

                <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>-->

            </el-table>
        </div>

        <!-- 分页 -->
        <div class="map-pagination">
            <el-pagination
                    @size-change="handleBqXjglXjmbXjxSizeChange"
                    @current-change="handleBqXjglXjmbXjxCurrentChange"
                    :current-page="tableBqXjglXjmbXjx.curPageNum"
                    :page-sizes="commonUtils.paginationPageSize()"
                    :page-size="defaultSearchBqXjglXjmbXjx.params.pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="tableBqXjglXjmbXjx.total">
            </el-pagination>
        </div>


      <!-- 新增页弹窗 -->
        <div class="map-form">
            <el-dialog :title="formBqXjglXjmbXjxTitle"  width="80%" top="10Vh" v-if="dialogBqXjglXjmbXjxFormVisible"  :visible.sync="dialogBqXjglXjmbXjxFormVisible" append-to-body>
                <el-form :rules="formBqXjglXjmbXjxRules" ref="formBqXjglXjmbXjx" :model="formBqXjglXjmbXjx" :disabled=isBqXjglXjmbXjxDisabled class="clear dialog-form"  label-width="100px">

                    <el-form-item  class="w25" style="display: none;" prop="mbid" label="巡检模板id">
                        <el-input  v-model="formBqXjglXjmbXjx.mbid" :maxlength="32" type="hidden"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item  class="w25" prop="xjxlx" label="巡检项类型" >
                        <el-select v-model="formBqXjglXjmbXjx.xjxlx" disabled placeholder="请选择">
                            <el-option
                                v-for="item in dictsBqXjglXjmbXjx.xjxlx"
                                :key="item.value"
                                :label="item.text"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item   class="w25" prop="xjx" v-if="selectGzx" verify label="感知项" >
                        <el-input  v-model="formBqXjglXjmbXjx.xjx" :maxlength="64" class="input-popup-dialog" readonly v-on:click.native="getBqJcxxGzxxx"  autocomplete="off"></el-input>
                    </el-form-item>

                  <el-form-item   class="w25" prop="pxh"  verify label="序号" >
                    <el-input  v-model="formBqXjglXjmbXjx.pxh" :maxlength="11" @keyup.native="handleClick"   autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item   class="w100" prop="xjx" v-if="!selectGzx" verify label="标准和要求" >
                        <el-input  v-model="formBqXjglXjmbXjx.xjx" :maxlength="500" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item style="display: none;" class="w25" prop="xjxlyid" v-if="selectGzx" label="巡检项来源id">
                        <el-input type="hidden" v-model="formBqXjglXjmbXjx.xjxlyid" :maxlength="32"  autocomplete="off"></el-input>
                    </el-form-item>

                    <el-form-item   class="w100" prop="sm" label="说明" >
                        <el-input  v-model="formBqXjglXjmbXjx.sm" :maxlength="100" type="textarea" autocomplete="off"></el-input>
                    </el-form-item>

                  <el-form-item  class="w25" prop="createName" label="创建人">
                    <el-input  v-model="formBqXjglXjmbXjx.createName" :maxlength="64" :disabled="true" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item  class="w25" prop="createTime" label="创建时间" >
                    <el-date-picker
                      v-model="formBqXjglXjmbXjx.createTime" :disabled="true"
                      type="datetime" style="width:100%" :editable="false"
                    >
                    </el-date-picker>
                  </el-form-item>

                  <el-form-item  class="w25" prop="updateName" label="修改人">
                    <el-input  v-model="formBqXjglXjmbXjx.updateName" :maxlength="64" :disabled="true" autocomplete="off"></el-input>
                  </el-form-item>

                  <el-form-item  class="w25" prop="updateTime" label="修改时间" >
                    <el-date-picker
                      v-model="formBqXjglXjmbXjx.updateTime" :disabled="true"
                      type="datetime" style="width:100%" :editable="false"
                    >
                    </el-date-picker>
                  </el-form-item>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogBqXjglXjmbXjxFormVisible = false">关 闭</el-button>
                    <el-button type="primary" @click="saveBqXjglXjmbXjxForm" v-if="!isBqXjglXjmbXjxDisabled" >保 存</el-button>
                </div>
            </el-dialog>
        </div>
      <!--感知项弹窗-->
        <div class="map-form">
          <el-dialog title="选择标签感知项" width="80%" top="2Vh"  :visible.sync="dialogBqJcxxGzxxxVisible" append-to-body>
            <BqJcxxGzxxx v-if="dialogBqJcxxGzxxxVisible" :mbid="mb_id" :zclxbm="zclxbm" singleSlect="true" ref="BqJcxxGzxxx"></BqJcxxGzxxx>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogBqJcxxGzxxxVisible = false">关 闭</el-button>
              <el-button type="primary" @click="getSelectBqJcxxGzxxx()">确定</el-button>
            </div>
          </el-dialog>
        </div>
    </div>
</template>

<script>
    /**
     * 03 巡检模板巡检项子表
     * Created by Code Generator.
     *
     * @author :
     * @date :
     */
    import BqJcxxGzxxx from "@/views/sys/components/gzxxx/BqJcxxGzxxxForMb";
    export default {
        name: "BqXjglXjmbXjx",
        components:{BqJcxxGzxxx},
        props:["mbId","isEdit","zclxbm"],//mbId巡检模板ID，isEdit从模板页访问是要编辑还是查看。zclxbm: 资产类型编码
        data() {
            return {
                formBqXjglXjmbXjxTitle: "03 巡检模板巡检项子表",
                dialogBqXjglXjmbXjxFormVisible: false,//弹窗是否显示
                formBqXjglXjmbXjx: {},//表单数据
                formBqXjglXjmbXjxRules: {},//校验字段以及规则
                tableBqXjglXjmbXjx: {
                    tableData: [],
                    page: 1,
                    total: null,
                    curPageNum: 1
                },
                isBqXjglXjmbXjxDisabled: false,
                multipleSelectionBqXjglXjmbXjx: [],//多选时已选择的数据
                searchBqXjglXjmbXjxForm: {},
                defaultSearchBqXjglXjmbXjx: {
                    params: { page: 1, pageSize: 20,sorter:"pxh=asc"}
                },
                dictsBqXjglXjmbXjx:{},
                isRowClickBqXjglXjmbXjx:false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
                selectGzx:false,//选择感知项或标椎和要求
                dialogBqJcxxGzxxxVisible:false,//选择感知项弹窗是否显示
                mb_id:null,//模板ID
            }
        },
        methods: {
          //处理“序号”输入框键盘抬起事件，只准输入数字。
          handleClick(){
            this.formBqXjglXjmbXjx.pxh = this.formBqXjglXjmbXjx.pxh.replace(/[^\.\d]/g,'');
            this.formBqXjglXjmbXjx.pxh = this.formBqXjglXjmbXjx.pxh.replace('.','');
          },
          //选择感知项后获得数据
          getSelectBqJcxxGzxxx(){
            let gzxxxData = this.$refs.BqJcxxGzxxx.getJcxxGzxxxList();
            let gzxList = [];
            /*if (gzxxxData){
              this.$set(this.formBqXjglXjmbXjx,"xjx",gzxxxData[0].gzxxx);
              this.$set(this.formBqXjglXjmbXjx,"xjxlyid",gzxxxData[0].id);
              this.dialogBqJcxxGzxxxVisible =false;
              this.dialogBqXjglXjmbXjxFormVisible = true;//2020-02-03 添加此处用于选择感知信息项后显示编辑弹窗。
            }*/
            let numArr = this.getXh(this.tableBqXjglXjmbXjx.tableData, gzxxxData.length);

            // 保存感知项集合
            this.dialogBqJcxxGzxxxVisible =false;
            for (let i = 0; i < gzxxxData.length; i++) {
              let arr = {
                xjxlx: this.formBqXjglXjmbXjx.xjxlx,
                createTime: this.formBqXjglXjmbXjx.createTime,
                createName: this.formBqXjglXjmbXjx.createName,
                mbid: this.formBqXjglXjmbXjx.mbid
              }
              arr.xjx = gzxxxData[i].gzxxx;
              arr.xjxlyid = gzxxxData[i].id;
              arr.pxh = numArr[i];

              gzxList.push(arr);
            }
            this.saveBqXjglXjmbXjxList(gzxList);
          },
          //单选时点击选择框后选中(此方法参数由点击选择框事件返回)
          checkboxClickBqXjglXjmbXjx:function(selection,row){
              //clearSelection：用于多选表格，清空用户的选择
              //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selectio为一个数组，里面存放的为当前这一行的数据
              this.$refs.tableBqXjglXjmbXjx.clearSelection();
              //此时selection仍然有值 ，只是勾选状态不显示了。
              if (selection.length === 0) {
                return;
              }
              //这里将这行的状态又变为了勾选
              this.$refs.tableBqXjglXjmbXjx.toggleRowSelection(row, true);
          },
            //打开选择感知信息项弹窗
            getBqJcxxGzxxx(){
              this.dialogBqJcxxGzxxxVisible=true;
              this.mb_id=this.mbId;
            },
            //table单击行事件
            rowClickBqXjglXjmbXjx:function(row){
                this.$refs.tableBqXjglXjmbXjx.clearSelection();//设置列表单选
                // if (!this.isRowClickBqXjglXjmbXjx){
                    this.$refs.tableBqXjglXjmbXjx.toggleRowSelection(row)//切换选中
                // }else {
                //     this.isRowClickBqXjglXjmbXjx=false
                // }
                //其他行点击事件逻辑
            },
            //重置
            resertBqXjglXjmbXjxSearch() {
                this.searchBqXjglXjmbXjxForm = {}
                delete this.defaultSearchBqXjglXjmbXjx.params.filter//移除对象的某个属性
                this.getListBqXjglXjmbXjx(1)
            },
            //切换每页页数
            handleBqXjglXjmbXjxSizeChange(val) {
                this.defaultSearchBqXjglXjmbXjx.params.pageSize = val
                this.getListBqXjglXjmbXjx(1)
            },
            //切换当前页码
            handleBqXjglXjmbXjxCurrentChange(val) {
                this.getListBqXjglXjmbXjx(val)
            },
            //打开新增
            goAddBqXjglXjmbXjx(isSelectGzx) {
                this.$refs.tableBqXjglXjmbXjx.clearSelection();
                if (isSelectGzx){
                  this.formBqXjglXjmbXjxTitle="新增标签感知项";
                  this.dialogBqJcxxGzxxxVisible=true;//2020-02-03 2020-02-03 添加此处用于选择感知信息项后显示编辑弹窗。。
                  this.mb_id=this.mbId;//2020-02-03 2020-02-03 添加此处用于选择感知信息项后显示编辑弹窗。。
                }else{
                  this.formBqXjglXjmbXjxTitle="新增编辑标准和要求";
                }
              let userDetail=JSON.parse(localStorage.getItem("userDetail"));
              this.formBqXjglXjmbXjx = {}
              this.formBqXjglXjmbXjx = {mbid:this.mbId,createName:userDetail.realname,createTime: new Date(),xjxlx:(isSelectGzx?"GZX":"BZHYQ")}
              this.dialogBqXjglXjmbXjxFormVisible = isSelectGzx?false:true;
              this.isBqXjglXjmbXjxDisabled=false
              this.selectGzx=isSelectGzx
            },
            //保存
            saveBqXjglXjmbXjxForm() {
                let _self = this
                if (!_self.commonUtils.checkForm('formBqXjglXjmbXjx',_self)) {return false}//表单校验
                _self.request.saveWithNoMessage(
                    {
                        url: _self.formBqXjglXjmbXjx.xjxlx=="BZHYQ"?'bqXjglXjmbXjx/checkBzhyq':'bqXjglXjmbXjx',
                        data:  _self.formBqXjglXjmbXjx
                    }
                )
                    .then((response) => {
                      if (response.data.result=="BZHYQ_FAIL"){
                        _self.$message({
                          type: 'warning',
                          message: response.data.message
                        });
                      }else{
                        //保存后自动将后台信息填充到表单
                        _self.formBqXjglXjmbXjx=response.data.result
                        _self.$message({
                          type: 'success',
                          message: response.data.message
                        });
                        //2020-02-04 保存后添加判断改变弹窗标题名称。
                        if (_self.selectGzx){
                          _self.formBqXjglXjmbXjxTitle="编辑标签感知项";
                        }else{
                          _self.formBqXjglXjmbXjxTitle="编辑标准和要求";
                        }
                        _self.getListBqXjglXjmbXjx(1);
                      }
                    })
            },

            // 保存感知项集合
            saveBqXjglXjmbXjxList(list) {
              let _self = this
              _self.request.post(
                  {
                    url: 'bqXjglXjmbXjx/saveList',
                    data: list
                  }
              ).then(() => {
                _self.getListBqXjglXjmbXjx(1);
              })
            },
            //删除数据
            deleteItemsBqXjglXjmbXjx(row) {
                let _self = this
                _self.isRowClickBqXjglXjmbXjx=true;
              // if (_self.multipleSelectionBqXjglXjmbXjx.length === 0) {
                //     this.commonUtils.message("请至少选择一条再删除");
                //     return false;
                // }
                // let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqXjglXjmbXjx);
                return  this.$confirm('此操作将永久删除已选中的该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _self.request.delete(
                        {
                            url: 'bqXjglXjmbXjx',
                            data: [row.id]
                        }
                    ).then(function (response) {
                        //删除完成后需要执行的方法
                        _self.getListBqXjglXjmbXjx(1)
                    })
                }).catch(() => {
                    _self.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            },
            //获取一条
            getOneBqXjglXjmbXjx(id) {
                let _self = this
                return _self.request.getOne(
                    {
                        url:'bqXjglXjmbXjx/'+ id
                    }
                ).then(function (response) {
                    _self.formBqXjglXjmbXjx = response.data.result
                })
            },
            //修改或者查看页
            goUpdateBqXjglXjmbXjx(isBqXjglXjmbXjxDisabled,rowData) {
                let _self=this
                this.isRowClickBqXjglXjmbXjx=true
                this.formBqXjglXjmbXjx = {}
                this.getOneBqXjglXjmbXjx(rowData.id).then(
                    function () {
                      //2020-02-04 注释掉此方法，编辑时不自动填入修改任何时间，由后台修改表时自动完成。
                      // if(!isBqXjglXjmbXjxDisabled){
                      //   let userDetail=JSON.parse(localStorage.getItem("userDetail"));
                      //   _self.formBqXjglXjmbXjx.updateName = userDetail.realname;
                      //   _self.formBqXjglXjmbXjx.updateTime = new Date();
                      // }
                      if (rowData.xjxlx=="GZX"){
                        _self.formBqXjglXjmbXjxTitle="编辑标签感知项";
                        _self.selectGzx=true
                      }else if(rowData.xjxlx=="BZHYQ"){
                        _self.formBqXjglXjmbXjxTitle="编辑标准和要求";
                        _self.selectGzx=false
                      }
                      _self.dialogBqXjglXjmbXjxFormVisible = true
                    }
                )
                this.isBqXjglXjmbXjxDisabled = isBqXjglXjmbXjxDisabled
            },
            handleBqXjglXjmbXjxSelectionChange(val) {
                this.multipleSelectionBqXjglXjmbXjx = val;
            },
            //获取列表
            getListBqXjglXjmbXjx(page) {
                let _self = this
                let filter = _self.commonUtils.getDefaultFilter(_self.searchBqXjglXjmbXjxForm)//拼接查询条件
                if (_self.mbId){
                  filter+=('&mbid_eq='+_self.mbId);
                }
                _self.defaultSearchBqXjglXjmbXjx.params.filter = filter
                _self.defaultSearchBqXjglXjmbXjx.params.page = page
                //请求到后台
                _self.request.getList(
                    {
                        url:'bqXjglXjmbXjx',
                        params: _self.defaultSearchBqXjglXjmbXjx.params
                    }
                ).then(function (response) {
                    _self.tableBqXjglXjmbXjx.tableData = response.data.result.records
                    _self.tableBqXjglXjmbXjx.total = response.data.result.total
                    _self.tableBqXjglXjmbXjx.curPageNum = page
                    let dicts = response.data.result.dicts;//下拉注释
                    _self.commonUtils.translateDicts(dicts, _self.tableBqXjglXjmbXjx, _self.dictsBqXjglXjmbXjx)
                })
            },
          /**
           * 生成序号
           * @param list 原有的数据
           * @param size 新增加数据的数量
           */
          getXh(list, size) {
            let numArr = [];
            if (list.length > 0) {
              for (let i = 1; i < size + 1; i++) {
                numArr.push(list[list.length - 1].pxh + i)
              }
            } else {
              for (let i = 1; i < size + 1; i++) {
                numArr.push(i)
              }
            }
            return numArr;
          }
        },
        //页面加载完成时执行
        mounted() {
            this.getListBqXjglXjmbXjx(1)
        },
        watch:{
            multipleSelectionBqXjglXjmbXjx(){
                this.commonUtils.toggleSelectTrStyle(this)
            }
        }
    }
</script>


