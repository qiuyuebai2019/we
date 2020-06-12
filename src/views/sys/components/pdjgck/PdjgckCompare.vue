<!-- 图表 -->
<!-- 资产台账信息模块 历史数据选项卡 对比 折线图组件 -->
<template>
  <div>
    <div class="map-search-bar">
      <el-form label-width="110px" :model="searchBqCjxxglLssjForm" class="clear">

        <el-form-item label="告警时间" class="w50">
          <el-date-picker :editable="false" disabled="true" v-model="bjsj" type="datetimerange" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"></el-date-picker>
        </el-form-item>

        <el-form-item class="w25" label="类型"><!--感知信息项编码-->
          <el-select v-model="gzxxxbm" placeholder="请选择">
            <el-option v-for="item in gzxxxVal" :key="item.value" :label="item.text" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

      </el-form>
    </div>

    <!-- 操作按钮 -->
    <div class="map-handle-bar">
      <el-row>
        <el-col>
          <div class="map-search-handel">
            <!--            <el-button type="primary" @click="getListBqCjxxglLssj(1,'CXJZ')" size=small>查询</el-button>-->
            <el-button type="primary" @click="getCompareChart()" size=small>查询</el-button>
          </div>
        </el-col>
      </el-row>
    </div>

    <div id="zcztxxLssjCompareChart" style="height: 500px;width:100%"></div>
  </div>

</template>

<script>
  import echarts from 'echarts';
  import theme from '@/utils/echarts-color';
  import json from "../../../../components/print-js/src/js/json";
  export default {
    name: 'PdjgckCompare',
    props: ['rfidArrayForZcztxxLssjCompareLineStack','zcmcArrayForZcztxxLssjCompareLineStack','pdrq','pdsx'],//入参：rfid数组，zcmc数组  'dbgzxxxbm'  要对比的感知信息项
    data() {
      return {
        searchBqCjxxglLssjForm: {},
        bjsj : null,//上传时间
        gzxxxVal : [],//感知信息项
        gzxxxbm: null,//感知信息项编码
        titleText: '',//折线图标题：例如“温度曲线”，该变量置为“温度”等，后面要在代码中加上“曲线”
        firstData:[],//第一条曲线的坐标数据
        series:[],//用于绘制所有折线总数据的series（其中每一个元素是每一条折线的全部数据）
      };
    },

    methods: {
      //获取绘制比对曲线所需要的数据，并绘制曲线
      getCompareChart() {
        let _self = this

        if (_self.commonUtils.isStrIsNull(_self.bjsj)) {
          let date = new Date(_self.pdrq);
          _self.bjsj = [date,new Date(date.valueOf() + _self.pdsx*1000)]
        }
        _self.searchBqCjxxglLssjForm.bjsj = _self.bjsj
        let filter = _self.commonUtils.getDefaultFilter(_self.searchBqCjxxglLssjForm)//拼接查询条件
        let data = {}

        _self.series = [];//置为空，防止之前遗留数据的影响

        //filter：查询条件，zcmc：资产名称，rfid：设备ID，page：当前显示的页数，scPageNum：上次数据的总条数，pageSize：当前每页显示多少条数据，hqfs：数据获取的方式，'CXJZ':重新加载、'REDIS':REDIS获取，gzxxxbm：温度、湿度、位移等等的编码
        data = {"filter":filter,"zcmc":'',"rfidArrayForZcztxxLssjCompareLineStack":_self.rfidArrayForZcztxxLssjCompareLineStack,"page":1,"scPageNum":1,"pageSize":20,"hqfs":'CXJZ',"gzxxxbm":_self.gzxxxbm}
        //请求到后台
        _self.request.post(
          {
            url:'bqCjxxglGzsj/getListListLssjForZcztxxLssjCompareLineStack',
            data: data,
            method:"post"
          }
        ).then(function (response) {

          let dataForAllLineStack = response.data.result.dataForAllLineStack;
          let lengthOfRfidArrayForZcztxxLssjCompareLineStack = _self.rfidArrayForZcztxxLssjCompareLineStack.length;
          for(let k=0; k<lengthOfRfidArrayForZcztxxLssjCompareLineStack; k++){
            let oneSeries = {};//每一条折线的series数据
            oneSeries['name'] = _self.zcmcArrayForZcztxxLssjCompareLineStack[k];
            oneSeries['type'] = 'line';
            let oneSeriesData = [];
            if(dataForAllLineStack[k]){
              for(let j=0; j<dataForAllLineStack[k].length; j++){
                oneSeriesData.push(dataForAllLineStack[k][j].value);
              }
            }
            oneSeries['data'] = oneSeriesData;
            oneSeries['smooth'] = true;
            _self.series.push(oneSeries);

            if(k==0){
              if(dataForAllLineStack[k]) {
                //以下这句是为了给xAxis产生数据
                _self.firstData = dataForAllLineStack[k];
              }else {
                // 以下是在后台返回数据为空的情况下在前台手动为xAxis轴赋值
                //debugger
                _self.firstData = _self.getBetweenDateList(_self.formatDate(_self.searchBqCjxxglLssjForm.bjsj[0]), _self.formatDate(_self.searchBqCjxxglLssjForm.bjsj[1]))
              }

              let res = response.data.result
              if (res.gzxxxList !== null) {
                _self.gzxxxVal = []
                _self.gzxxxbm = res.gzxxxbm
                for (let i = 0; i < res.gzxxxList.length; i++) {
                  _self.gzxxxVal.push({"text":res.gzxxxList[i].gzxxx,"value":res.gzxxxList[i].gzxxxbm})
                  //下面这个if用于获取折线图的titleText
                  if(_self.gzxxxbm == res.gzxxxList[i].gzxxxbm){
                    _self.titleText = res.gzxxxList[i].gzxxx
                  }
                }
              }
            }
          }
          _self.genZcztxxLssjCompareChart();
        })
      },

      // 获取所有日期
      getBetweenDateList(start,end){
        let result = [];
        let beginDay = start.split(":");
        let endDay = end.split(":");
        let diffDay = new Date();
        let dateList = new Array;
        let i = 0;
        if(String(endDay[0]).length == 1){endDay[0] = "0"+endDay[0]}
        if(String(endDay[1]).length == 1){endDay[1] = "0"+endDay[1]}
        if(String(endDay[2]).length == 1){endDay[2] = "0"+endDay[2]}
        diffDay.setSeconds(beginDay[2]);
        diffDay.setMinutes(beginDay[1]);
        diffDay.setHours(beginDay[0]);
        let countDay = diffDay.getTime();
        while(i == 0){
          diffDay.setTime(countDay);
          dateList[2] = diffDay.getSeconds();
          dateList[1] = diffDay.getMinutes();
          dateList[0] = diffDay.getHours();
          if(String(dateList[1]).length == 1){dateList[1] = "0"+dateList[1]}
          if(String(dateList[2]).length == 1){dateList[2] = "0"+dateList[2]}
          result.push({time: dateList[0]+":"+dateList[1]+":"+dateList[2]});
          if(this.pdsx>=10){
            countDay = diffDay.getTime() + 10 * 1000;
          }else {
            countDay = diffDay.getTime() + 1 * 1000;
          }
          if(dateList[0] == endDay[0] && dateList[1] == endDay[1] && dateList[2] == endDay[2]){ i = 1;
          }
        }
        console.log('result', result)
        return result;
      },

      // 将日期转换成hh:mm:ss
      formatDate(date) {
        var d = new Date(date),
          hour = '' + d.getHours(),
          minute = '' + d.getMinutes(),
          second = d.getSeconds();
        return [hour, minute, second].join(':');
      },

      genZcztxxLssjCompareChart() {
        let _self = this;
        const option = {
          title: {
            text: _self.titleText+'曲线' //主题（感知信息项+曲线）
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: (function(){
              var res = [];
              var len = _self.zcmcArrayForZcztxxLssjCompareLineStack.length;
              for(var i=0;i<len;i++) {
                res.push(_self.zcmcArrayForZcztxxLssjCompareLineStack[i]);
              }
              return res;
            })()
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: (function(){
              var res = [];
              var len = _self.firstData.length;
              for(var i=0;i<len;i++) {
                var tmp = _self.firstData[i].time;
                res.push(tmp.substring(0,10));
              }
              return res;
            })(),
          },
          yAxis: {
            type: 'value'
          },
          series: _self.series
        };
        //初始化
        echarts.registerTheme('sg-echarts', theme); // 注册主题
        let zcztxxLssjCompareChart = document.getElementById('zcztxxLssjCompareChart');
        var myChart = echarts.init(zcztxxLssjCompareChart, 'sg-echarts');
        // 绘制图表
        myChart.setOption(option);
      }
    },
    mounted() {
      this.getCompareChart();
    },
    watch:{
      rfidArrayForZcztxxLssjCompareLineStack(){
        this.getCompareChart();
      }
    }
  };
</script>
