<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqRfidLogForm" class="clear">

        <el-form-item label="上报时间" class="w50">
          <el-date-picker :editable="false" v-model="searchBqRfidLogForm.sbsj" type="datetimerange" range-separator="至"
                          start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>

        <!--<el-form-item label="" class="w25"></el-form-item>

        <el-form-item label="" class="w25">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqRfidLog(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertBqRfidLogSearch" size=small>重置</el-button>
          </div>
        </el-form-item>-->

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
            <div class="grid-content">
<!--                <el-button @click="goAddBqRfidLog" type="primary" icon="el-icon-plus" size="small">新增</el-button>-->
                <el-button @click="deleteItemsBqRfidLog" type="primary" icon="el-icon-delete" size="small">删除</el-button>
            </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListBqRfidLog(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertBqRfidLogSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableBqRfidLog" @row-click="rowClickBqRfidLog" :data="tableBqRfidLog.tableData"
                :height="tableHeight"
                @selection-change="handleBqRfidLogSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableBqRfidLog.curPageNum,defaultSearchBqRfidLog.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <!--<el-button type="text" @click="goUpdateBqRfidLog(false,scope.row)">编辑</el-button>-->
            <el-button type="text" @click="goUpdateBqRfidLog(true,scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="rfid" label="标签ID(RFID)" width="150"></el-table-column>

        <el-table-column prop="originData" label="标签数据" width="200"></el-table-column>

        <el-table-column prop="parseData" label="解析数据" width="200"></el-table-column>

        <el-table-column prop="sbsj" label="上报时间" align="center" :formatter="commonUtils.formatDate"
                         width="150"></el-table-column>

        <el-table-column prop="createName" label="创建人" width="120"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate"
                         width="150"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleBqRfidLogSizeChange"
        @current-change="handleBqRfidLogCurrentChange"
        :current-page="tableBqRfidLog.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchBqRfidLog.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBqRfidLog.total">
      </el-pagination>
    </div>


    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formBqRfidLogTitle" width="40%" top="10Vh" :visible.sync="dialogBqRfidLogFormVisible">
        <el-form :rules="formBqRfidLogRules" ref="formBqRfidLog" :model="formBqRfidLog" :disabled=isBqRfidLogDisabled
                 class="clear dialog-form" label-width="100px">

          <el-form-item class="w100" prop="rfid" label="标签ID(RFID)">
            <el-input v-model="formBqRfidLog.rfid" :maxlength="24" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="originData" label="标签数据">
            <el-input type="textarea"
                      :rows="2"
                      v-model="formBqRfidLog.originData"
                      :maxlength="40" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="parseData" label="解析数据">
            <el-input type="textarea"
                      :rows="2"
                      v-model="formBqRfidLog.parseData"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="createName" label="创建人">
            <el-input v-model="formBqRfidLog.createName" :maxlength="24" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w50" prop="sbsj" label="上报时间">
            <el-date-picker
              v-model="formBqRfidLog.sbsj"
              type="datetime" style="width:100%" :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="w50" prop="createTime" label="创建时间">
            <el-date-picker
              v-model="formBqRfidLog.createTime"
              type="datetime" style="width:100%" :editable="false"
              value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBqRfidLogFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveBqRfidLogForm" v-if="!isBqRfidLogDisabled">保 存</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  /**
   *
   * Created by Code Generator.
   *
   * @author :
   * @date :
   */
  export default {
    name: "BqRfidLog",
    data() {
      return {
        formBqRfidLogTitle: "",
        dialogBqRfidLogFormVisible: false,//弹窗是否显示
        formBqRfidLog: {},//表单数据
        formBqRfidLogRules: {},//校验字段以及规则
        tableBqRfidLog: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isBqRfidLogDisabled: false,
        multipleSelectionBqRfidLog: [],//多选时已选择的数据
        searchBqRfidLogForm: {},
        defaultSearchBqRfidLog: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsBqRfidLog: {},
        isRowClickBqRfidLog: false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      }
    },
    methods: {
      //table单击行事件
      rowClickBqRfidLog: function (row) {
        if (!this.isRowClickBqRfidLog) {
          this.$refs.tableBqRfidLog.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickBqRfidLog = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertBqRfidLogSearch() {
        this.searchBqRfidLogForm = {}
        delete this.defaultSearchBqRfidLog.params.filter//移除对象的某个属性
        this.getListBqRfidLog(1)
      },
      //切换每页页数
      handleBqRfidLogSizeChange(val) {
        this.defaultSearchBqRfidLog.params.pageSize = val
        this.getListBqRfidLog(1)
      },
      //切换当前页码
      handleBqRfidLogCurrentChange(val) {
        this.getListBqRfidLog(val)
      },
      //打开新增
      goAddBqRfidLog() {
        this.formBqRfidLog = {}
        this.dialogBqRfidLogFormVisible = true
        this.isBqRfidLogDisabled = false
      },
      //保存
      saveBqRfidLogForm() {
        let _self = this
        if (!_self.commonUtils.checkForm('formBqRfidLog', _self)) {
          return false
        }//表单校验
        _self.request.save(
            {
              url: 'bqRfidLog',
              data: _self.formBqRfidLog
            }
        )
            .then((response) => {
              //保存后自动将后台信息填充到表单
              _self.formBqRfidLog = response.data.result
              _self.getListBqRfidLog(1);
            })
      },
      //删除数据
      deleteItemsBqRfidLog() {
        let _self = this
        if (_self.multipleSelectionBqRfidLog.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionBqRfidLog);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionBqRfidLog.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
              {
                url: 'bqRfidLog',
                data: ids
              }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListBqRfidLog(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneBqRfidLog(id) {
        let _self = this
        return _self.request.getOne(
            {
              url: 'bqRfidLog/' + id
            }
        ).then(function (response) {
          _self.formBqRfidLog = response.data.result
        })
      },
      //修改或者查看页
      goUpdateBqRfidLog(isBqRfidLogDisabled, rowData) {
        let _self = this
        this.isRowClickBqRfidLog = true
        this.formBqRfidLog = {}
        this.getOneBqRfidLog(rowData.id).then(
            function () {
              _self.dialogBqRfidLogFormVisible = true
            }
        )
        this.isBqRfidLogDisabled = isBqRfidLogDisabled
      },
      handleBqRfidLogSelectionChange(val) {
        this.multipleSelectionBqRfidLog = val;
      },
      //获取列表
      getListBqRfidLog(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchBqRfidLogForm)//拼接查询条件
        _self.defaultSearchBqRfidLog.params.filter = filter
        _self.defaultSearchBqRfidLog.params.page = page
        //请求到后台
        _self.request.getList(
            {
              url: 'bqRfidLog',
              params: _self.defaultSearchBqRfidLog.params
            }
        ).then(function (response) {
          _self.tableBqRfidLog.tableData = response.data.result.records
          _self.tableBqRfidLog.total = response.data.result.total
          _self.tableBqRfidLog.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqRfidLog, _self.dictsBqRfidLog)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListBqRfidLog(1)
    },
    watch: {
      multipleSelectionBqRfidLog() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


