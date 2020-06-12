<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqBqglBqxxForm" class="clear">
        <el-form-item class="w25" label="设备ID"><el-input v-model="searchBqBqglBqxxForm.rfid" placeholder="设备ID"></el-input></el-form-item>

        <el-form-item class="w25" label="资产名称"><el-input v-model="searchBqBqglBqxxForm.zcmc" placeholder="资产名称"></el-input></el-form-item>

        <el-form-item class="w25" label="所属单位" v-if="openZcztListType != 'clickHomePageDashBoardPieQyJL'">
          <el-select v-model="searchBqBqglBqxxForm.ssdwId" placeholder="请选择">
            <el-option v-for="item in dictsBqBqglBqxx.ssdwmc" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="标签业务类型">
          <el-select v-model="searchBqBqglBqxxForm.bqywlxbm" placeholder="请选择">
            <el-option v-for="item in dictsBqBqglBqxx.bqywlxbm" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="资产类型" v-if="openZcztListType!='clickHomePageDashBoardZclxChart'">
            <el-select v-model="searchBqBqglBqxxForm.zclxbm" placeholder="请选择">
              <el-option v-for="item in dictsBqBqglBqxx.zclxbm" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>

        <el-form-item class="w25" label="状态" v-if="openZcztListType!='clickHomePageDashBoardZcztChart'">
          <el-select v-model="searchBqBqglBqxxForm.zt" placeholder="请选择">
            <el-option v-for="item in dictsBqBqglBqxx.zt" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col>
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqBqglBqxx(1)" size="small">查询</el-button>
            <el-button type="primary" @click="resertBqBqglBqxxSearch" size="small">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table
        ref="tableBqBqglBqxx"
        @row-click="rowClickBqBqglBqxx"
        :data="tableBqBqglBqxx.tableData"
        :height="tableHeight"
        @selection-change="handleBqBqglBqxxSelectionChange"
        tooltip-effect="dark"
        stripe
        border
      >

          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{ commonUtils.getTableIndex(tableBqBqglBqxx.curPageNum, defaultSearchBqBqglBqxx.params.pageSize, scope.$index) }}</span>
          </template>
        </el-table-column>
        <el-table-column width="70" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateBqBqglBqxx(true, scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="zcmc" label="资产名称" width="180"></el-table-column>

        <el-table-column prop="rfid" label="设备ID" width="200"></el-table-column>

        <el-table-column prop="zclxmc" label="资产类型" width="120" align="center"></el-table-column>

        <el-table-column prop="bqywlxbmLabel" label="标签业务类型" width="180" align="center"></el-table-column>

        <el-table-column prop="ztLabel" label="状态" width="80" align="center"></el-table-column>

        <el-table-column prop="hqsbsj" label="上报时间" width="180" align="center" :formatter="commonUtils.formatDate"></el-table-column>

        <el-table-column prop="ssdwmc" label="所属单位" width="120"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqBqglBqxxSizeChange"
        @current-change="handleBqBqglBqxxCurrentChange"
        :current-page="tableBqBqglBqxx.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqBqglBqxx.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqBqglBqxx.total"
      ></el-pagination>
    </div>

    <div class="map-form">
      <!-- 引入详情信息 内涵 设备信息、标签信息、等5个组件 -->
      <el-dialog :title="formBqxxTitle"  width="85%" top="2Vh"  :visible.sync="dialogBqZctzTzxxlFormVisible" v-if="dialogBqZctzTzxxlFormVisible" append-to-body >
        <bqZctzXqxx @closeDialog="closeDialog"   :zcid="zcid" :rfid="rfid" :kbqdid="kbqdid"  :isXqxxDisabled="isXqxxDisabled" :kbmc="kbmc"  :zcmc="zcmc" openFromType="BQXX"></bqZctzXqxx>
      </el-dialog>
    </div>

    <!-- 资产台账设备选择弹窗 -->
    <div class="map-form">
      <el-dialog title="选择资产设备" width="80%" top="2Vh" style="margin-right: -1%;" :visible.sync="dialogBqZctzTzxxSelectVisible" append-to-body  v-if="dialogBqZctzTzxxSelectVisible">
        <BqZctzTzxxSelect ref="BqZctzTzxxSelect" singleSelect="Y" filterSql="BQXZSB"></BqZctzTzxxSelect>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBqZctzTzxxSelectVisible = false">关 闭</el-button>
          <el-button type="primary" @click="getZctzTzxxSelec()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>

import bqZctzXqxx from "@/views/zctz/tzxx/BqZctzXqxx"//详情信息  存放五个组件
export default {
  name: 'ZcztInHomePageDashBoard',
  components: { bqZctzXqxx},
  props: ['openZcztListType','zt','ssqybm','zclxbm','gldwByJL'],//主子表注释 相当于这个组件的入参
  data() {
    return {
      formBqBqglBqxx: {}, //表单数据
      tableBqBqglBqxx: {
        tableData: [],
        page: 1,
        total: null,
        curPageNum: 1
      },
      isBqBqglBqxxDisabled: false,
      multipleSelectionBqBqglBqxx: [], //多选时已选择的数据
      searchBqBqglBqxxForm: {},
      defaultSearchBqBqglBqxx: {
        params: { page: 1, pageSize: 20, sorter: 'createTime=desc' }
      },
      dictsBqBqglBqxx: {}, //下拉对象
      isRowClickBqBqglBqxx: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      bcShow: false, //编辑查看时保存按钮的控制状态
      dialogBqJcxxYwlxVisible: false, //控制标签业务类型选择弹窗打开关闭
      dialogBqZctzTzxxSelectVisible: false, //控制资产台账设备选择弹窗打开关闭
      TzxxSelectShow: 0, //区分资产ID是表单属性或搜索框属性
      TzxxSelect: {}, //接收资产台账设备对象
      kbmc:'',//库表名称（新增/编辑 标签信息 时，选择资产时，自动带回库表名称）
      kbqdid:'',//库表清单ID（新增/编辑 标签信息 时，选择资产时，自动带回库表清单ID）
      formBqxxTitle:'', // 五联页面标签信息编辑时候的标题
      dialogBqZctzTzxxlFormVisible:false,// 五联页面是否显示
      zcid:'',//// 五联页面 入参资产id
      zcmc:'',//// 五联页面 入参资产名称
      rfid:'',//// 五联页面 入参 rfid
      isXqxxDisabled:'',//五联详情标签页面是否只读
    };
  },
  methods: {
    //关闭方法
    closeDialog(val) {
      this.dialogBqZctzTzxxlFormVisible = false
      this.getListBqBqglBqxx(1)
    },
    //table单击行事件
    rowClickBqBqglBqxx: function(row) {
      if (!this.isRowClickBqBqglBqxx) {
        this.$refs.tableBqBqglBqxx.toggleRowSelection(row); //切换选中
      } else {
        this.isRowClickBqBqglBqxx = false;
      }
      //其他行点击事件逻辑
    },
    //重置
    resertBqBqglBqxxSearch() {
      this.searchBqBqglBqxxForm = {};
      delete this.defaultSearchBqBqglBqxx.params.filter; //移除对象的某个属性
      this.getListBqBqglBqxx(1);
    },
    //切换每页页数
    handleBqBqglBqxxSizeChange(val) {
      this.defaultSearchBqBqglBqxx.params.pageSize = val;
      this.getListBqBqglBqxx(1);
    },
    //切换当前页码
    handleBqBqglBqxxCurrentChange(val) {
      this.getListBqBqglBqxx(val);
    },
    //获取一条
    getOneBqBqglBqxx(id) {
      let _self = this;
      return _self.request
        .getOne({
          url: 'bqBqglBqxx/' + id
        })
        .then(function(response) {
          _self.formBqBqglBqxx = response.data.result;
        });
    },
    //修改或者查看页
    goUpdateBqBqglBqxx(isBqBqglBqxxDisabled, rowData) {
      let _self = this;
      this.isRowClickBqBqglBqxx = true;
      this.formBqBqglBqxx = {};
      _self.isXqxxDisabled=isBqBqglBqxxDisabled;
      if (isBqBqglBqxxDisabled) {
        _self.bcShow = false;
        // _self.formBqxxTitle="查看标签信息"
        _self.formBqxxTitle="资产详情"
      } else {
        _self.bcShow = true;
        _self.formBqxxTitle="修改标签信息"
      }
      this.getOneBqBqglBqxx(rowData.id).then(function() {
        //_self.dialogBqBqglBqxxFormVisible = true;
        //原来是只打开标签页面 现在改为 显示五联组件信息
        _self.zcid=_self.formBqBqglBqxx.zcid//// 五联页面 入参资产id
        _self.zcmc=_self.formBqBqglBqxx.zcmc//// 五联页面 入参资产名称
        _self.rfid=_self.formBqBqglBqxx.rfid//// 五联页面 入参资产名称
        console.log("我是标签列表页的rfid"+_self.formBqBqglBqxx);
        _self.dialogBqZctzTzxxlFormVisible=true;
      });
      this.isBqBqglBqxxDisabled = isBqBqglBqxxDisabled;
    },
    handleBqBqglBqxxSelectionChange(val) {
      this.multipleSelectionBqBqglBqxx = val;
    },
    //获取列表
    getListBqBqglBqxx(page) {
      let _self = this;
      let filter = _self.commonUtils.getDefaultFilter(_self.searchBqBqglBqxxForm); //拼接查询条件
      //过滤条件
      if (!_self.commonUtils.isStrIsNull(filter)){
        filter+="&"
      }
      if(_self.openZcztListType == 'clickHomePageDashBoardZcztChart'){
        filter +="zt=" + _self.zt + "&"
      }else if(_self.openZcztListType == 'clickHomePageDashBoardQyChart'){
        filter +="ssqybm=" + _self.ssqybm + "&"
      }else if(_self.openZcztListType == 'clickHomePageDashBoardZclxChart'){
        filter +="zclxbm=" + _self.zclxbm + "&"
      }else if (_self.openZcztListType == 'clickHomePageDashBoardPieQyJL') {//在吉林的时候只有所属单位
        filter +="ssdwId=" + _self.gldwByJL + "&"
      }

      _self.defaultSearchBqBqglBqxx.params.filter = filter;
      _self.defaultSearchBqBqglBqxx.params.page = page;
      //请求到后台
      _self.request
        .getList({
          url: 'bqBqglBqxx/getZcztList',
          params: _self.defaultSearchBqBqglBqxx.params
        })
        .then(function(response) {
          _self.tableBqBqglBqxx.tableData = response.data.result.records;
          _self.tableBqBqglBqxx.total = response.data.result.total;
          _self.tableBqBqglBqxx.curPageNum = page;
          let dicts = response.data.result.dicts; //下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqBqglBqxx, _self.dictsBqBqglBqxx);
        });
    }
  },
  //页面加载完成时执行
  mounted() {
    this.getListBqBqglBqxx(1);
  },
  watch: {
    multipleSelectionBqBqglBqxx() {
      this.commonUtils.toggleSelectTrStyle(this);
    },
    //主子表注释 监听当前列表的外键，外键发生变化时更新当前列表
    openZcztListType: function (val) {
      if (val !== null) {
        this.getListBqBqglBqxx(1);
      }
    },
    zt: function (val) {
      if (val !== null) {
        this.getListBqBqglBqxx(1);
      }
    },
    ssqybm: function (val) {
      if (val !== null) {
        this.getListBqBqglBqxx(1);
      }
    },
    zclxbm: function (val) {
      if (val !== null) {
        this.getListBqBqglBqxx(1);
      }
    }
  }
};
</script>
