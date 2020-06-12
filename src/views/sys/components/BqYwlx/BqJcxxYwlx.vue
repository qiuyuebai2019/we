<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqJcxxYwlxForm" class="clear">

        <el-form-item class="w25" label="业务类型名称">
          <el-input v-model="searchBqJcxxYwlxForm.ywlxmc" placeholder="业务类型名称"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="是否启用">
          <el-select v-model="searchBqJcxxYwlxForm.sfqy" placeholder="请选择">
            <el-option
              v-for="item in dictsBqJcxxYwlx.sfqy"
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
            <el-button type="primary" @click="getListBqJcxxYwlx(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertBqJcxxYwlxSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->

    <div class="map-table">
      <el-table ref="tableBqJcxxYwlx" @row-click="rowClickBqJcxxYwlx" :data="tableBqJcxxYwlx.tableData"
                :height="tableHeight"
                @selection-change="handleBqJcxxYwlxSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableBqJcxxYwlx.curPageNum,defaultSearchBqJcxxYwlx.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="ywlxbm" label="业务类型编码" width="120"></el-table-column>
        <el-table-column prop="ywlxmc" label="业务类型名称" width="150"></el-table-column>
        <el-table-column prop="fwqipdz" label="服务器IP地址" width="120"></el-table-column>
        <el-table-column prop="dkh" label="端口号" align="right" :formatter="commonUtils.formatMoney"
                         width="120"></el-table-column>
        <el-table-column prop="sfqyLabel" label="是否启用" align="center" width="80"></el-table-column>
        <el-table-column prop="sbzq" label="上报周期(秒)" align="right" :formatter="commonUtils.formatMoney"
                         width="110"></el-table-column>
        <el-table-column prop="bz" label="备注" width="200"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqJcxxYwlxSizeChange"
        @current-change="handleBqJcxxYwlxCurrentChange"
        :current-page="tableBqJcxxYwlx.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqJcxxYwlx.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqJcxxYwlx.total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  /**
   * Created by Code Generator.
   * Author: yangzekai
   * Date: Tue Dec 10 2019 10:47:49 GMT+0800 (GMT+08:00)
   * 弹窗 标签类型选择
   */

  export default {
    name: "BqJcxxYwlx",
    data() {
      return {
        formBqJcxxYwlxTitle: "业务类型",
        dialogBqJcxxYwlxFormVisible: false,//弹窗是否显示
        formBqJcxxYwlx: {},//表单数据
        formBqJcxxYwlxRules: {},//校验字段以及规则
        tableBqJcxxYwlx: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isBqJcxxYwlxDisabled: false,
        multipleSelectionBqJcxxYwlx: [],//多选时已选择的数据
        searchBqJcxxYwlxForm: {},
        defaultSearchBqJcxxYwlx: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsBqJcxxYwlx: {},
        isRowClickBqJcxxYwlx: false,//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
        btnAdd: false,
        isShow: false,// 查看时隐藏 保存按钮控制\
        ywlxId: '',
      }
    },
    methods: {
      // 获取选中的数据
      getJcxxYwlxList(){
        let _self = this
        if (_self.multipleSelectionBqJcxxYwlx.length === 0) {
          this.commonUtils.message("请选择业务类型");
          return false;
        }else if (_self.multipleSelectionBqJcxxYwlx.length > 1) {
            _self.$refs.tableBqJcxxYwlx.clearSelection();//设置列表单选
            _self.multipleSelectionBqJcxxYwlx=[]
            this.commonUtils.message("请选择一种业务类型");
            return false;
        }
        return _self.multipleSelectionBqJcxxYwlx
      },
      //table单击行事件
      rowClickBqJcxxYwlx: function (row) {
        this.$refs.tableBqJcxxYwlx.clearSelection();//设置列表单选
        this.multipleSelectionBqJcxxYwlx=[];
        if (!this.isRowClickBqJcxxYwlx) {
          this.$refs.tableBqJcxxYwlx.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickBqJcxxYwlx = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertBqJcxxYwlxSearch() {
        this.searchBqJcxxYwlxForm = {}
        delete this.defaultSearchBqJcxxYwlx.params.filter//移除对象的某个属性
        this.getListBqJcxxYwlx(1)
      },
      //切换每页页数
      handleBqJcxxYwlxSizeChange(val) {
        this.defaultSearchBqJcxxYwlx.params.pageSize = val
        this.getListBqJcxxYwlx(1)
      },
      //切换当前页码
      handleBqJcxxYwlxCurrentChange(val) {
        this.getListBqJcxxYwlx(val)
      },

      handleBqJcxxYwlxSelectionChange(val) {
        this.multipleSelectionBqJcxxYwlx = val;
      },
      //获取列表
      getListBqJcxxYwlx(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchBqJcxxYwlxForm)//拼接查询条件
        _self.defaultSearchBqJcxxYwlx.params.filter = filter
        _self.defaultSearchBqJcxxYwlx.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url: 'bqJcxxYwlx/getBqxxList',
            params: _self.defaultSearchBqJcxxYwlx.params
          }
        ).then(function (response) {
          _self.tableBqJcxxYwlx.tableData = response.data.result.records
          _self.tableBqJcxxYwlx.total = response.data.result.total
          _self.tableBqJcxxYwlx.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqJcxxYwlx, _self.dictsBqJcxxYwlx)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListBqJcxxYwlx(1)
    },
    watch: {
      multipleSelectionBqJcxxYwlx() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


