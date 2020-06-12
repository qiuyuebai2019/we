<template>
  <div>
    <el-container>
      <el-header height="140">
        <div>
          <el-form :rules="formBqZcpdPdjgmxRules" ref="formBqZcpdPdjgmx" :model="formBqZcpdPdjgmx"
                   class="clear dialog-form" label-width="130px" :disabled="true">
            <el-form-item class="w25" prop="pdbh" label="盘点编号">
              <el-input v-model="formBqZcpdPdjgmx.pdbh" :maxlength="64" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item class="w25" prop="jhdh" label="计划单号" v-if="formBqZcpdPdjgmx.pdlx==='ZD'">
              <el-input v-model="formBqZcpdPdjgmx.jhdh" readonly :maxlength="64" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item verify class="w25" prop="bqywlxmc" label-width="110px" label="标签业务类型">
              <el-input
                readonly
                class="input-popup-dialog"
                v-model="formBqZcpdPdjgmx.bqywlxmc"
                :maxlength="64"
                autocomplete="off"
              ></el-input>
            </el-form-item>

            <el-form-item verify class="w25" prop="pdlx" label="盘点类型">
              <el-select v-model="formBqZcpdPdjgmx.pdlx" placeholder="请选择" :disabled="true">
                <el-option v-for="item in dictsBqZcpdPdjgmx.pdlx" :key="item.value" :label="item.text"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="w25" prop="pdzt" label="盘点状态">
              <el-select v-model="formBqZcpdPdjgmx.pdzt" placeholder="请选择" :disabled="true">
                <el-option v-for="item in dictsBqZcpdPdjgmx.pdzt" :key="item.value" :label="item.text"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="w25" prop="ssdwmc" label="所属单位">
              <el-select v-model="formBqZcpdPdjgmx.ssdwId" placeholder="请选择">
                <el-option v-for="item in dictsBqZcpdPdjgmx.ssdwId" :key="item.value" :label="item.text"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="w25" prop="qy" label="班組工区">
              <!-- <el-input v-model="formBqZcpdPdjg.qy" :maxlength="64" autocomplete="off"></el-input> -->
              <el-select v-model="formBqZcpdPdjgmx.qy" placeholder="请选择">
                <el-option v-for="item in dictsBqZcpdPdjgmx.qy" :key="item.value" :label="item.text"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="w25" prop="zclxmc" label="资产类型">
              <el-select v-model="formBqZcpdPdjgmx.zclxbm" placeholder="请选择">
                <el-option v-for="item in dictsBqZcpdPdjgmx.zclxbm" :key="item.value" :label="item.text"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="w25" prop="pdr" label="盘点人">
              <el-input v-model="formBqZcpdPdjgmx.pdr" :maxlength="64" autocomplete="off" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item verify class="w25" prop="pdrq" label="盘点日期">
              <el-date-picker v-model="formBqZcpdPdjgmx.pdrq" type="datetime" style="width:100%"
                              :editable="false"></el-date-picker>
            </el-form-item>

            <el-form-item can-be-empty class="w25" prop="pdsx" label="监听周期" int>
              <el-input v-model="formBqZcpdPdjgmx.pdsx" autocomplete="off">
                <template slot="append">
                  （秒）
                </template>
              </el-input>
            </el-form-item>

            <el-form-item class="w50" prop="bz" label="备注">
              <el-input v-model="formBqZcpdPdjgmx.bz" :maxlength="500" type="input" autocomplete="off"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <el-col :span="14" style="margin-left: 623px">
          <el-alert
            v-if="isAlert"
            :title="infoTitle"
            type="info"
            show-icon>
          </el-alert>
        </el-col>
      </el-header>

      <!--盘点资产明细列表-->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="盘点明细" name="pdmx" style="overflow-y:auto;overflow-x:hidden;">
          <el-container>
            <el-aside :style="asideWidth">

              <!-- 查询条件-->
              <el-container>
                <el-main>
                  <div class="home-search-bar">
                    <el-form :inline="true" :model="searchBqZcpdPdjgmxForm" class="demo-form-inline">
                      <el-form-item label="设备ID">
                        <el-input v-model="searchBqZcpdPdjgmxForm.rfid" placeholder="设备ID"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-main>
                <el-aside>
                  <div class="map-right-title">
                    <el-button type="primary" @click="contrast" v-if="bdxs">比 对</el-button>
                    <el-button type="primary" @click="getListBqZcpdPdjgmx(1)">查 询</el-button>
                    <el-button type="primary" @click="resertBqZcpdPdjgmxSearch">重 置</el-button>
                  </div>
                </el-aside>
              </el-container>

              <!-- 表格 -->
              <div class="map-table">
                <el-table
                  ref="tableBqZcpdPdjgmx"
                  @row-click="rowClickBqZcpdPdjgmx"
                  :data="tableBqZcpdPdjgmx.tableData"
                  :height="tableHeight2"
                  @selection-change="handleBqZcpdPdjgmxSelectionChange"
                  tooltip-effect="dark"
                  stripe
                  border
                >
                  <el-table-column type="selection" width="35" v-if="bdxs"></el-table-column>
                  <el-table-column type="index" align="center" label="#" :width="constant.common.TABLE_INDEX_WIDTH">
                    <template slot-scope="scope">
                      <span>{{ commonUtils.getTableIndex(tableBqZcpdPdjgmx.curPageNum, defaultSearchBqZcpdPdjgmx.params.pageSize, scope.$index) }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column width="150" label="操作" align="center" v-if="pdjgckDatas.pdzt==='PDWC'">
                    <template slot-scope="scope">
                      <el-button type="text" @click="goUpdateBqZcpdPdjgmx(true, scope.row)">查看</el-button>
                      <el-button type="text" @click="goLssj( scope.row)">盘点信息</el-button>
                    </template>
                  </el-table-column>

                  <el-table-column prop="rfid" label="设备ID" width="200"></el-table-column>

                  <el-table-column prop="zcmc" label="资产名称" width="230"></el-table-column>

                  <el-table-column prop="sl" label="数量" width="150"></el-table-column>
                </el-table>
              </div>

              <!-- 分页 -->
              <div class="map-pagination">
                <el-pagination
                  @size-change="handleBqZcpdPdjgmxSizeChange"
                  @current-change="handleBqZcpdPdjgmxCurrentChange"
                  :current-page="tableBqZcpdPdjgmx.curPageNum"
                  :page-sizes="commonUtils.paginationPageSize()"
                  :page-size="defaultSearchBqZcpdPdjgmx.params.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="tableBqZcpdPdjgmx.total"
                ></el-pagination>
              </div>
            </el-aside>

            <el-main style="height: 20%" v-if="pdjgckDatas.pdzt==='PDWC'">
              <!-- 盘点结果查看饼状图 -->
              <div class="map-form">
                <PdjgckPie :pdjgckData="pdjgckData" :legendData="legendData"></PdjgckPie>
              </div>
            </el-main>

          </el-container>
        </el-tab-pane>

        <el-tab-pane label="地图信息" name="dtxx" style="overflow-y:auto;overflow-x:hidden;">
          <BaiduPdjgMap v-if="isBaiduPdjgMap" :pdjgId="pdjgId"></BaiduPdjgMap>
        </el-tab-pane>
      </el-tabs>
    </el-container>

    <!-- 比对信息 弹窗 -->
    <div class="map-form">
      <el-dialog title="比对信息" width="80%" top="9Vh" :visible.sync="dialogCompareInformationVisible" append-to-body>
        <BqZctzCompare
          :rfidArrayForZcztxxLssjCompareLineStack="rfidArrayForZcztxxLssjCompareLineStack"
          :zcmcArrayForZcztxxLssjCompareLineStack="zcmcArrayForZcztxxLssjCompareLineStack"
          :pdrq="pdrq"
          :pdsx="pdsx"
          v-if="dialogCompareInformationVisible" ref="ZcztxxLssjCompareLineStack"
        ></BqZctzCompare>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCompareInformationVisible = false">关 闭</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 引入详情信息 内涵 设备信息、标签信息、等5个组件 -->
    <el-dialog title="资产详情" width="85%" top="2Vh" :visible.sync="dialogBqZctzTzxxlFormVisible"
               v-if="dialogBqZctzTzxxlFormVisible" append-to-body>
      <BqZctzXqxx @closeDialog="closeDialog" :rfid="rfid" :isXqxxDisabled="isXqxxDisabled"
                  openFromType="PDJG"></BqZctzXqxx>
    </el-dialog>

    <el-dialog title="历史数据" width="85%" top="2Vh" :visible.sync="dialogBqZctzLssjlFormVisible"
               v-if="dialogBqZctzLssjlFormVisible" append-to-body>
      <bqCjxxglLssj :rfid="rfid" :zcmc="zcmc" :pdsj="pdsj" :sfqy="sfqy"></bqCjxxglLssj>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBqZctzLssjlFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
  /**
   * Created by Code Generator.
   * Author: qindonghui
   * Date: Thu Dec 12 2019 12:04:05 GMT+0800 (GMT+08:00)
   * 3盘点结果明细表
   */
  import BaiduPdjgMap from "../../../zxpd/pdjg/BaiduPdjgMap";//地图
  import bqCjxxglLssj from "@/views/cjxxgl/lssj/BqCjxxglLssj"//历史数据
  import BqZctzXqxx from '@/views/zctz/tzxx/BqZctzXqxx';//资产信息tab页
  import PdjgckPie from '@/views/sys/components/pdjgck/PdjgckPie'; //盘点结果查看饼状图
  import BqZctzCompare from "./PdjgckCompare";

  export default {
    name: 'BqZcpdPdjgmx',
    props: ['pdjgId', 'pdjgckDatas', 'pdjgData', 'infoTitle', 'isAlert'],
    components: {PdjgckPie, BqZctzXqxx, bqCjxxglLssj, BaiduPdjgMap, BqZctzCompare},
    data() {
      return {
        bdxs: false,//显示比对按钮
        pdrq: "",//盘点日期
        pdsx: "",//盘点时限
        gzxxxbm: null,//感知信息项编码
        rfidArrayForZcztxxLssjCompareLineStack: [],//rfid数组
        zcmcArrayForZcztxxLssjCompareLineStack: [],//zcmc数组
        dialogCompareInformationVisible: false,
        formBqZcpdPdjgmxTitle: '盘点结果明细表',
        dialogBqZcpdPdjgmxFormVisible: false, //弹窗是否显示
        formBqZcpdPdjgmx: {}, //表单数据
        formBqZcpdPdjgmxRules: {}, //校验字段以及规则
        tableBqZcpdPdjgmx: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isBqZcpdPdjgmxDisabled: false,
        multipleSelectionBqZcpdPdjgmx: [], //多选时已选择的数据
        searchBqZcpdPdjgmxForm: {},
        defaultSearchBqZcpdPdjgmx: {
          params: {page: 1, pageSize: 20, sorter: 'createTime=desc'}
        },
        dictsBqZcpdPdjgmx: {},
        isRowClickBqZcpdPdjgmx: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
        pdjgckData: [],
        legendData: [],
        dialogBqZctzTzxxlFormVisible: false,//资产详情是否显示
        isXqxxDisabled: false,//传值 显示或者隐藏保存按钮
        rfid: '',//传值到资产详情tab页
        dialogBqZctzLssjlFormVisible: false,//历史数据弹窗是否显示
        zcmc: '',//资产名称
        pdsj: [],//传入历史数据的查询条件
        sfqy: '1',//历史数据是否启用
        asideWidth: 'width:65%',
        isBaiduPdjgMap: false,
        activeName: 'pdmx',
      };
    },
    methods: {
      //获取选择的rfids
      getTableDataRfidArr(data) {
        let rfids = [];
        for (let i = 0; i < data.length; i++) {
          rfids.push(data[i].rfid)
        }
        return rfids
      },
      //获取选择的zcmcs
      getTableDataZcmcArr(data) {
        let zcmcs = [];
        for (let i = 0; i < data.length; i++) {
          zcmcs.push(data[i].zcmc)
        }
        return zcmcs
      },
      //点击“比对”后进行的操作
      contrast() {
        let _self = this;
        if (_self.multipleSelectionBqZcpdPdjgmx.length < 2) {
          this.commonUtils.message('请至少选择两条进行比对');
          return false;
        }
        _self.pdrq = _self.formBqZcpdPdjgmx.pdrq
        _self.pdsx = _self.formBqZcpdPdjgmx.pdsx
        _self.dialogCompareInformationVisible = true
        let rfids = _self.getTableDataRfidArr(_self.multipleSelectionBqZcpdPdjgmx);
        let zcmcs = _self.getTableDataZcmcArr(_self.multipleSelectionBqZcpdPdjgmx);
        _self.rfidArrayForZcztxxLssjCompareLineStack = [];//先置空，消除之前可能遗留的数据
        _self.zcmcArrayForZcztxxLssjCompareLineStack = [];//先置空，消除之前可能遗留的数据
        if (rfids.length > 0) {
          for (let i = 0; i < rfids.length; i++) {
            _self.rfidArrayForZcztxxLssjCompareLineStack.push(rfids[i]);
            _self.zcmcArrayForZcztxxLssjCompareLineStack.push(zcmcs[i]);
          }
        }
        _self.dialogCompareInformationVisible = true;
      },

      closeBaiduPdjgMap() {
        debugger
        this.isBaiduPdjgMap = false
      },
      handleClick(tab) {
        let _self = this
        if (tab.name === 'pdmx') {
          _self.activeName = 'pdmx'
        } else if (tab.name === 'dtxx') {
          _self.activeName = 'dtxx'
          _self.isBaiduPdjgMap = true
        }
      },
      goLssj(row) {
        this.rfid = row.rfid
        this.zcmc = row.zcmc
        let pdrq = this.formBqZcpdPdjgmx.pdrq
        let pdzq = this.formBqZcpdPdjgmx.pdsx
        let pdjsrq = new Date(pdrq);
        pdjsrq.setSeconds(pdjsrq.getSeconds() + pdzq)
        pdrq = this.commonUtils.formatDateNormal(pdrq)
        pdjsrq = this.commonUtils.formatDateNormal(pdjsrq)
        pdrq = new Date(pdrq)
        pdjsrq = new Date(pdjsrq)
        this.pdsj = [pdrq, pdjsrq]//统计出盘点日期和监听周期 算出盘点结束时间 传入历史数据的查询条件里
        this.dialogBqZctzLssjlFormVisible = true
      },
      closeDialog(val) {
        this.dialogBqZctzTzxxlFormVisible = false
        this.getListBqZcpdPdjgmx(1);
        if (this.pdjgckDatas != null) {
          this.formBqZcpdPdjgmx.pdbh = this.pdjgckDatas.pdbh
          this.formBqZcpdPdjgmx.jhdh = this.pdjgckDatas.jhdh
          this.formBqZcpdPdjgmx.pdlx = this.pdjgckDatas.pdlx
          this.formBqZcpdPdjgmx.pdzt = this.pdjgckDatas.pdzt
          this.formBqZcpdPdjgmx.ssdwId = this.pdjgckDatas.ssdwId
          this.formBqZcpdPdjgmx.qy = this.pdjgckDatas.qy
          this.formBqZcpdPdjgmx.zclxbm = this.pdjgckDatas.zclxbm
          this.formBqZcpdPdjgmx.pdr = this.pdjgckDatas.pdr
          this.formBqZcpdPdjgmx.pdrq = this.pdjgckDatas.pdrq
          this.formBqZcpdPdjgmx.bz = this.pdjgckDatas.bz
        }
      },
      //table单击行事件
      rowClickBqZcpdPdjgmx: function (row) {
        if (!this.isRowClickBqZcpdPdjgmx) {
          this.$refs.tableBqZcpdPdjgmx.toggleRowSelection(row); //切换选中
        } else {
          this.isRowClickBqZcpdPdjgmx = false;
        }
        //其他行点击事件逻辑
      },
      //重置
      resertBqZcpdPdjgmxSearch() {
        this.searchBqZcpdPdjgmxForm = {};
        delete this.defaultSearchBqZcpdPdjgmx.params.filter; //移除对象的某个属性
        this.getListBqZcpdPdjgmx(1);
      },
      //切换每页页数
      handleBqZcpdPdjgmxSizeChange(val) {
        this.defaultSearchBqZcpdPdjgmx.params.pageSize = val;
        this.getListBqZcpdPdjgmx(1);
      },
      //切换当前页码
      handleBqZcpdPdjgmxCurrentChange(val) {
        this.getListBqZcpdPdjgmx(val);
      },
      //打开新增
      goAddBqZcpdPdjgmx() {
        this.formBqZcpdPdjgmx = {};
        this.dialogBqZcpdPdjgmxFormVisible = true;
        this.isBqZcpdPdjgmxDisabled = false;
      },
      //保存
      saveBqZcpdPdjgmxForm() {
        let _self = this;
        _self.formBqZcpdPdjgmx.pdjgId = _self.pdjgId;
        _self.formBqZcpdPdjgmx.sbjlId = '123';
        if (!_self.commonUtils.checkForm('formBqZcpdPdjgmx', _self)) {
          return false;
        } //表单校验
        _self.request
          .save({
            url: 'bqZcpdPdjgmx',
            data: _self.formBqZcpdPdjgmx
          })
          .then(response => {
            //保存后自动将后台信息填充到表单
            _self.formBqZcpdPdjgmx = response.data.result;
            _self.getListBqZcpdPdjgmx(1);
          });
      },
      //删除数据
      deleteItemsBqZcpdPdjgmx() {
        let _self = this;
        if (_self.multipleSelectionBqZcpdPdjgmx.length === 0) {
          this.commonUtils.message('请至少选择一条再删除');
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqZcpdPdjgmx);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionBqZcpdPdjgmx.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            _self.request
              .delete({
                url: 'bqZcpdPdjgmx',
                data: ids
              })
              .then(function (response) {
                //删除完成后需要执行的方法
                _self.getListBqZcpdPdjgmx(1);
              });
          })
          .catch(() => {
            _self.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      //获取一条
      getOneBqZcpdPdjgmx(id) {
        let _self = this;
        return _self.request
          .getOne({
            url: 'bqZcpdPdjgmx/' + id
          })
          .then(function (response) {
            _self.formBqZcpdPdjgmx = response.data.result;
          });
      },
      //修改或者查看页
      goUpdateBqZcpdPdjgmx(isBqZcpdPdjgmxDisabled, rowData) {
        let _self = this;
        _self.rfid = rowData.rfid
        _self.isXqxxDisabled = true
        _self.dialogBqZctzTzxxlFormVisible = true

      },
      handleBqZcpdPdjgmxSelectionChange(val) {
        this.multipleSelectionBqZcpdPdjgmx = val;
      },
      //查询结果信息
      getPdjgslList() {
        let _self = this;
        _self.request
          .getList({
            url: 'bqZcpdPdjgmx/getPdjgslList/' + _self.pdjgId
          })
          .then(function (response) {
            let resultValue = response.data.result;
            for (let i = 0; i < resultValue.length; i++) {
              _self.legendData.push(resultValue[i].name);
              _self.pdjgckData.push({value: resultValue[i].value, name: resultValue[i].name});
            }
          });
      },
      //查询结果信息
      getListBqZcpdPdjgmx(page) {
        let _self = this;
        let filter = _self.commonUtils.getDefaultFilter(_self.searchBqZcpdPdjgmxForm); //拼接查询条件
        filter += '&pdjgId=' + _self.pdjgId
        _self.defaultSearchBqZcpdPdjgmx.params.filter = filter;
        _self.defaultSearchBqZcpdPdjgmx.params.page = page;
        _self.request
          .getList({
            url: 'bqZcpdPdjgmx',
            params: _self.defaultSearchBqZcpdPdjgmx.params
          })
          .then(function (response) {
            _self.tableBqZcpdPdjgmx.tableData = response.data.result.records;
            _self.tableBqZcpdPdjgmx.total = response.data.result.total;
            _self.tableBqZcpdPdjgmx.curPageNum = page;
            let dicts = response.data.result.dicts; //下拉注释
            _self.commonUtils.translateDicts(dicts, _self.tableBqZcpdPdjgmx, _self.dictsBqZcpdPdjgmx);
          });
      },
    },
    //页面加载完成时执行
    mounted() {
      this.getListBqZcpdPdjgmx(1);
      if (this.pdjgckDatas != null) {
        this.formBqZcpdPdjgmx = this.pdjgckDatas
        this.formBqZcpdPdjgmx.pdbh = this.pdjgckDatas.pdbh
        this.formBqZcpdPdjgmx.jhdh = this.pdjgckDatas.jhdh
        this.formBqZcpdPdjgmx.pdlx = this.pdjgckDatas.pdlx
        this.formBqZcpdPdjgmx.pdzt = this.pdjgckDatas.pdzt
        this.formBqZcpdPdjgmx.ssdwId = this.pdjgckDatas.ssdwId
        this.formBqZcpdPdjgmx.qy = this.pdjgckDatas.qy
        this.formBqZcpdPdjgmx.zclxbm = this.pdjgckDatas.zclxbm
        this.formBqZcpdPdjgmx.pdr = this.pdjgckDatas.pdr
        this.formBqZcpdPdjgmx.pdrq = this.pdjgckDatas.pdrq
        this.formBqZcpdPdjgmx.bz = this.pdjgckDatas.bz
        this.formBqZcpdPdjgmx.bqywlxmc = this.pdjgckDatas.bqywlxmc
        this.formBqZcpdPdjgmx.pdsx = this.pdjgckDatas.pdsx
      }
      if (this.pdjgckDatas.pdzt !== 'PDWC') {
        this.asideWidth = 'width:100%'
        this.bdxs = false
      } else {
        this.asideWidth = 'width:65%'
        this.bdxs = true
      }
      this.getPdjgslList();
    },
    watch: {
      multipleSelectionBqZcpdPdjgmx() {
        this.commonUtils.toggleSelectTrStyle(this);
      },

      pdjgId: function (val) {
        if (val != null && val != undefined) {
          this.getListBqZcpdPdjgmx(1);
        }
      },

    }
  };
</script>
