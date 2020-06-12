<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchRecruitmentForm" class="clear">

        <el-form-item class="w25" label="招聘岗位">
          <el-input v-model="searchRecruitmentForm.job" placeholder="招聘岗位"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="招聘人数">
          <el-input v-model="searchRecruitmentForm.num" placeholder="招聘人数"></el-input>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddRecruitment" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsRecruitment" type="primary" icon="el-icon-delete" size="small">删除</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListRecruitment(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertRecruitmentSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableRecruitment" @row-click="rowClickRecruitment" :data="tableRecruitment.tableData"
                :height="tableHeight"
                @selection-change="handleRecruitmentSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableRecruitment.curPageNum,defaultSearchRecruitment.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateRecruitment(false,scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateRecruitment(true,scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="job" label="招聘岗位" width="120"></el-table-column>

        <el-table-column prop="num" label="招聘人数" align="center" :formatter="commonUtils.formatMoney"
                         width="100"></el-table-column>

        <el-table-column prop="content" label="详细内容" width="200"></el-table-column>

        <el-table-column prop="createName" label="创建人" width="120"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate"
                         width="140"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleRecruitmentSizeChange"
        @current-change="handleRecruitmentCurrentChange"
        :current-page="tableRecruitment.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchRecruitment.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableRecruitment.total">
      </el-pagination>
    </div>

    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formRecruitmentTitle" width="80%" top="10Vh" :visible.sync="dialogRecruitmentFormVisible">
        <el-form :rules="formRecruitmentRules" ref="formRecruitment" :model="formRecruitment"
                 :disabled=isRecruitmentDisabled class="clear dialog-form" label-width="100px">

          <el-form-item class="w25" prop="job" label="招聘岗位">
            <el-input v-model="formRecruitment.job" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify can-be-empty class="w25" prop="num" label="招聘人数" int>
            <el-input v-model="formRecruitment.num" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="imagePath" label="图片地址">
            <el-input v-model="formRecruitment.imagePath" :maxlength="255" type="textarea"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="content" label="详细内容">
            <quillEditor :content.sync="formRecruitment.content" :disabled="editable"></quillEditor>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogRecruitmentFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveRecruitmentForm" v-if="!isRecruitmentDisabled">保 存</el-button>
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

  import quillEditor from '../sys/components/website/QuillEditor';

  export default {
    name: "Recruitment",
    components: {quillEditor},
    data() {
      return {
        editable: '',
        formRecruitmentTitle: "招聘信息",
        dialogRecruitmentFormVisible: false,//弹窗是否显示
        formRecruitment: {},//表单数据
        formRecruitmentRules: {},//校验字段以及规则
        tableRecruitment: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isRecruitmentDisabled: false,
        multipleSelectionRecruitment: [],//多选时已选择的数据
        searchRecruitmentForm: {},
        defaultSearchRecruitment: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsRecruitment: {},
        isRowClickRecruitment: false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      }
    },
    methods: {
      //table单击行事件
      rowClickRecruitment: function (row) {
        if (!this.isRowClickRecruitment) {
          this.$refs.tableRecruitment.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickRecruitment = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertRecruitmentSearch() {
        this.searchRecruitmentForm = {}
        delete this.defaultSearchRecruitment.params.filter//移除对象的某个属性
        this.getListRecruitment(1)
      },
      //切换每页页数
      handleRecruitmentSizeChange(val) {
        this.defaultSearchRecruitment.params.pageSize = val
        this.getListRecruitment(1)
      },
      //切换当前页码
      handleRecruitmentCurrentChange(val) {
        this.getListRecruitment(val)
      },
      //打开新增
      goAddRecruitment() {
        this.formRecruitment = {}
        this.dialogRecruitmentFormVisible = true
        this.isRecruitmentDisabled = false
        this.editable = false
      },
      //保存
      saveRecruitmentForm() {
        let _self = this
        _self.formRecruitment.httpAddress = "/address"
        if (!_self.commonUtils.checkForm('formRecruitment', _self)) {
          return false
        }//表单校验
        _self.request.save(
          {
            url: 'recruitment',
            data: _self.formRecruitment
          }
        )
          .then((response) => {
            //保存后自动将后台信息填充到表单
            _self.formRecruitment = response.data.result
            _self.getListRecruitment(1);
          })
      },
      //删除数据
      deleteItemsRecruitment() {
        let _self = this
        if (_self.multipleSelectionRecruitment.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionRecruitment);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionRecruitment.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
            {
              url: 'recruitment',
              data: ids
            }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListRecruitment(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneRecruitment(id) {
        let _self = this
        return _self.request.getOne(
          {
            url: 'recruitment/' + id
          }
        ).then(function (response) {
          _self.formRecruitment = response.data.result
        })
      },
      //修改或者查看页
      goUpdateRecruitment(isRecruitmentDisabled, rowData) {
        let _self = this
        this.isRowClickRecruitment = true
        this.formRecruitment = {}
        this.getOneRecruitment(rowData.id).then(
          function () {
            _self.dialogRecruitmentFormVisible = true
          }
        )
        this.isRecruitmentDisabled = isRecruitmentDisabled
        this.editable = isRecruitmentDisabled
      },
      handleRecruitmentSelectionChange(val) {
        this.multipleSelectionRecruitment = val;
      },
      //获取列表
      getListRecruitment(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchRecruitmentForm)//拼接查询条件
        _self.defaultSearchRecruitment.params.filter = filter
        _self.defaultSearchRecruitment.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url: 'recruitment',
            params: _self.defaultSearchRecruitment.params
          }
        ).then(function (response) {
          _self.tableRecruitment.tableData = response.data.result.records
          _self.tableRecruitment.total = response.data.result.total
          _self.tableRecruitment.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableRecruitment, _self.dictsRecruitment)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListRecruitment(1)
    },
    watch: {
      multipleSelectionRecruitment() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


