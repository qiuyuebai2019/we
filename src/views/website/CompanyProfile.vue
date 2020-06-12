<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchCompanyProfileForm" class="clear">

        <el-form-item class="w25" label="内容">
          <el-input v-model="searchCompanyProfileForm.content" placeholder="内容"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="创建人">
          <el-input v-model="searchCompanyProfileForm.createName" placeholder="创建人"></el-input>
        </el-form-item>

        <el-form-item label="创建时间" class="w50">
          <el-date-picker :editable="false" v-model="searchCompanyProfileForm.createTime" type="datetimerange"
                          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddCompanyProfile" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsCompanyProfile" type="primary" icon="el-icon-delete" size="small">删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListCompanyProfile(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertCompanyProfileSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableCompanyProfile" @row-click="rowClickCompanyProfile" :data="tableCompanyProfile.tableData"
                :height="tableHeight"
                @selection-change="handleCompanyProfileSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableCompanyProfile.curPageNum,defaultSearchCompanyProfile.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="100" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateCompanyProfile(false,scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateCompanyProfile(true,scope.row)">查看</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="content" label="内容" width="350"></el-table-column>

        <el-table-column prop="imagePath" label="图片路径" width="200"></el-table-column>

        <el-table-column prop="createName" label="创建人" width="120"></el-table-column>

        <el-table-column prop="createTime" label="创建时间" align="center" :formatter="commonUtils.formatDate"
                         width="140"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleCompanyProfileSizeChange"
        @current-change="handleCompanyProfileCurrentChange"
        :current-page="tableCompanyProfile.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchCompanyProfile.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableCompanyProfile.total">
      </el-pagination>
    </div>

    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formCompanyProfileTitle" width="80%" top="10Vh"
                 :visible.sync="dialogCompanyProfileFormVisible">
        <el-form :rules="formCompanyProfileRules" ref="formCompanyProfile" :model="formCompanyProfile"
                 :disabled=isCompanyProfileDisabled class="clear dialog-form" label-width="100px">

          <el-form-item class="w33" prop="imagePath" label="图片路径">
            <el-input v-model="formCompanyProfile.imagePath" :maxlength="255" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w100" prop="content" label="内容">
            <quillEditor :content.sync="formCompanyProfile.content" :disabled="editable"></quillEditor>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogCompanyProfileFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveCompanyProfileForm" v-if="!isCompanyProfileDisabled">保 存</el-button>
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
    name: "CompanyProfile",
    components: {quillEditor},
    data() {
      return {
        editable: '',
        formCompanyProfileTitle: "",
        dialogCompanyProfileFormVisible: false,//弹窗是否显示
        formCompanyProfile: {},//表单数据
        formCompanyProfileRules: {},//校验字段以及规则
        tableCompanyProfile: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isCompanyProfileDisabled: false,
        multipleSelectionCompanyProfile: [],//多选时已选择的数据
        searchCompanyProfileForm: {},
        defaultSearchCompanyProfile: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsCompanyProfile: {},
        isRowClickCompanyProfile: false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      }
    },
    methods: {
      //table单击行事件
      rowClickCompanyProfile: function (row) {
        if (!this.isRowClickCompanyProfile) {
          this.$refs.tableCompanyProfile.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickCompanyProfile = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertCompanyProfileSearch() {
        this.searchCompanyProfileForm = {}
        delete this.defaultSearchCompanyProfile.params.filter//移除对象的某个属性
        this.getListCompanyProfile(1)
      },
      //切换每页页数
      handleCompanyProfileSizeChange(val) {
        this.defaultSearchCompanyProfile.params.pageSize = val
        this.getListCompanyProfile(1)
      },
      //切换当前页码
      handleCompanyProfileCurrentChange(val) {
        this.getListCompanyProfile(val)
      },
      //打开新增
      goAddCompanyProfile() {
        this.formCompanyProfile = {}
        this.dialogCompanyProfileFormVisible = true
        this.isCompanyProfileDisabled = false
        this.editable = false
      },
      //保存
      saveCompanyProfileForm() {
        let _self = this
        if (!_self.commonUtils.checkForm('formCompanyProfile', _self)) {
          return false
        }//表单校验
        _self.request.save(
          {
            url: 'companyProfile',
            data: _self.formCompanyProfile
          }
        )
          .then((response) => {
            //保存后自动将后台信息填充到表单
            _self.formCompanyProfile = response.data.result
            _self.getListCompanyProfile(1);
          })
      },
      //删除数据
      deleteItemsCompanyProfile() {
        let _self = this
        if (_self.multipleSelectionCompanyProfile.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionCompanyProfile);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionCompanyProfile.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
            {
              url: 'companyProfile',
              data: ids
            }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListCompanyProfile(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneCompanyProfile(id) {
        let _self = this
        return _self.request.getOne(
          {
            url: 'companyProfile/' + id
          }
        ).then(function (response) {
          _self.formCompanyProfile = response.data.result
        })
      },
      //修改或者查看页
      goUpdateCompanyProfile(isCompanyProfileDisabled, rowData) {
        let _self = this
        this.isRowClickCompanyProfile = true
        this.formCompanyProfile = {}
        this.getOneCompanyProfile(rowData.id).then(
          function () {
            _self.dialogCompanyProfileFormVisible = true
          }
        )
        this.isCompanyProfileDisabled = isCompanyProfileDisabled
        this.editable = isCompanyProfileDisabled
      },
      handleCompanyProfileSelectionChange(val) {
        this.multipleSelectionCompanyProfile = val;
      },
      //获取列表
      getListCompanyProfile(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchCompanyProfileForm)//拼接查询条件
        _self.defaultSearchCompanyProfile.params.filter = filter
        _self.defaultSearchCompanyProfile.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url: 'companyProfile',
            params: _self.defaultSearchCompanyProfile.params
          }
        ).then(function (response) {
          _self.tableCompanyProfile.tableData = response.data.result.records
          _self.tableCompanyProfile.total = response.data.result.total
          _self.tableCompanyProfile.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableCompanyProfile, _self.dictsCompanyProfile)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListCompanyProfile(1)
    },
    watch: {
      multipleSelectionCompanyProfile() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


