<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqZcpdPdjhForm" class="clear">
        <el-form-item class="w25" label="计划单号"><el-input v-model="searchBqZcpdPdjhForm.jhdh" placeholder="计划单号"></el-input></el-form-item>
      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="24">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqZcpdPdjh(1)" size="small">查询</el-button>
            <el-button type="primary" @click="resertBqZcpdPdjhSearch" size="small">重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table
        ref="tableBqZcpdPdjh"
        @row-click="rowClickBqZcpdPdjh"
        :data="tableBqZcpdPdjh.tableData"
        :height="tableHeight"
        @selection-change="handleBqZcpdPdjhSelectionChange"
        tooltip-effect="dark"
        stripe
        border
      >
        <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{ commonUtils.getTableIndex(tableBqZcpdPdjh.curPageNum, defaultSearchBqZcpdPdjh.params.pageSize, scope.$index) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="jhdh" label="计划单号" width="120"></el-table-column>

        <el-table-column prop="jhr" label="盘点人" width="120"></el-table-column>

        <el-table-column prop="pdlxLabel" label="盘点类型" align="center" width="90"></el-table-column>

        <el-table-column prop="pdzqLabel" label="盘点周期" align="center" width="90"></el-table-column>

        <el-table-column prop="sfqyLabel" label="是否启用" align="center" width="80"></el-table-column>

        <el-table-column prop="bz" label="备注" width="200"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqZcpdPdjhSizeChange"
        @current-change="handleBqZcpdPdjhCurrentChange"
        :current-page="tableBqZcpdPdjh.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqZcpdPdjh.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqZcpdPdjh.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
/**
 * Created by Code Generator.
 * Author: qindonghui
 * Date: Wed Dec 11 2019 12:57:53 GMT+0800 (GMT+08:00)
 * 1盘点计划表
 */

export default {
  name: 'BqZcpdPdjh',
  data() {
    return {
      formBqZcpdPdjhTitle: '盘点计划表',
      dialogBqZcpdPdjhFormVisible: false, //弹窗是否显示
      formBqZcpdPdjh: {}, //表单数据
      formBqZcpdPdjhRules: {}, //校验字段以及规则
      tableBqZcpdPdjh: {
        tableData: [],
        page: 1,
        total: null,
        curPageNum: 1
      },
      isBqZcpdPdjhDisabled: false,
      multipleSelectionBqZcpdPdjh: [], //多选时已选择的数据
      searchBqZcpdPdjhForm: {},
      defaultSearchBqZcpdPdjh: {
        params: { page: 1, pageSize: 20, sorter: 'createTime=desc' }
      },
      dictsBqZcpdPdjh: {},
      isRowClickBqZcpdPdjh: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      bcShow: false, //编辑 查看时控制保存按钮的显示
      dialogSysUserOrgTreeVisible: false, //控制人员选择弹窗打开关闭
      users: [], //接收人员选中列表的数据
      djyDisabled: false //根据生命周期下拉值每月 控制属性每月是否禁用状态
    };
  },
  methods: {
    //获取选中的数据
    getBqZcpdPdjhList() {
      let _self = this;
      if (_self.multipleSelectionBqZcpdPdjh.length === 0) {
        _self.commonUtils.error('请选择盘点信息。');
        return false;
      }
      return _self.multipleSelectionBqZcpdPdjh;
    },

    //打开人员选择弹窗
    getJhr() {
      this.dialogSysUserOrgTreeVisible = true;
    },
    //选中的人员信息赋值处理
    getSelectJhr() {
      let _self = this;
      _self.users = _self.$refs.OrgUserTree.getUsers();
      _self.formBqZcpdPdjh.jhrId = _self.users[0].id;
      _self.formBqZcpdPdjh.jhr = _self.users[0].realname;
      _self.dialogSysUserOrgTreeVisible = false;
    },
    //获取生命周期下拉值 根据值的不同 对每月属性是否禁用控制
    onSelectedPdzq(val) {
      let _self = this;
      if (val == _self.constant.zxpd.ZXPD_PDJH_PDZQ_MY) {
        _self.djyDisabled = true;
      } else {
        _self.djyDisabled = false;
      }
    },
    //table单击行事件
    rowClickBqZcpdPdjh: function(row) {
      this.$refs.tableBqZcpdPdjh.clearSelection(); //设置列表单选
      this.multipleSelectionBqZcpdPdjh = [];
      if (!this.isRowClickBqZcpdPdjh) {
        this.$refs.tableBqZcpdPdjh.toggleRowSelection(row); //切换选中
      } else {
        this.isRowClickBqZcpdPdjh = false;
      }
      //其他行点击事件逻辑
    },
    //重置
    resertBqZcpdPdjhSearch() {
      this.searchBqZcpdPdjhForm = {};
      delete this.defaultSearchBqZcpdPdjh.params.filter; //移除对象的某个属性
      this.getListBqZcpdPdjh(1);
    },
    //切换每页页数
    handleBqZcpdPdjhSizeChange(val) {
      this.defaultSearchBqZcpdPdjh.params.pageSize = val;
      this.getListBqZcpdPdjh(1);
    },
    //切换当前页码
    handleBqZcpdPdjhCurrentChange(val) {
      this.getListBqZcpdPdjh(val);
    },
    //打开新增
    goAddBqZcpdPdjh() {
      this.formBqZcpdPdjh = {};
      this.dialogBqZcpdPdjhFormVisible = true;
      this.isBqZcpdPdjhDisabled = false;
      this.bcShow = true;
      this.formBqZcpdPdjh.pdlx = this.constant.zxpd.ZXPD_PDJH_ZD;
      this.djyDisabled = false;
    },
    //保存
    saveBqZcpdPdjhForm() {
      let _self = this;
      if (!_self.commonUtils.checkForm('formBqZcpdPdjh', _self)) {
        return false;
      } //表单校验
      _self.request
        .save({
          url: 'bqZcpdPdjh',
          data: _self.formBqZcpdPdjh
        })
        .then(response => {
          //保存后自动将后台信息填充到表单
          _self.formBqZcpdPdjh = response.data.result;
          _self.getListBqZcpdPdjh(1);
        });
    },
    //删除数据
    deleteItemsBqZcpdPdjh() {
      let _self = this;
      if (_self.multipleSelectionBqZcpdPdjh.length === 0) {
        this.commonUtils.message('请至少选择一条再删除');
        return false;
      }
      let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqZcpdPdjh);
      return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionBqZcpdPdjh.length + '条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _self.request
            .delete({
              url: 'bqZcpdPdjh',
              data: ids
            })
            .then(function(response) {
              //删除完成后需要执行的方法
              _self.getListBqZcpdPdjh(1);
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
    getOneBqZcpdPdjh(id) {
      let _self = this;
      return _self.request
        .getOne({
          url: 'bqZcpdPdjh/' + id
        })
        .then(function(response) {
          _self.formBqZcpdPdjh = response.data.result;
        });
    },
    //修改或者查看页
    goUpdateBqZcpdPdjh(isBqZcpdPdjhDisabled, rowData) {
      let _self = this;
      this.isRowClickBqZcpdPdjh = true;
      this.formBqZcpdPdjh = {};
      if (isBqZcpdPdjhDisabled) {
        _self.bcShow = false;
      } else {
        _self.bcShow = true;
        if (rowData.pdzq == _self.constant.zxpd.ZXPD_PDJH_PDZQ_MY) {
          _self.djyDisabled = true;
        } else {
          _self.djyDisabled = false;
        }
      }
      this.getOneBqZcpdPdjh(rowData.id).then(function() {
        _self.dialogBqZcpdPdjhFormVisible = true;
      });
      this.isBqZcpdPdjhDisabled = isBqZcpdPdjhDisabled;
    },
    handleBqZcpdPdjhSelectionChange(val) {
      this.multipleSelectionBqZcpdPdjh = val;
    },
    //获取列表
    getListBqZcpdPdjh(page) {
      let _self = this;
      let filter = _self.commonUtils.getDefaultFilter(_self.searchBqZcpdPdjhForm); //拼接查询条件
      _self.defaultSearchBqZcpdPdjh.params.filter = filter;
      _self.defaultSearchBqZcpdPdjh.params.page = page;
      //请求到后台
      _self.request
        .getList({
          url: 'bqZcpdPdjh/listAtZD',
          params: _self.defaultSearchBqZcpdPdjh.params
        })
        .then(function(response) {
          _self.tableBqZcpdPdjh.tableData = response.data.result.records;
          _self.tableBqZcpdPdjh.total = response.data.result.total;
          _self.tableBqZcpdPdjh.curPageNum = page;
          let dicts = response.data.result.dicts; //下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqZcpdPdjh, _self.dictsBqZcpdPdjh);
        });
    }
  },
  //页面加载完成时执行
  mounted() {
    this.getListBqZcpdPdjh(1);
  },
  watch: {
    multipleSelectionBqZcpdPdjh() {
      this.commonUtils.toggleSelectTrStyle(this);
    }
  }
};
</script>
