<template>
  <div>
    <!-- 查询条件-->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchProjectIntroductionForm" class="clear">

        <el-form-item class="w25" label="项目名称">
          <el-input v-model="searchProjectIntroductionForm.projectName" placeholder="项目名称"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="推广优先级">
          <el-input v-model="searchProjectIntroductionForm.promote" placeholder="项目名称"></el-input>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮-->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddProjectIntroduction" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsProjectIntroduction" type="primary" icon="el-icon-delete" size="small">删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListProjectIntroduction(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertProjectIntroductionSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableProjectIntroduction" @row-click="rowClickProjectIntroduction"
                :data="tableProjectIntroduction.tableData" :height="tableHeight"
                @selection-change="handleProjectIntroductionSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH" label="#">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableProjectIntroduction.curPageNum,defaultSearchProjectIntroduction.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateProjectIntroduction(false,scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateProjectIntroduction(true,scope.row)">查看</el-button>
            <el-button type="text" @click="gotolink">预览</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="projectName" label="项目名称" width="250"></el-table-column>

        <el-table-column prop="abstracts" label="摘要" width="800"></el-table-column>

        <el-table-column prop="promote" label="推广优先级" align="center" :formatter="commonUtils.formatMoney"
                         width="100"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate"
                         width="240"></el-table-column>

      </el-table>
    </div>

    <!--     分页-->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleProjectIntroductionSizeChange"
        @current-change="handleProjectIntroductionCurrentChange"
        :current-page="tableProjectIntroduction.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchProjectIntroduction.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableProjectIntroduction.total">
      </el-pagination>
    </div>

    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formProjectIntroductionTitle" width="80%" top="10Vh"
                 :visible.sync="dialogProjectIntroductionFormVisible">
        <el-form :rules="formProjectIntroductionRules" ref="formProjectIntroduction" :model="formProjectIntroduction"
                 :disabled=isProjectIntroductionDisabled class="clear dialog-form" label-width="100px">

          <el-form-item class="w25" prop="projectName" label="项目名称">
            <el-input v-model="formProjectIntroduction.projectName" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify can-be-empty class="w25" prop="promote" label="推广优先级" int>
            <el-input v-model="formProjectIntroduction.promote" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="abstracts" label="摘要">
            <quillEditor :content.sync="formProjectIntroduction.abstracts"></quillEditor>
          </el-form-item>


          <el-form-item class="w100" prop="background" label="建设背景">
            <quillEditor :content.sync="formProjectIntroduction.background"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="solveProblems" label="解决问题">
            <quillEditor :content.sync="formProjectIntroduction.solveProblems"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="principle" label="建设原则">
            <quillEditor :content.sync="formProjectIntroduction.principle"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="target" label="总体目标">
            <quillEditor :content.sync="formProjectIntroduction.target"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="overallArchitecture" label="总体架构">
            <quillEditor :content.sync="formProjectIntroduction.overallArchitecture"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="appArchitecture" label="应用架构">
            <quillEditor :content.sync="formProjectIntroduction.appArchitecture"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="mentality" label="总体思路">
            <quillEditor :content.sync="formProjectIntroduction.mentality"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="content" label="建设内容">
            <quillEditor :content.sync="formProjectIntroduction.content"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="requirement" label="软硬件要求">
            <quillEditor :content.sync="formProjectIntroduction.requirement"></quillEditor>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogProjectIntroductionFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveProjectIntroductionForm" v-if="!isProjectIntroductionDisabled">保 存
          </el-button>
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
    name: "ProjectIntroduction",
    components: {quillEditor},
    data() {
      return {
        formProjectIntroductionTitle: "项目信息",
        dialogProjectIntroductionFormVisible: false,//弹窗是否显示
        formProjectIntroduction: {},//表单数据
        formProjectIntroductionRules: {},//校验字段以及规则
        tableProjectIntroduction: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isProjectIntroductionDisabled: false,
        multipleSelectionProjectIntroduction: [],//多选时已选择的数据
        searchProjectIntroductionForm: {},
        defaultSearchProjectIntroduction: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsProjectIntroduction: {},
        isRowClickProjectIntroduction: false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      }
    },
    methods: {
      gotolink() {
        //指定跳转地址 https://element.eleme.io
        window.open('http://haiyisoft.com/haiyi/hangye/dianli/d/n/yingxaio/', '_blank')
      },
      //table单击行事件
      rowClickProjectIntroduction: function (row) {
        if (!this.isRowClickProjectIntroduction) {
          this.$refs.tableProjectIntroduction.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickProjectIntroduction = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertProjectIntroductionSearch() {
        this.searchProjectIntroductionForm = {}
        delete this.defaultSearchProjectIntroduction.params.filter//移除对象的某个属性
        this.getListProjectIntroduction(1)
      },
      //切换每页页数
      handleProjectIntroductionSizeChange(val) {
        this.defaultSearchProjectIntroduction.params.pageSize = val
        this.getListProjectIntroduction(1)
      },
      //切换当前页码
      handleProjectIntroductionCurrentChange(val) {
        this.getListProjectIntroduction(val)
      },
      //打开新增
      goAddProjectIntroduction() {
        this.formProjectIntroduction = {}
        this.dialogProjectIntroductionFormVisible = true
        this.isProjectIntroductionDisabled = false
      },
      //保存
      saveProjectIntroductionForm() {
        let _self = this
        _self.formProjectIntroduction.httpAddress="/address"
        if (!_self.commonUtils.checkForm('formProjectIntroduction', _self)) {
          return false
        }//表单校验
        _self.request.save(
          {
            url: 'projectIntroduction',
            data: _self.formProjectIntroduction
          }
        )
          .then((response) => {
            //保存后自动将后台信息填充到表单
            _self.formProjectIntroduction = response.data.result
            _self.getListProjectIntroduction(1);
          })
      },
      //删除数据
      deleteItemsProjectIntroduction() {
        let _self = this
        if (_self.multipleSelectionProjectIntroduction.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionProjectIntroduction);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionProjectIntroduction.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
            {
              url: 'projectIntroduction',
              data: ids
            }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListProjectIntroduction(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneProjectIntroduction(id) {
        let _self = this
        return _self.request.getOne(
          {
            url: 'projectIntroduction/' + id
          }
        ).then(function (response) {
          _self.formProjectIntroduction = response.data.result
        })
      },
      //修改或者查看页
      goUpdateProjectIntroduction(isProjectIntroductionDisabled, rowData) {
        let _self = this
        this.isRowClickProjectIntroduction = true
        this.formProjectIntroduction = {}
        this.getOneProjectIntroduction(rowData.id).then(
          function () {
            _self.dialogProjectIntroductionFormVisible = true
          }
        )
        this.isProjectIntroductionDisabled = isProjectIntroductionDisabled
      },
      handleProjectIntroductionSelectionChange(val) {
        this.multipleSelectionProjectIntroduction = val;
      },
      //获取列表
      getListProjectIntroduction(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchProjectIntroductionForm)//拼接查询条件
        _self.defaultSearchProjectIntroduction.params.filter = filter
        _self.defaultSearchProjectIntroduction.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url: 'projectIntroduction',
            params: _self.defaultSearchProjectIntroduction.params
          }
        ).then(function (response) {
          _self.tableProjectIntroduction.tableData = response.data.result.records
          _self.tableProjectIntroduction.total = response.data.result.total
          _self.tableProjectIntroduction.curPageNum = page
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListProjectIntroduction(1)
    },
    watch: {
      multipleSelectionProjectIntroduction() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


