
<template>
  <div>

    <!-- 查询条件 -->
    <div class="map-search-bar">

      <div class="grid-content">
        <el-form :inline="true">
          <template>     
              <!--      选择框美化        -->
<!--              <div class="file-box" v-show="showUploadBtn">-->
<!--                <div ref="fileName" class="file-name">未选择文件</div>-->
<!--                <button class="file-button"><i class="fa fa-cloud-upload"></i>&nbsp;上传</button>-->
<!--                <input class="input-file" :id="'fileinput'+busiId" @change="uploading($event)" type="file"-->
<!--                       :accept="acceptType" v-show="showUploadBtn"/>-->
<!--              </div>-->
<!--&lt;!&ndash;              <el-button style="margin-left: 10px" type="primary" @click="doUpload"  v-show="showUploadBtn">上传</el-button>&ndash;&gt;-->
<!--              <el-button @click="showFileList()" type="primary" icon="el-icon-search" size="small" >-->
<!--                <a :id="'showNum'+busiId">附件数量</a>-->
<!--              </el-button>-->
            <div ref="fileName" class="file-name">未选择文件</div>
            <el-button type="primary"  icon="el-icon-upload2" v-show="showUploadBtn">上传</el-button>
            <input class="input-file" :id="'fileinput'+busiId" @change="uploading($event)" type="file"
                   :accept="acceptType" v-show="showUploadBtn"/>
            <el-badge :value="tablesysAttach.total" class="item" type="primary">
              <el-button  type="primary"  @click="showFileList()" icon="el-icon-link"   >附件</el-button>
            </el-badge>
          </template>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class ="map-table">
      <el-dialog :title="formsysAttachTitle"  with="70%"  :visible.sync="dialogsysUpload" append-to-body>
        <el-table ref="multipleTable" :data="tablesysAttach.tableData" tooltip-effect="dark"
                  :show-header="headShowStatus" stripe border>
          <el-table-column prop="realName" label="附件名称" ></el-table-column>
          <el-table-column label="操作" align="center"   width="200"  v-if="showOperateCol">
            　　　　<template slot-scope="scope">
                      <el-form :inline="true" >
              　　　　　　<el-button plain size="mini" type="primary"  icon="el-icon-download" @click="downloadAttach(scope.row.id)" v-show="showDownloadBtn">下载</el-button>
              　　　　　　<el-button plain size="mini" type="danger" icon="el-icon-delete" @click="deleteAttach(scope.row.id,scope.row.realName)" v-show="showUploadBtn">删除</el-button>
                      </el-form>
            　　　　</template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>

    <!-- 单附件上传弹窗-->

	<!--下载窗口-->
    <iframe :id="'downWin'+busiId" name="downWin" src="about:blank"  style="display:none;"></iframe>
  </div>
</template>

<script>

  export default {
    name: "sysAttach",
    props: ['busiId','busiType','numType','acceptType','action'],// 相当于这个组件的入参 action: edit 可上传下载删除，view只可下载,read 不可上传下载删除*/
    data() {
      return {
        loading: true,//是否正在加载
        errored: false,//请求或者操作是否有错误
        errorInfo: null,//错误信息
        headShowStatus: true, //表头是否显示
        formsysAttachTitle: "附件详情",
        dialogsysUpload: false,//是否显示 附件列表
        tablesysAttach: {
          tableData: [],
          pageIndex: 1,
          total: null,
          curPageNum: 1,
          isLoadAll: false,//是否加载完所有
        },
        showUploadBtn:true,//展示上传和删除按钮
        showDownloadBtn:true,//展示下载按钮
        showOperateCol:true,//展示操作列
        linkNum: '附件(0个)',
        issysAttachDisabled: false,
        defaultSearchsysAttach: {
          params: {columns: "id,attachName,realName,upPath,busiType,busiId,attachNumType,createBy,createName,createTime,updateBy,updateName,updateTime,isDelete,deleteBy,deleteName,deleteTime,sysOrgCode,sysCompanyCode,", pageIndex: 1, pageSize: 20}
        },
        /* numType:'',//: S 单附件 M 多附件
         busiType:'',//, 所属模块首字母大写
         busiId:'',//, 业务id
         acceptType:'*',//, 上传文件类型前台过滤 参考input的accept属性 如  格式 ：  "image/gif, image/jpeg"*/
      }
    },
    methods: {
      //获取列表
      getListsysAttach(page) {
        let _self = this
        _self.tablesysAttach.tableData=[]
        _self.tablesysAttach.total = 0
        if(_self.busiId==undefined){//没传参就不查询了
            return;
        }

        if(_self.busiId==null||_self.busiId==""){//没传参就不查询了
          return;
        }
        if(_self.busiId==""){//没传参就不查询了
          return;
        }
        //拼接过滤条件
        let filter = "busiId="+_self.busiId+"&isDelete=0";
        //拼接过滤条件 busiId
        _self.defaultSearchsysAttach.params.filter = filter
        _self.defaultSearchsysAttach.params.pageIndex = page
        console.log("过滤条件："+filter);
        //请求到后台
        _self.request.getList(
          {
            url:'sysAttach',
            params:_self.defaultSearchsysAttach.params
          }
        ).then(function (response) {
          _self.tablesysAttach.tableData = response.data.result.records
          _self.tablesysAttach.total = response.data.result.total;
          _self.tablesysAttach.curPageNum=page;
          //动态修改按钮上的个数
         //document.getElementById("linkNum").innerHTML = "附件("+response.data.resultValue.itemCount+"个)";
         // document.getElementById("showNum").innerHTML = "wwwwwww附件("+response.data.resultValue.itemCount+"个)";
       //  document.getElementById("showNum").innerHTML = "附件("+response.data.resultValue.itemCount+"个)";
         // _self.linkNum="附件("+response.data.resultValue.itemCount+"个)";
          if(_self.action==null||_self.action==""){
            _self.action=='view';//默认view
          }
          if(_self.action=='edit'){//编辑状态 可上传下载删除 但是编辑的时候可能没传业务id
           // console.log("getListsysAttach busiId="+_self.busiId)
            if(_self.busiId==null||_self.busiId==""){
              _self.showUploadBtn=false;
            }else{
              _self.showUploadBtn=true;
            }
            _self.showDownloadBtn=true;
            _self.showOperateCol=true;
          }else if(_self.action=='view' ){//查看状态 可下载不可上传删除
            _self.showUploadBtn=false;
            _self.showDownloadBtn=true;
            _self.showOperateCol=true;
          // }else if(_self.action=='read'){//只读状态 不可上传下载删除
          }else{//只读状态 不可上传下载删除
            _self.showUploadBtn=false;
            _self.showDownloadBtn=false;
            _self.showOperateCol=false;


          }

        })
      },
      //打开上传界面

      uploading(event){
        this.file = event.target.files[0];//获取文件  
        var windowURL = window.URL || window.webkitURL;
        this.file = event.target.files[0];

        //美化选择文件按钮
        var src=event.target || window.event.srcElement; //获取事件源，兼容chrome/IE
        //下面把路径截取为文件名
        var path=src.value;
        let fileName='';
        if(!this.commonUtils.isStrIsNull(path)){
          var pos1 = path.lastIndexOf('/');
          var pos2 = path.lastIndexOf('\\');
          var pos  = Math.max(pos1, pos2)
          if( pos<0 ){
            fileName =path;
          }
          else{
            fileName=path.substring(pos+1);//截取从pos+1索引到末尾
          }
          this.$refs.fileName.innerHTML=fileName
        }
        this.doUpload()//选择完文件直接上传
      },
      doUpload(){
        let _self = this;
        if(this.busiId==null||this.busiId==""){
          _self.$message({
            type: 'info',
            message: '请先保存记录再上传附件'
          });
          return;
        }
        let fs = document.getElementById('fileinput'+_self.busiId);
        if(fs.files.length == 0||this.file==null) {
          _self.$message({
            type: 'info',
            message: '请先选择要上传的附件'
          });
          return;
        }
        //前台禁止上传exe bat文件
        var AllImgExt="'.php|.php3|.php5|.phtml|.asp|.aspx|.ascx|.jsp|.cfm|.cfc|.pl|.bat|.exe|.dll|.reg|.cgi|";
        var extName = this.file.name.substring(this.file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
        if(AllImgExt.indexOf(extName+"|")>-1)
        {
          _self.$message({
            type: 'error',
            message: "该文件类型不允许上传。当前文件类型为"+extName
          });
          return ;
        }
        //判断文件大小
        let filesize=this.file.size;
        // let filemaxsize=1024*1024*20;//20M
        let filemaxsize=1024*1024*50;//50M（因为会有安装包上传，所以将大小限制变大）
        if(filesize>filemaxsize){
          _self.$message({
            type: 'error',
            message: "附件大小不能大于"+filemaxsize/1024/1024+"M！"
          });
          return ;
        }
        let needType="";
        if(this.acceptType!=undefined){
           needType=this.acceptType;
        }
        let formData = new FormData();
        formData.append('file',this.file);
        formData.append('busiId',this.busiId);
        formData.append('busiType',this.busiType);
        if(this.numType!=undefined){
          if((this.numType=='S') || (this.numType=='s')){
            formData.append('attachNumType','S');
          }else{
            formData.append('attachNumType','M');
          }
        }else{
          formData.append('attachNumType','M');
        }
        // formData.append('attachNumType','M');
        formData.append('acceptType',needType);//需要的文件格式
        formData.append('isDelete','0');
        let options = {
          headers: {
            'Content-Type': 'multipart/form-data'  //之前说的以表单传数据的格式来传递fromdata 
          },
          url:"sysAttach/doUploadFile",
          data:formData,
          method:"post"
        };
        this.request.base(
            options
        ).then(function (response) {
          if(response.data.message=='上传成功！'){
            _self.$message({
              type: 'success',
              duration: 5000,
              message: '上传成功。'
            });
          }
          // if(response.data.successful){
          //   _self.$message({
          //     type: 'success',
          //     duration: 5000,
          //     message: '上传成功。'
          //   });
          // }else{
          //   _self.$message({
          //     type: 'error',
          //     duration: 5000,
          //     message: response.data.resultHint
          //   });
          // }

          //update by wht 2019-10-11 16:56:08
          // ie下报此错误：strict 模式下不允许分配到只读属性
          //网上查到的原因是ie在严格模式下默认元素的属性为只读，不能修改
          //清空上传框
          // if(fs.files.length > 0) {
          //   fs.files=null;
          //   fs.value='';
          // }
          _self.getListsysAttach(1);//刷新附件列表
        })
      },
      downloadAttach(id){
        let _self=this
		    // document.getElementById("downWin"+_self.busiId).src=this.request.api_pre+'/mapCommon/rest/sysAttach/doDownLoadFile?id='+id;
        window.open(_self.commonUtils.buildTokenUrl('sysAttach/doDownLoadFile?id=' + rowData.id), '_self');
      },
      showFileList(){
        this.dialogsysUpload=true;
      },
      deleteAttach(id,filename){
        let _self = this
        let ids = [];
        ids.push(id);
        return  this.$confirm('此操作将删除上传的附件' +filename+ ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _self.request.delete(
            {
              url: 'sysAttach',
              data: ids
            },
          ).then(function (response) {
            //删除完成后需要执行的方法
            console.log(response)
            _self.getListsysAttach(1)
          })
        }).catch(() => {
          _self.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      cancelAttr(){
        const input = document.querySelector("button");
        //设置input的属性为false
        input.disabled = false;
        input.class = "";
      }
    },
    //页面加载完成时执行
    mounted() {
      this.getListsysAttach(1)
      this.cancelAttr();
      if(this.busiId==null||this.busiId==""||this.busiId==undefined){
       this.showUploadBtn=false;
        // document.getElementById("showNum").innerHTML = "附件(0个)";
        //this.linkNum="附件(0个)";
      }

    },

    watch: {
      busiId: function (val) {
         console.log("watch busiId发生了变化"+val)
        if (val !== null&&val!=="") {
          this.getListsysAttach(1);
        }else{
          this.showUploadBtn=false;
        }
      },
      action:function (val) {

      }
    }
  }
</script>
<style scoped>
  .map-table .el-table,
  .el-table__body-wrapper,
  .el-tabs__content，.el-dialog__body .el-table__body-wrapper,
  .map-table .el-table,
  .map-table .el-table,
  .el-table__body-wrapper {
    min-height: unset
  }

  /* 上传控件样式自定义  add by wht 2017-11-13 15:21:35 */
  .file-box {
    position: relative;
    display: inline-block;
  }

  .file-button {
    display: inline-block;
    width: 80px;
    height: 35px;
    line-height: 31px;
    background: #017972;
    border-radius: 4px 4px 4px 4px;
    text-align: center;
    color: #fff;
    vertical-align: top;
    border: none;
  }

  .input-file {
    width: 79px;
    height: 33px;
    position: absolute;
    top: 0px;
    left: 0px;
    opacity: 0;
    filter: Alpha(opacity = 0); /*透明度兼容IE8*/
    vertical-align: top;
    z-index: 1000;
    cursor:pointer;
  }

  .file-name {
    display: none;
    /*display: inline-block;*/
    width: 140px;
    height: 33px;
    line-height: 33px;
    padding: 0px 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border: 1px solid #eee;
    border-right:none;
    vertical-align: top;
    border-radius: 4px 0px 0px 4px;
    float: left;
  }
  .no-wrap{
    /*  display: block;
     float: left;
     max-width:140px;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden; */
    /*background-color: #FFA837;*/
    font-size:15px
  }
  .file-name-wrap{
    float:left;font-size: 12px;width:170px; white-space:nowrap;text-overflow:ellipsis;overflow:hidden;
  }
</style>
