<template>
  <div>
    <!--<div align="" class="" >
      <el-button type="primary" @click="saveBqBqglBqxxForm"  v-show="isShow" :disabled="savedisabled">保 存</el-button>
    </div>-->
    <!-- 新增页弹窗 -->
    <div class="map-form">
      <!-- <el-dialog :title="formBqBqglBqxxTitle" width="80%" top="10Vh" :visible.sync="dialogBqBqglBqxxFormVisible"> -->
      <el-form
        :rules="formBqBqglBqxxRules"
        ref="formBqBqglBqxx"
        :model="formBqBqglBqxx"
        :disabled="isBqxxzjDisabled||isBqBqglBqxxDisabled"
        class="clear dialog-form"
        label-width="100px"
      >
        <el-form-item verify :length="24" class="w25" prop="rfid" label="设备ID">
          <el-input v-if="!isBqxxzjDisabled && !isBqBqglBqxxDisabled && openFromType=='BQXX'"v-model="formBqBqglBqxx.rfid" :maxlength="24" autocomplete="off"></el-input>
          <el-input v-else v-model="formBqBqglBqxx.rfid" class="input-popup-dialog" readonly v-on:click.native="changeRfid" placeholder="请选择" :maxlength="24" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item verify class="w25" prop="bqywlxmc" label="标签业务类型"  label-width="110px">
          <el-input
            class="input-popup-dialog"
            readonly
            v-on:click.native="getBqywlxmc()"
            placeholder="请选择"
            v-model="formBqBqglBqxx.bqywlxmc"
            :maxlength="64"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item verify class="w25" prop="bqlxbm" label="标签类型">
          <el-select v-model="formBqBqglBqxx.bqlxbm" placeholder="请选择" :disabled="true">
            <el-option v-for="item in dictsBqBqglBqxx.bqlxbm" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item verify class="w25" prop="ywcjbm" label="业务场景">
          <el-select v-model="formBqBqglBqxx.ywcjbm" placeholder="请选择">
            <el-option v-for="item in dictsBqBqglBqxx.ywcjbm" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item  class="w25" prop="zcmc" label="资产名称">
          <el-input v-model="formBqBqglBqxx.zcmc" class="input-popup-dialog" readonly v-on:click.native="getZcid" placeholder="请选择" :maxlength="64" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item class="w25" prop="sccj" label="生产厂家"><el-input v-model="formBqBqglBqxx.sccj" :maxlength="64" autocomplete="off"></el-input></el-form-item>

        <el-form-item verify can-be-empty class="w25" prop="jd" label="经度" :max-decimal-length="6"><el-input v-model="formBqBqglBqxx.jd"></el-input></el-form-item>

        <el-form-item verify can-be-empty class="w25" prop="wd" label="纬度" :max-decimal-length="6"><el-input v-model="formBqBqglBqxx.wd"></el-input></el-form-item>

        <el-form-item class="w25" prop="azwz" label="安装位置"><el-input v-model="formBqBqglBqxx.azwz" :maxlength="100" type="input" autocomplete="off"></el-input></el-form-item>

        <el-form-item class="w25" prop="ssdwId" label="所属单位">
          <el-select v-model="formBqBqglBqxx.ssdwId" placeholder="请选择" clearable>
            <el-option v-for="item in dictsBqBqglBqxx.ssdwId" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" v-if="constant.common.sfjl==='N'" prop="ssqybm" label="班组工区">
          <el-select v-model="formBqBqglBqxx.ssqybm" placeholder="请选择" clearable>
            <el-option v-for="item in dictsBqBqglBqxx.ssqybm" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="w25" prop="ccrq" label="出厂日期">
          <el-date-picker v-model="formBqBqglBqxx.ccrq" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="date" style="width:100%" :editable="false"></el-date-picker>
        </el-form-item>

        <el-form-item class="w25" prop="simId" label="SIM卡"><el-input v-model="formBqBqglBqxx.simId" :maxlength="64" type="input" autocomplete="off"></el-input></el-form-item>

        <!-- <el-form-item   class="w25" prop="sfqy" label="是否启用" >

                        <el-select v-model="formBqBqglBqxx.sfqy" placeholder="请选择">
                          <el-option v-for="item in dictsBqBqglBqxx.sfqy" :key="item.value" :label="item.text" :value="item.value"></el-option>
                        </el-select>
                    </el-form-item> -->

        <el-form-item class="w50" prop="bz" label="备注"><el-input v-model="formBqBqglBqxx.bz" :maxlength="500" type="input" autocomplete="off"></el-input></el-form-item>

      </el-form>
      <!-- </el-dialog> -->

      <!-- 标签业务类型选择弹窗 -->

      <el-dialog title="选择业务类型" width="80%" top="2Vh" :visible.sync="dialogBqJcxxYwlxVisible" append-to-body>
        <BqJcxxYwlx v-if="dialogBqJcxxYwlxVisible" ref="BqJcxxYwlx"></BqJcxxYwlx>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBqJcxxYwlxVisible = false">关 闭</el-button>
          <el-button type="primary" @click="getSelectBqJcxxYwlx()">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 资产台账设备选择弹窗 -->

      <el-dialog title="选择资产设备" width="80%" top="2Vh" :visible.sync="dialogBqZctzTzxxSelectVisible" append-to-body>
        <BqZctzTzxxSelect v-if="dialogBqZctzTzxxSelectVisible" ref="BqZctzTzxxSelect" singleSelect="Y" filterSql="BQXZSB"></BqZctzTzxxSelect>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogBqZctzTzxxSelectVisible = false">关 闭</el-button>
          <el-button type="primary" @click="getZctzTzxxSelect()">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 标签 列表选择弹窗 -->
        <el-dialog title="选择标签进行绑定" width="80%" top="2Vh" :visible.sync="dialogBqxxListVisible" append-to-body>
          <BqxxList ref="BqxxList"  singleSelect="Y" :otherFilter="otherFilter"></BqxxList>
          <div slot="footer" class="dialog-footer">
            <el-button @click="getSelectBqxxList(false)">关 闭</el-button>
            <el-button type="primary" @click="getSelectBqxxList(true)">绑 定</el-button>
          </div>
        </el-dialog>
    </div>





  </div>



</template>

<script>
/**
 * Created by Code Generator.
 * Author: qindonghui
 * Date: Mon Dec 09 2019 15:32:17 GMT+0800 (GMT+08:00)
 * 标签信息
 */
import BqZctzTzxxSelect from '@/views/zctz/tzxx/BqZctzTzxxSelect'; //资产台账设备
import BqJcxxYwlx from '@/views/sys/components/BqYwlx/BqJcxxYwlx'; //标签业务类型
import BqxxList from '@/views/sys/components/bqxx/BqxxList.vue';
export default {
  name: 'BqBqglBqxx',
  props: ['rfid', 'isBqxxzjDisabled','isShow','zcid','zcmc','kbqdid','kbmc','sfqy','openFromType'],//isBqxxzjDisabled：为true查看状态 为false编辑状态  rfid：标签信息rfid zcid:资产id(RFID)  zcmc(资产名称) kbqdid:库表清单id  kbmc:库表名称openFromType 打开弹窗的业务类型 ZCTZ 资产台账打开 BQXX 标签信息打开
  components: { BqJcxxYwlx,BqZctzTzxxSelect,BqxxList},
  data() {
    return {
      formBqBqglBqxxTitle: '标签信息',
      dialogBqBqglBqxxFormVisible: false, //弹窗是否显示
      formBqBqglBqxx: {}, //表单数据
      formBqBqglBqxxRules: {}, //校验字段以及规则
      tableBqBqglBqxx: {
        tableData: [],
        page: 1,
        total: null,
        curPageNum: 1
      },
      isBqBqglBqxxDisabled: false,
      multipleSelectionBqBqglBqxx: [], //多选时已选择的数据
      searchBqBqglBqxxForm: {},
      defaultSearchBqBqglBqxx: {
        params: { page: 1, pageSize: 20, sorter: 'createTime=desc' }
      },
      dictsBqBqglBqxx: {}, //下拉对象
      isRowClickBqBqglBqxx: false, //行点击时判断是否点击的操作按钮，如果是操作按钮则不选中这一行
      bcShow: false, //编辑查看时保存按钮的控制状态
      dialogBqJcxxYwlxVisible: false, //控制标签业务类型选择弹窗打开关闭
      JcxxYwlxList: [] ,//接收标签业务类型选中列表的数据
      savedisabled:false,//控制保存按钮是否可用
      dialogBqZctzTzxxSelectVisible: false, //控制资产台账设备选择弹窗打开关闭
      dialogBqxxListVisible:false,//是否显示选择标签进行绑定 界面
      localKbqdid:'',// 如果是标签信息 编辑的时候 选择设备 需要用新的
      localKbmc:'',// 如果是标签信息 编辑的时候 选择设备  需要用新的
      otherFilter:"",//附加的rfid过滤条件
    };
  },
  methods: {
    //打开资产台账设备选择弹框
    getZcid() {
      //如果当前界面是锁定的 那就不能打开资产台账选择界面
      if(!this.isBqxxzjDisabled){
        if(this.openFromType=="BQXX"){  //标签页面 维护的时候可以选新的  资产台账页面维护的时候不能选新的
          this.dialogBqZctzTzxxSelectVisible=true;
        }
      }
    },
    //选中的资产台账设备赋值处理
    getZctzTzxxSelect() {
      let _self = this;
      _self.TzxxSelect = _self.$refs.BqZctzTzxxSelect.confirm();
      _self.formBqBqglBqxx.zcid = _self.TzxxSelect[0].id;
      _self.formBqBqglBqxx.zcmc = _self.TzxxSelect[0].sbmc;
      _self.localKbqdid = _self.TzxxSelect[0].kbqdid;
      _self.localKbmc = _self.TzxxSelect[0].kbmc;
      _self.dialogBqZctzTzxxSelectVisible = false;

    },
    // 关闭
    // close(val) {
    //   this.$emit('closeDialog', val)
    // },
    //打开标签业务类型弹框
    getBqywlxmc() {
      if(!this.isBqxxzjDisabled) {//可以 只读的时候不可以编辑 业务类型
        this.dialogBqJcxxYwlxVisible =true;
      }
    },
    //选中的标签类型赋值处理
    getSelectBqJcxxYwlx() {
      let _self = this;
      _self.JcxxYwlxList = _self.$refs.BqJcxxYwlx.getJcxxYwlxList();
      _self.formBqBqglBqxx.bqywlxbm = _self.JcxxYwlxList[0].ywlxbm;
      _self.formBqBqglBqxx.bqywlxmc = _self.JcxxYwlxList[0].ywlxmc;
      //点击编辑后，操作标签业务类型没有将标签类型编码代入标签类型中，增加下面两行代码 -- 20200220 19：22 SunYM
      _self.formBqBqglBqxx.bqlxbm = _self.JcxxYwlxList[0].bqlxbm; // 标签类型编码
      _self.formBqBqglBqxx.ywcjbm = _self.JcxxYwlxList[0].ywcjbm; // 业务场景编码
      //end
      _self.dialogBqJcxxYwlxVisible = false;
    },

    changeRfid(){//打开标签信息选择弹窗
      if(this.openFromType=='ZCTZ'){//如果是资产台账功能打开的而且是 编辑界面  允许再次编辑标签 否则就不可以
        if(!this.isBqxxzjDisabled){//可以再次编辑的时候 要把自身 过滤掉  这个自身是指页面显示的rfid不是 原来的rfid

          let nowRfid=this.formBqBqglBqxx.rfid;
          if(this.rfid!=null&&this.rfid!=""){
            this.otherFilter="&zcid_isnull&rfid_ne="+this.rfid
          }else if(nowRfid!=null&&nowRfid!="") {
            this.otherFilter="&zcid_isnull&rfid_ne="+nowRfid
          }else{
            this.otherFilter="&zcid_isnull"
          }
          this.dialogBqxxListVisible=true;
        }
      }else if(this.openFromType=='BQXX'){//标签信息 功能打开 五联组件的时候 就不允许换标签了

      }

    },
    //获取获取选择则的标签信息列表
    getSelectBqxxList(flag) {//选择标签信息进行绑定
      this.dialogBqxxListVisible = false;//关掉绑定标签弹窗
      //设置绑定信息
      if(flag){
        let bqxx = this.$refs.BqxxList.selectBqxxList();
        //资产id 和资产名称 需要单独赋值

        bqxx.zcid=this.zcid;
        bqxx.zcmc=this.zcmc;
        this.formBqBqglBqxx=bqxx;
        // this.saveBqBqglBqxxForm();//自动保存绑定
        var that = this;
        setTimeout(function () {
         that.saveBqBqglBqxxForm();//自动保存绑定
       },500);//500ms后执行保存，立即执行的时候 保存失败

      }else{//弹窗选择标签 但是没有选定标签 就不能操作当前界面
        // this.getListBqBqglBqxx(1)
        this.savedisabled=true
        this.isBqBqglBqxxDisabled=true;//禁止操作
        var retObj={'action':'没有关联标签'}
        this.$emit('retTzxq', retObj) ;//返回父页面隐藏保存按钮
        this.$message({
          type: 'info',
          message: '已取消操作'

        });
      }

    },

    //保存
    saveBqBqglBqxxForm() {
      let _self = this;
        if (!_self.commonUtils.checkForm('formBqBqglBqxx', _self)) {
        return false;
      } //表单校验
      _self.request
        .save({
          url: 'bqBqglBqxx',
          data: {"bqBqglBqxx":_self.formBqBqglBqxx,"kbqdid":_self.localKbqdid,"kbmc":_self.localKbmc,"rfid":_self.rfid}//新增参数rfid 区分是否资产id没变 标签变了
        })
        .then(response => {
          //保存后自动将后台信息填充到表单
          _self.formBqBqglBqxx = response.data.result;
          // _self.getListBqBqglBqxx(1);//保存完 为什么要做列表查询 莫名其妙 应该查这个单条
          _self.getbyRfid(_self.formBqBqglBqxx.rfid);
          var retObj={'action':'刷新rfid','rfid':_self.formBqBqglBqxx.rfid}
          _self.$emit('retTzxq',retObj ) ;//返回父页面隐藏保存按钮
        });
    },

    //根据接收的rfid获取一条数据
    getbyRfid(rfid) {
      let _self = this
      if(rfid===""){
        _self.formBqBqglBqxx={};
        if(_self.isBqxxzjDisabled){
          _self.isBqBqglBqxxDisabled=true
          _self.formBqBqglBqxx={},
          _self.savedisabled=true
          var retObj={'action':'该资产未绑定标签信息        按钮只有一个关闭。'}
          _self.$emit('retTzxq', retObj) ;//返回父页面隐藏保存按钮
          return;
        }
        return _self
          .$confirm('此数据尚未绑定标签信息，是否绑定', '提示', {
            confirmButtonText: '选择标签进行绑定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            // _self.isBqBqglBqxxDisabled=false
            // this.savedisabled=false
            // _self.getListBqBqglBqxx(1)
            //先绑定
            _self.otherFilter="&zcid_isnull"
            _self.dialogBqxxListVisible=true;
          })
          .catch(() => {
            _self.isBqBqglBqxxDisabled=true
            _self.formBqBqglBqxx={},
            _self.savedisabled=true
            var retObj={'action':'没有关联标签'}
            _self.$emit('retTzxq', retObj) ;//返回父页面隐藏保存按钮
            _self.$message({
              type: 'info',
              message: '已取消操作'

            });
          });
      }else{
        _self.request
          .getList({
            url: 'bqBqglBqxx/getRfid/'+rfid,
          })
          .then(function(response) {
            _self.formBqBqglBqxx = response.data.result.oneBqBqglBqxx;
            let dicts = response.data.result.dicts; //下拉注释
            _self.commonUtils.translateDicts(dicts, _self.tableBqBqglBqxx, _self.dictsBqBqglBqxx);
          });
      }

    },


    //修改或者查看页
    goUpdateBqBqglBqxx(isBqBqglBqxxDisabled, rowData) {
      let _self = this;
      this.isRowClickBqBqglBqxx = true;
      this.formBqBqglBqxx = {};
      if (isBqBqglBqxxDisabled) {
        _self.bcShow = false;
      } else {
        _self.bcShow = true;
      }
      this.getOneBqBqglBqxx(rowData.id).then(function() {
        _self.dialogBqBqglBqxxFormVisible = true;
      });
      this.isBqBqglBqxxDisabled = isBqBqglBqxxDisabled;
    },
    handleBqBqglBqxxSelectionChange(val) {
      this.multipleSelectionBqBqglBqxx = val;
    },
    //获取列表
    getListBqBqglBqxx(page) {
      let _self = this;
      let filter = _self.commonUtils.getDefaultFilter(_self.searchBqBqglBqxxForm); //拼接查询条件
      _self.defaultSearchBqBqglBqxx.params.filter = filter;
      _self.defaultSearchBqBqglBqxx.params.page = page;

      //请求到后台
      _self.request
        .getList({
          url: 'bqBqglBqxx',
          params: _self.defaultSearchBqBqglBqxx.params
        })
        .then(function(response) {

          _self.tableBqBqglBqxx.tableData = response.data.result.records;
          _self.tableBqBqglBqxx.total = response.data.result.total;
          _self.tableBqBqglBqxx.curPageNum = page;
          let dicts = response.data.result.dicts; //下拉注释
          _self.commonUtils.translateDicts(dicts, _self.tableBqBqglBqxx, _self.dictsBqBqglBqxx);
        });
    }
  },
  //页面加载完成时执行
  mounted() {
    // this.isBqBqglBqxxDisabled =  this.isBqxxzjDisabled
    // this.getbyRfid(this.rfid)
   /* this.getOneBqBqglBqxx(this.bqxxId); */
    if(this.zcid!=""){//台账关联的时候 就算没有标签 资产名称也是要显示的
      this.formBqBqglBqxx.zcid=this.zcid;
      this.formBqBqglBqxx.zcmc=this.zcmc;
    }
    if(this.rfid!=""){//台账关联的时候 就算没有标签 资产名称也是要显示的
      this.getbyRfid(this.rfid);
    }
    this.localKbmc=this.kbmc;
    this.localKbqdid=this.kbqdid;
  },
  watch: {
    multipleSelectionBqBqglBqxx() {
      this.commonUtils.toggleSelectTrStyle(this);
    },
    //监控 sfqy 如果为1 则调用getrfid 根据rfid查询一条数据
    sfqy(){
      if(this.sfqy==='1'){ //打开标签的时候 才检查
        this.getbyRfid(this.rfid)
      }
    },

  }
};
</script>
