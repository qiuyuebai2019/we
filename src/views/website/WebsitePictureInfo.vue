<template>
  <div>
    <!-- 查询条件 -->
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchWebsitePictureInfoForm" class="clear">

        <el-form-item class="w25" label="标题">
          <el-input v-model="searchWebsitePictureInfoForm.title" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="推广优先级">
          <el-input v-model="searchWebsitePictureInfoForm.promote" placeholder="项目名称"></el-input>
        </el-form-item>

        <el-form-item class="w25" label="资讯类型">
          <el-select v-model="searchWebsitePictureInfoForm.mesClassify" placeholder="请选择" :clearable="true">
            <el-option
              v-for="item in dictsWebsitePictureInfo.mesClassify"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" label="信息类型">
          <el-select v-model="searchWebsitePictureInfoForm.mesType" placeholder="请选择" :clearable="true">
            <el-option
              v-for="item in dictsWebsitePictureInfo.mesType"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发布时间" class="w50">
          <el-date-picker :editable="false" v-model="searchWebsitePictureInfoForm.releaseTime" type="datetimerange"
                          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col :span="18">
          <div class="grid-content">
            <el-button @click="goAddWebsitePictureInfo" type="primary" icon="el-icon-plus" size="small">新增</el-button>
            <el-button @click="deleteItemsWebsitePictureInfo" type="primary" icon="el-icon-delete" size="small">删除
            </el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="map-search-handel">
            <el-button type="primary" @click="getListWebsitePictureInfo(1)" size=small>查询</el-button>
            <el-button type="primary" @click="resertWebsitePictureInfoSearch" size=small>重置</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 表格 -->
    <div class="map-table">
      <el-table ref="tableWebsitePictureInfo" @row-click="rowClickWebsitePictureInfo"
                :data="tableWebsitePictureInfo.tableData" :height="tableHeight"
                @selection-change="handleWebsitePictureInfoSelectionChange" tooltip-effect="dark" stripe border>
        <el-table-column type="selection" width="35"></el-table-column>
        <el-table-column type="index" align="center" :width="constant.common.TABLE_INDEX_WIDTH" label="#">
          <template slot-scope="scope">
            <span>{{commonUtils.getTableIndex(tableWebsitePictureInfo.curPageNum,defaultSearchWebsitePictureInfo.params.pageSize,scope.$index)}}</span>
          </template>
        </el-table-column>
        <el-table-column width="150" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="goUpdateWebsitePictureInfo(false,scope.row)">编辑</el-button>
            <el-button type="text" @click="goUpdateWebsitePictureInfo(true,scope.row)">查看</el-button>
            <el-button type="text" @click="gotolink(scope.row)">预览</el-button>
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题" width="300"></el-table-column>

        <el-table-column prop="mesClassifyLabel" label="资讯类型" align="center" :formatter="commonUtils.formatMoney"
                         width="100"></el-table-column>

        <el-table-column prop="mesTypeLabel" label="信息类型" align="center" width="90"></el-table-column>

        <el-table-column prop="promote" label="推广优先级" align="center" :formatter="commonUtils.formatMoney"
                         width="100"></el-table-column>

        <el-table-column prop="content" label="资讯内容" width="450"></el-table-column>

        <el-table-column prop="releaseTime" label="发布时间" align="center" :formatter="commonUtils.formatDate"
                         width="140"></el-table-column>

      </el-table>
    </div>

    <!-- 分页 -->
    <div class="map-pagination">
      <el-pagination
        @size-change="handleWebsitePictureInfoSizeChange"
        @current-change="handleWebsitePictureInfoCurrentChange"
        :current-page="tableWebsitePictureInfo.curPageNum"
        :page-sizes="commonUtils.paginationPageSize()"
        :page-size="defaultSearchWebsitePictureInfo.params.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableWebsitePictureInfo.total">
      </el-pagination>
    </div>

    <!-- 新增页弹窗 -->
    <div class="map-form">
      <el-dialog :title="formWebsitePictureInfoTitle" width="80%" top="10Vh"
                 :visible.sync="dialogWebsitePictureInfoFormVisible">
        <el-form :rules="formWebsitePictureInfoRules" ref="formWebsitePictureInfo" :model="formWebsitePictureInfo"
                 :disabled=isWebsitePictureInfoDisabled class="clear dialog-form" label-width="100px">

          <el-form-item class="w25" prop="title" label="标题">
            <el-input v-model="formWebsitePictureInfo.title" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify can-be-empty class="w25" prop="promote" label="推广优先级" int>
            <el-input v-model="formWebsitePictureInfo.promote" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item verify class="w25" prop="mesClassify" label="资讯类型">
            <el-select v-model="formWebsitePictureInfo.mesClassify" placeholder="请选择">
              <el-option
                v-for="item in dictsWebsitePictureInfo.mesClassify"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="w25" prop="mesType" label="信息类型">
            <el-select v-model="formWebsitePictureInfo.mesType" placeholder="请选择" :clearable="true">
              <el-option
                v-for="item in dictsWebsitePictureInfo.mesType"
                :key="item.value"
                :label="item.text"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="w100" prop="imagePath" label="图片路径">
            <el-input v-model="formWebsitePictureInfo.imagePath" :maxlength="255" type="textarea"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w25" prop="imageName" label="图片名称">
            <el-input v-model="formWebsitePictureInfo.imageName" :maxlength="50" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item class="w25" prop="releaseTime" label="发布时间">
            <el-date-picker v-model="formWebsitePictureInfo.releaseTime" type="date" style="width:100%"
                            :editable="false">
            </el-date-picker>
          </el-form-item>

          <el-form-item class="w100" prop="content" label="资讯内容">
            <quillEditor :content.sync="formWebsitePictureInfo.content" :disabled="editable"></quillEditor>
          </el-form-item>

          <el-form-item class="w100" prop="content"></el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogWebsitePictureInfoFormVisible = false">关 闭</el-button>
          <el-button type="primary" @click="saveWebsitePictureInfoForm" v-if="!isWebsitePictureInfoDisabled">保 存
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
    name: "WebsitePictureInfo",
    components: {quillEditor},
    data() {
      return {
        editable: '',
        formWebsitePictureInfoTitle: "资讯信息",
        dialogWebsitePictureInfoFormVisible: false,//弹窗是否显示
        formWebsitePictureInfo: {},//表单数据
        formWebsitePictureInfoRules: {},//校验字段以及规则
        tableWebsitePictureInfo: {
          tableData: [],
          page: 1,
          total: null,
          curPageNum: 1
        },
        isWebsitePictureInfoDisabled: false,
        multipleSelectionWebsitePictureInfo: [],//多选时已选择的数据
        searchWebsitePictureInfoForm: {},
        defaultSearchWebsitePictureInfo: {
          params: {page: 1, pageSize: 20, sorter: "createTime=desc"}
        },
        dictsWebsitePictureInfo: {},
        isRowClickWebsitePictureInfo: false//行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      }
    },
    methods: {
      gotolink() {
        window.open('http://haiyisoft.com/haiyi/hangye/dianli/d/n/yingxaio/', '_blank')
      },
      //table单击行事件
      rowClickWebsitePictureInfo: function (row) {
        if (!this.isRowClickWebsitePictureInfo) {
          this.$refs.tableWebsitePictureInfo.toggleRowSelection(row)//切换选中
        } else {
          this.isRowClickWebsitePictureInfo = false
        }
        //其他行点击事件逻辑
      },
      //重置
      resertWebsitePictureInfoSearch() {
        this.searchWebsitePictureInfoForm = {}
        delete this.defaultSearchWebsitePictureInfo.params.filter//移除对象的某个属性
        this.getListWebsitePictureInfo(1)
      },
      //切换每页页数
      handleWebsitePictureInfoSizeChange(val) {
        this.defaultSearchWebsitePictureInfo.params.pageSize = val
        this.getListWebsitePictureInfo(1)
      },
      //切换当前页码
      handleWebsitePictureInfoCurrentChange(val) {
        this.getListWebsitePictureInfo(val)
      },
      //打开新增
      goAddWebsitePictureInfo() {
        this.formWebsitePictureInfo = {}
        this.dialogWebsitePictureInfoFormVisible = true
        this.isWebsitePictureInfoDisabled = false
        this.editable = false
      },
      //保存
      saveWebsitePictureInfoForm() {
        let _self = this
        if (_self.formWebsitePictureInfo.mesClassify == 0 || _self.formWebsitePictureInfo.mesClassify == 1) {
          _self.formWebsitePictureInfo.mesType = ""
        }
        _self.formWebsitePictureInfo.isDisable = 1
        if (!_self.commonUtils.checkForm('formWebsitePictureInfo', _self)) {
          return false
        }//表单校验
        _self.request.save(
          {
            url: 'websitePictureInfo',
            data: _self.formWebsitePictureInfo
          }
        )
          .then((response) => {
            //保存后自动将后台信息填充到表单
            _self.formWebsitePictureInfo = response.data.result
            _self.getListWebsitePictureInfo(1);
          })
      },
      //删除数据
      deleteItemsWebsitePictureInfo() {
        let _self = this
        if (_self.multipleSelectionWebsitePictureInfo.length === 0) {
          this.commonUtils.message("请至少选择一条再删除");
          return false;
        }
        let ids = _self.commonUtils.getTableDataIdsArr(_self.multipleSelectionWebsitePictureInfo);
        return this.$confirm('此操作将永久删除已选中的' + _self.multipleSelectionWebsitePictureInfo.length + '条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
            {
              url: 'websitePictureInfo',
              data: ids
            }
          ).then(function (response) {
            //删除完成后需要执行的方法
            _self.getListWebsitePictureInfo(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      //获取一条
      getOneWebsitePictureInfo(id) {
        let _self = this
        return _self.request.getOne(
          {
            url: 'websitePictureInfo/' + id
          }
        ).then(function (response) {
          _self.formWebsitePictureInfo = response.data.result
        })
      },
      //修改或者查看页
      goUpdateWebsitePictureInfo(isWebsitePictureInfoDisabled, rowData) {
        let _self = this
        this.isRowClickWebsitePictureInfo = true
        this.formWebsitePictureInfo = {}
        this.getOneWebsitePictureInfo(rowData.id).then(
          function () {
            _self.dialogWebsitePictureInfoFormVisible = true
          }
        )
        this.isWebsitePictureInfoDisabled = isWebsitePictureInfoDisabled
        this.editable = isWebsitePictureInfoDisabled
      },
      handleWebsitePictureInfoSelectionChange(val) {
        this.multipleSelectionWebsitePictureInfo = val;
      },
      //获取列表
      getListWebsitePictureInfo(page) {
        let _self = this
        let filter = _self.commonUtils.getDefaultFilter(_self.searchWebsitePictureInfoForm)//拼接查询条件
        _self.defaultSearchWebsitePictureInfo.params.filter = filter
        _self.defaultSearchWebsitePictureInfo.params.page = page
        //请求到后台
        _self.request.getList(
          {
            url: 'websitePictureInfo',
            params: _self.defaultSearchWebsitePictureInfo.params
          }
        ).then(function (response) {
          _self.tableWebsitePictureInfo.tableData = response.data.result.records
          _self.tableWebsitePictureInfo.total = response.data.result.total
          _self.tableWebsitePictureInfo.curPageNum = page
          let dicts = response.data.result.dicts;//下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableWebsitePictureInfo, _self.dictsWebsitePictureInfo)
        })
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListWebsitePictureInfo(1)
    },
    watch: {
      multipleSelectionWebsitePictureInfo() {
        this.commonUtils.toggleSelectTrStyle(this)
      }
    }
  }
</script>


