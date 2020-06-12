<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqZctzZcflForm" class="clear">

        <el-form-item class="w25" label="资产类型编码">
          <el-input v-model="searchBqZctzZcflForm.zclxbm" placeholder="资产类型编码"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="资产类型名称">
          <el-input v-model="searchBqZctzZcflForm.zclxmc" placeholder="资产类型名称"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="适用专业">
          <el-input v-model="searchBqZctzZcflForm.syzy" placeholder="适用专业"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="是否分相">
          <el-select v-model="searchBqZctzZcflForm.sffx" placeholder="请选择">
            <el-option
              v-for="item in dictsBqZctzZcfl.sffx"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="是否有调度铭牌">
          <el-select v-model="searchBqZctzZcflForm.sfyddmp" placeholder="请选择">
            <el-option
              v-for="item in dictsBqZctzZcfl.sfyddmp"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="是否容器">
          <el-select v-model="searchBqZctzZcflForm.sfrq" placeholder="请选择">
            <el-option
              v-for="item in dictsBqZctzZcfl.sfrq"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="是否挂牌">
          <el-select v-model="searchBqZctzZcflForm.sfgp" placeholder="是否挂牌">
            <el-option
              v-for="item in dictsBqZctzZcfl.sfgp"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="台帐表名">
          <el-input v-model="searchBqZctzZcflForm.tzbm" placeholder="台帐表名"></el-input>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
          </div>
        </el-col>
        <el-col align="right">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqZctzZcfl(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertBqZctzZcflSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class ="map-table">
      <el-table ref="tableBqZctzZcfl" @select="checkboxClickBqZctzZcfl"  @row-click="rowClickBqZctzZcfl" :data="tableBqZctzZcfl.tableData" :height="tableHeight"
                @selection-change="handleBqZctzZcflSelectionChange"  tooltip-effect="dark" stripe  border>
        <el-table-column type="selection" width="35"> </el-table-column>
          <el-table-column type="index" align="center" label="#"  :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableBqZctzZcfl.curPageNum,defaultSearchBqZctzZcfl.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>

        <el-table-column prop="zclxbm" label="资产类型编码"  width="120"></el-table-column>

        <el-table-column prop="zclxmc" label="资产类型名称"   width="120"></el-table-column>

        <el-table-column prop="tzbm" label="台帐表名"   width="120"></el-table-column>

        <el-table-column prop="syzy" label="适用专业"   width="120"></el-table-column>

        <el-table-column prop="sfglbqLabel" label="是否启用" width="120" align="center"></el-table-column>

        <el-table-column prop="sffxLabel" label="是否分相"   width="120" align="center"></el-table-column>

        <el-table-column prop="sfyddmpLabel" label="是否有调度铭牌"  width="120" align="center"></el-table-column>

        <el-table-column prop="bz" label="备注"   width="200"></el-table-column>

        <el-table-column prop="sfjhlxLabel" label="是否几何类型" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="sfrqLabel" label="是否容器" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="sfgpLabel" label="是否挂牌" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="dqljfl" label="电气逻辑分类"   width="120" align="center"></el-table-column>

        <el-table-column prop="zcwlfl" label="设备网络分类" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="ysljh" label="要素类集合"   width="200"></el-table-column>

        <el-table-column prop="dydjxx" label="电压等级下限"   width="120"></el-table-column>

        <el-table-column prop="zzcmc" label="主设备名称"   width="120"></el-table-column>

        <el-table-column prop="sfzbwhxhLabel" label="是否主表维护型号" align="right" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="zclxbmZx" label="资产类型编码_整型" align="right" :formatter="commonUtils.formatMoney" width="130"></el-table-column>

        <el-table-column prop="sfyfjLabel" label="是否有附件" align="center" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="jldw" label="计量单位"   width="120"></el-table-column>

        <el-table-column prop="syzyZx" label="适用专业_整型" align="right" :formatter="commonUtils.formatMoney" width="120"></el-table-column>

        <el-table-column prop="zzcid" label="主设备ID"   width="120"></el-table-column>

        <el-table-column prop="createName" label="创建人"   width="120"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate" width="140"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqZctzZcflSizeChange"
        @current-change="handleBqZctzZcflCurrentChange"
        :current-page="tableBqZctzZcfl.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqZctzZcfl.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqZctzZcfl.total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
  /**
   * Created by Code Generator.
   * Author: liukp
   * Date: Thu Dec 12 2019 11:02:20 GMT+0800 (GMT+08:00)
   * 设备分类
   */
  export default {
    name: "BqZctzZcfl",
    props:['single','mb'],//single是否单选，mb是否从巡检模板页访问的。
    data() {
      return {
        formBqZctzZcflTitle: "设备分类",
        dialogBqZctzZcflFormVisible: false,//弹窗是否显示
        formBqZctzZcfl: {},//表单数据
        formBqZctzZcflRules: {},//校验字段以及规则
        tableBqZctzZcfl: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isBqZctzZcflDisabled: false,
        multipleSelectionBqZctzZcfl: [],//多选时已选择的数据
        searchBqZctzZcflForm: {},
        defaultSearchBqZctzZcfl: {
          params: { page: 1, pageSize: 20,sorter:"createTime=desc"}
        },
        dictsBqZctzZcfl:{},
        isRowClickBqZctzZcfl:false,
      }
    },
    methods: {
      //单选时点击选择框后选中
      checkboxClickBqZctzZcfl:function(selection,row){
        if (this.single=="true"){
          //clearSelection：用于多选表格，清空用户的选择
          //此时所有的checkbox处于未勾选，当用户第一次点击的时候，selectio为一个数组，里面存放的为当前这一行的数据
          this.$refs.tableBqZctzZcfl.clearSelection();
          //此时selection仍然有值 ，只是勾选状态不显示了。
          if (selection.length === 0) {
            return;
          }
          //这里将这行的状态又变为了勾选
          this.$refs.tableBqZctzZcfl.toggleRowSelection(row, true);
        }else {
          return;
        }
      },
      confirm(){
        let _self = this;
        if (_self.multipleSelectionBqZctzZcfl.length == 0||_self.multipleSelectionBqZctzZcfl.length > 1) {
          _self.$alert("请选择一条数据", '提示', {
            confirmButtonText: '确定'
          });
          return;
        }
        if (_self.single=="true"){
          return _self.multipleSelectionBqZctzZcfl.slice(-1);
        }else {
          return _self.multipleSelectionBqZctzZcfl
        }
      },
      //table单击行事件
      rowClickBqZctzZcfl:function(row){
        if (!this.isRowClickBqZctzZcfl){
          //用于多选表格，清空用户的选择
          if (this.single=="true"){
            this.$refs.tableBqZctzZcfl.clearSelection();
          }
          this.$refs.tableBqZctzZcfl.toggleRowSelection(row)//切换选中
        }else {
          this.isRowClickBqZctzZcfl=false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertBqZctzZcflSearch() {
        this.searchBqZctzZcflForm = {}
        delete this.defaultSearchBqZctzZcfl.params.filter//移除对象的某个属性
        this.getListBqZctzZcfl(1)
      },
      //切换每页页数
      handleBqZctzZcflSizeChange(val) {
        this.defaultSearchBqZctzZcfl.params.pageSize = val
        this.getListBqZctzZcfl(1)
      },
      //切换当前页码
      handleBqZctzZcflCurrentChange(val) {
        this.getListBqZctzZcfl(val)
      },
      handleBqZctzZcflSelectionChange(val) {
          this.multipleSelectionBqZctzZcfl = val;
      },
      //获取列表
      getListBqZctzZcfl(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchBqZctzZcflForm)//拼接查询条件
        _self.defaultSearchBqZctzZcfl.params.filter = filter
        _self.defaultSearchBqZctzZcfl.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url:(_self.mb?('bqZctzZcfl/forMob'):'bqZctzZcfl'),
            params: _self.defaultSearchBqZctzZcfl.params
          }
        ).then(function (response) {
          _self.tableBqZctzZcfl.tableData = response.data.result.records
          _self.tableBqZctzZcfl.total = response.data.result.total
          _self.tableBqZctzZcfl.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqZctzZcfl, _self.dictsBqZctzZcfl)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListBqZctzZcfl(1)
    },
    watch:{
      multipleSelectionBqZctzZcfl(){
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>
