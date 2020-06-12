<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqxxListForm" class="clear">
        <el-form-item class="w25" label="设备ID">
          <el-input v-model="searchBqxxListForm.rfid" placeholder="设备ID"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="资产名称">
          <el-input v-model="searchBqxxListForm.zcmc" placeholder="资产名称"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="24">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqxxList(1)" size="small">查询</el-button>
            <el-button type="primary" @click="resertBqxxListSearch" size="small">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table
        ref="tableBqxxList"
        @row-click="rowClickBqxxList"
        :data="tableBqxxList.tableData"
        :height="tableHeight"
        @selection-change	="handleBqxxListSelectionChange"
        tooltip-effect="dark"   @select="userChoose"
        stripe
        border
      >
        <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{ commonUtils.getTableIndex(tableBqxxList.curPageNum, defaultSearchBqxxList.params.pageSize, scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="rfid" label="设备ID" width="250"></el-table-column>

        <el-table-column prop="bqlxbmLabel" label="标签类型" width="250"></el-table-column>

        <el-table-column prop="zcmc" label="资产名称" width="220"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqxxListSizeChange"
        @current-change="handleBqxxListCurrentChange"
        :current-page="tableBqxxList.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqxxList.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqxxList.total"
      ></el-pagination>
    </div>

  </div>
</template>

<script>
/**
 * Created by Code Generator.
 * Author: sunym
 * Date: Mon Dec 27 2019 10:01:17 GMT+0800 (GMT+08:00)
 * 标签信息列表组件
 */

export default {
  name: 'BqxxList',
  props:['singleSelect','otherFilter'],// XZBQJXBD 新增标签进行绑定 绑定新标签 时候只显示 没有设备id的标签 XZYCBQ 选择异常标签   singleSelect:Y 单选 N 多选 otherRfidFilter 附件过滤条件
  components: {},
  data() {
    return {
      tableBqxxList: {
        tableData: [],
        page: 1,
        total: null,
        curPageNum: 1
      },
      multipleSelectionBqxxList: [], //多选时已选择的数据
      searchBqxxListForm: {},
      isRowClickBqxxList: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      defaultSearchBqxxList: {
        params: { page: 1, pageSize: 20, sorter: 'createTime=desc' }
      },
      dictsBqxxList: {}, //下拉对象
    };
  },
  methods: {
    selectBqxxList(){
      if (this.multipleSelectionBqxxList.length < 1) {
        this.commonUtils.message("请至少选择一条数据。")
        return;
      }
      if(this.singleSelect=='Y'){
        if (this.multipleSelectionBqxxList.length > 1) {
          this.commonUtils.message("只能选择一条数据。")
          return
        }
        return this.multipleSelectionBqxxList[0];
      }else{
        return this.multipleSelectionBqxxList;
      }
    },

    //table单击行事件
    rowClickBqxxList: function(row) {
      if(this.singleSelect=='Y') {//单选的时候
        this.$refs.tableBqxxList.clearSelection();
        this.multipleSelectionBqxxList=[];
        //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
      if (!this.isRowClickBqxxList) {
        this.$refs.tableBqxxList.toggleRowSelection(row); //切换选中
      } else {
        this.isRowClickBqxxList = false;
      }
      //其他行点击事件逻辑
    },
    userChoose(selection, row) {
      if(this.singleSelect=='Y') {//单选的时候
        this.$refs.tableBqxxList.clearSelection();
        this.multipleSelectionBqxxList=[];
        //用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
        this.$refs.tableBqxxList.toggleRowSelection(row)//切换选中
      }else{//多选的时候) 不操作 否则会选不中
      }

    },
    //重置
    resertBqxxListSearch() {
      this.searchBqxxListForm = {};
      delete this.defaultSearchBqxxList.params.filter; //移除对象的某个属性
      this.getListBqxxList(1);
    },
    //切换每页页数
    handleBqxxListSizeChange(val) {
      this.defaultSearchBqxxList.params.pageSize = val;
      this.getListBqxxList(1);
    },
    //切换当前页码
    handleBqxxListCurrentChange(val) {
      this.getListBqxxList(val);
    },
    //当用户手动勾选数据行的 Checkbox 时触发的事件
    handleBqxxListSelectionChange(val) {
      this.multipleSelectionBqxxList = val;
    },
    //获取列表
    getListBqxxList(page) {
      let _self = this;
      debugger
      let filter = _self.commonUtils.getDefaultFilter(_self.searchBqxxListForm); //拼接查询条件
      if(_self.otherFilter!=''){//
        filter+='&'+_self.otherFilter;
      }
      debugger
      _self.defaultSearchBqxxList.params.filter = filter;
      _self.defaultSearchBqxxList.params.page = page;
      //请求到后台
      _self.request
        .getList({
          url: 'bqBqglBqxx',
          params: _self.defaultSearchBqxxList.params
        })
        .then(function(response) {
          _self.tableBqxxList.tableData = response.data.result.records;
          _self.tableBqxxList.total = response.data.result.total;
          _self.tableBqxxList.curPageNum = page;
          let dicts = response.data.result.dicts; //下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqxxList, _self.dictsBqxxList);
        });
    }
  },
  //页面加载完成时执行
  mounted() {
    this.getListBqxxList(1);
  },
  watch: {
    multipleSelectionBqxxList() {
      this.commonUtils.toggleSelectTrStyle(this);
    },
    otherFilter(){
      this.getListBqxxList(1);
    }
  }
};
</script>
