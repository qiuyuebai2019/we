<!--<template>-->
<!--  <div>-->
<!--    <el-row :gutter="15">-->
<!--      <el-col :span="6">-->
<!--        <div class="grid-content">-->
<!--          <h5 class="grid-hd">资产状态</h5>-->
<!--          &lt;!&ndash;        <div id="homePageDashBoardZcztChart" style="height: 500px;width:100%"></div>&ndash;&gt;-->
<!--          <div id="homePageDashBoardZcztChart" style="height:70%;width:100%"></div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <div class="grid-content">-->
<!--          <h5 class="grid-hd">资产类型</h5>-->
<!--          <div id="homePageDashBoardZclxChart" style="height:70%;width:100%"></div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <div class="grid-content">-->
<!--          <h5 class="grid-hd">{{bzgqTitle}}</h5>-->
<!--          <div id="homePageDashBoardQyChart" style="height:70%;width:100%"></div>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-col :span="6">-->
<!--        <div class="grid-content">-->
<!--          <h5 class="grid-hd" style="cursor: pointer" @click="openBjjlToday(0)">今日告警&nbsp;{{bjtotal}}</h5>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <div class="grid-text text1" @click="openBjjlToday(1)">-->
<!--                <img src="../../assets/image/home/task.png" alt="">-->
<!--                <div class="grid-data" >-->
<!--                  <p>已处理</p>-->
<!--                  <strong>{{bjycl}}</strong>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <div class="grid-text text2" @click="openBjjlToday(2)">-->
<!--                <img src="../../assets/image/home/alarm.png" alt="">-->
<!--                <div class="grid-data">-->
<!--                  <p>未处理</p>-->
<!--                  <strong>{{bjwcl}}</strong>-->
<!--                </div>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--      </el-col>-->
<!--      <el-dialog title="今日告警" :visible.sync="BjjlTodayDialogVisible" width="80%" top="2Vh">-->
<!--        <bqCjxxglBjjlToday ref="bjjltoday" @ycl="afterYcl" v-if="BjjlTodayDialogVisible" :state="whoOpen" :rfid="rfid"  :sfqy="sfqyBjjl" :isBjxxPlclDisabled="isBqxxzjDisabled" ></bqCjxxglBjjlToday>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="BjjlTodayDialogVisible=false">关 闭</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
<!--    </el-row>-->
<!--    &lt;!&ndash; 资产列表（资产状态列表）弹窗 &ndash;&gt;-->
<!--    <div class="map-form">-->
<!--      <el-dialog title="资产列表" width="80%" top="5Vh" :visible.sync="dialogZcztInHomePageDashBoardVisible" append-to-body>-->
<!--        <ZcztInHomePageDashBoard-->
<!--          ref="ZcztInHomePageDashBoard"-->
<!--          v-if="dialogZcztInHomePageDashBoardVisible"-->
<!--          :openZcztListType="openZcztListType"-->
<!--          :zt="zt"-->
<!--          :ssqybm="ssqybm"-->
<!--          :zclxbm="zclxbm"-->
<!--          :gldwByJL="gldwByJL"-->
<!--        ></ZcztInHomePageDashBoard>-->
<!--        <div slot="footer" class="dialog-footer">-->
<!--          <el-button @click="dialogZcztInHomePageDashBoardVisible = false">关 闭</el-button>-->
<!--        </div>-->
<!--      </el-dialog>-->
<!--    </div>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--  import bqCjxxglBjjlToday from "@/views/cjxxgl/bjjl/BqCjxxglBjjlToday"//告警记录-->
<!--  import ZcztInHomePageDashBoard from "@/views/common/ZcztInHomePageDashBoard"//首页面板中echart图点击后要用到的资产状态组件-->
<!--  import echarts from 'echarts';-->
<!--  import theme from '@/utils/echarts-color';-->
<!--    export default {-->
<!--        name: "HomeChart",-->
<!--      components: {bqCjxxglBjjlToday,ZcztInHomePageDashBoard},-->
<!--      data(){-->
<!--          return{-->
<!--            rfid:'',//向子组件传参  标签id-->
<!--            sfqyBjjl:'',//是否启用告警记录-->
<!--            BjjlTodayDialogVisible:false,-->
<!--            isBqxxzjDisabled:true,-->
<!--            whoOpen:'',-->
<!--            bjtotal:'',-->
<!--            bjycl:'',-->
<!--            bjwcl:'',-->
<!--            dialogZcztInHomePageDashBoardVisible:false,//资产列表弹窗，默认不显示。点击echart图中区域后才显示-->
<!--            openZcztListType:'',//打开资产状态列表的操作类型-->
<!--            zt:'',//传给资产状态组件的入参（标签状态，即资产状态）-->
<!--            ssqybm:'',//传给资产状态组件的入参（所属区域编码）,-->
<!--            zclxbm:'',-->
<!--            isShowLegend:true,-->
<!--            chartCenter:["30%", "45%"],-->
<!--            homePageDashBoardZclxChartBottom:'12%',-->
<!--            zcLxZc:[],  // 资产状态数据-->
<!--            listZclxbm: [],//资产类型编码存储-->
<!--            bzgqTitle : "班组工区",-->
<!--            listBzgqbm:[],//班组工区编码或者吉林的时候所属单位ID-->
<!--            gldwByJL:"",//吉林时管理单位参数-->
<!--          }-->
<!--      },-->
<!--      methods: {-->
<!--        //监控处理动作-->
<!--        afterYcl(val){-->
<!--          if (val=="OK"){-->
<!--            this.getBjCountToday();-->
<!--          }-->
<!--        },-->
<!--        //查询今日告警的数量-->
<!--        getBjCountToday(){-->
<!--          let _self = this-->
<!--          return _self.request.baseNoMask(-->
<!--            {-->
<!--             // methods:'post',-->
<!--              url: 'bqCjxxglBjjl/bjCount'-->
<!--            }-->
<!--          // )-->
<!--          // return _self.request.getOne(-->
<!--          //   {-->
<!--          //     url:'bqCjxxglBjjl/bjCount'-->
<!--          //   }-->
<!--          ).then(function (response) {-->
<!--            _self.bjtotal = response.data.result.total;-->
<!--            _self.bjycl = response.data.result.YCL;-->
<!--            _self.bjwcl = response.data.result.WCL;-->
<!--          })-->
<!--        },-->
<!--        openBjjlToday(val){-->
<!--          this.BjjlTodayDialogVisible=true;-->
<!--          if (val==0){-->
<!--            this.whoOpen = null;-->
<!--          } else if (val==1){-->
<!--            this.whoOpen = "YCL";-->
<!--          } else if (val==2){-->
<!--            this.whoOpen = "WCL";-->
<!--          }-->
<!--        },-->
<!--        // 获取资产状态-->
<!--        getZczt() {-->
<!--          let _self = this-->
<!--          // todo 第一次执行到 axiso的时候直接跳过了 没有执行then 和 carch-->
<!--          return  _self.request.getOne(-->
<!--            { url: 'bqBqglBqxx/getZczts'}-->
<!--          ).then(function (response) {-->
<!--            return response.data.result-->
<!--          });-->
<!--        },-->
<!--        //生成资产状态饼图-->
<!--        genHomePageDashBoardZcztChart() {-->
<!--          let _self = this;-->
<!--          //2020-02-22 在getZczt()返回函数中进行赋值操作解决由axiso异步影响而取不到值的问题。-->
<!--          this.getZczt().then(function(res){-->
<!--            let data=[];-->
<!--            let dataLegend=[];-->
<!--            let sizeAll=0;//总数目-->
<!--            for (let key in res) {-->
<!--              let itemColor = "";-->
<!--              if (key==="正常"){-->
<!--                itemColor = '#009688';-->
<!--              } else if (key==="告警"){-->
<!--                itemColor = '#F56C6C';-->
<!--              }else if (key==="离线"){-->
<!--                itemColor = '#C0C0C0';-->
<!--              }-->
<!--              dataLegend.push(key+" : "+res[key]+"台");-->
<!--              data.push({value:Number(res[key]),name:(key+" : "+res[key]+"台"),itemStyle:{color: itemColor}});-->
<!--              sizeAll=sizeAll+Number(res[key])-->
<!--            }-->
<!--            const option = {-->
<!--              tooltip: {-->
<!--                trigger: 'item',-->
<!--                formatter: '{a} <br/>{b}'-->
<!--              },-->
<!--              legend: {-->
<!--                show:_self.isShowLegend,-->
<!--                orient: 'vertical',-->
<!--                left: '60%',-->
<!--                top: '15%',-->
<!--                textStyle: {-->
<!--                  color: '#606266',//首页的统一的黑色，而不是默认的#000000的黑-->
<!--                },-->
<!--                data: dataLegend  // todo 这里没查到任何数据-->
<!--              },-->
<!--              series: [-->
<!--                {-->
<!--                  name: '资产状态',-->
<!--                  type: 'pie',-->
<!--                  radius: ['45%', '85%'],-->
<!--                  center: _self.chartCenter,-->
<!--                  avoidLabelOverlap: false,-->
<!--                  hoverAnimation:false,-->
<!--                  // silent:true,-->
<!--                  label: {-->
<!--                    normal: {-->
<!--                      show: true,-->
<!--                      position: 'center',-->
<!--                      formatter:function () {-->
<!--                        return sizeAll-->
<!--                      },-->
<!--                      textStyle:{-->
<!--                        fontSize: 15,-->
<!--                        fontWeight: '550',-->
<!--                        color: '#009688'-->
<!--                      }-->
<!--                    },-->
<!--                    emphasis: {-->
<!--                      show: true,-->
<!--                      textStyle: {-->
<!--                        fontSize: 15,-->
<!--                        fontWeight: '550',-->
<!--                        color: '#009688'-->
<!--                      }-->
<!--                    }-->
<!--                  },-->
<!--                  labelLine: {-->
<!--                    normal: {-->
<!--                      show: false-->
<!--                    }-->
<!--                  },-->
<!--                  data: data-->
<!--                }-->
<!--              ]-->
<!--            };-->
<!--            //初始化-->
<!--            echarts.registerTheme('sg-echarts', theme); // 注册主题-->
<!--            var homePageDashBoardZcztChart = echarts.init(document.getElementById('homePageDashBoardZcztChart'), 'sg-echarts');-->
<!--            // 绘制图表-->
<!--            homePageDashBoardZcztChart.setOption(option);-->
<!--            homePageDashBoardZcztChart.on("click", function(param){-->
<!--              _self.openZcztListType = 'clickHomePageDashBoardZcztChart';-->
<!--              // param.dataIndex //获取当前点击索引，-->
<!--              let index = param.dataIndex;-->
<!--              if(index==0){-->
<!--                _self.zt='ZC';-->
<!--              }else if(index==1){-->
<!--                _self.zt='GJ';-->
<!--              }else if(index==2){-->
<!--                _self.zt='LX';-->
<!--              }-->
<!--              _self.dialogZcztInHomePageDashBoardVisible = true;-->
<!--            });-->
<!--          });-->
<!--        },-->
<!--        // 获取资产类型-->
<!--        getZclx() {-->
<!--          let _self = this-->
<!--          //2020-02-22 添加return，在getZclx()返回函数中进行赋值操作-->
<!--          //解决由axiso异步影响而取不到值的问题。-->
<!--          return _self.request.getOne(-->
<!--            { url: 'bqBqglBqxx/getZclxZc'}-->
<!--          ).then(function (response) {-->
<!--            _self.zcLxZc=response.data.result.listCountGj-->
<!--            return response.data.result-->
<!--          });-->
<!--        },-->
<!--        //生成资产类型柱形图-->
<!--        genHomePageDashBoardZclxChart() {-->
<!--          let _self = this;-->
<!--          //2020-02-22 在getZclx()返回函数中进行赋值操作解决由axiso异步影响而取不到值的问题。-->
<!--          let labelArray=['互感器','杆   塔', '开闭所', '变压器'],zcData = [],lxData=[],gjData= [];-->

<!--          this.getZclx().then(function (res) {-->
<!--            zcData= res.listCountZc;-->
<!--            lxData= res.listCountLx;-->
<!--            gjData= res.listCountGj;-->
<!--            labelArray = res.listZclxmc;-->
<!--            console.log("1 labelArray="+labelArray);-->
<!--            _self.listZclxbm = res.listZclxbm;-->
<!--            if(_self.constant.common.sfjl=='Y'){//如果是吉林的时候 就只显示变压器 20200320 liukp 临时演示-->
<!--              labelArray=['变压器'];-->
<!--              for (let i = 0; i < res.listZclxmc.length; i++) {-->
<!--                if (res.listZclxmc[i] == "变压器") {-->
<!--                  zcData.push(res.listCountZc[i]);-->
<!--                  lxData.push(res.listCountLx[i]);-->
<!--                  gjData.push(res.listCountGj[i]);-->
<!--                  break;-->
<!--                }-->
<!--              }-->
<!--            }-->
<!--            console.log("2 labelArray="+labelArray);-->
<!--            console.log("lxData="+lxData);-->
<!--            console.log("zcData="+zcData);-->
<!--            const option = {-->
<!--              tooltip: {-->
<!--                trigger: 'axis',-->
<!--                axisPointer: {            // 坐标轴指示器，坐标轴触发有效-->
<!--                  type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'-->
<!--                }-->
<!--              },-->
<!--              legend: {-->
<!--                 show:_self.isShowLegend,-->
<!--                left: '13%',-->
<!--                bottom: '9%',-->
<!--                textStyle: {-->
<!--                  color: '#606266',//首页的统一的黑色，而不是默认的#000000的黑-->
<!--                },-->
<!--                data: ['正常', '告警', '离线']-->
<!--              },-->
<!--              grid: {-->
<!--                left: '3%',-->
<!--                right: '4%',-->
<!--                top: '1%',-->
<!--                bottom: _self.homePageDashBoardZclxChartBottom,-->
<!--                containLabel: true-->
<!--              },-->
<!--              xAxis: {-->
<!--                show: false,-->
<!--                type: 'value'-->
<!--              },-->
<!--              yAxis: {-->
<!--                show: true,-->
<!--                type: 'category',-->
<!--                axisTick: {-->
<!--                  show: false-->
<!--                },-->
<!--                axisLine: {-->
<!--                  show: false,-->
<!--                },-->
<!--                axisLabel: {-->
<!--                  textStyle: {-->
<!--                    color: '#606266',//首页的统一的黑色，而不是默认的#000000的黑-->
<!--                  },-->
<!--                },-->
<!--                // data: ['开闭所','杆   塔', '互感器', '变压器']-->
<!--                data: labelArray-->
<!--              },-->
<!--              series: [-->
<!--                {-->
<!--                  name: '正常',-->
<!--                  type: 'bar',-->
<!--                  stack: '总量',-->
<!--                  itemStyle: {-->
<!--                    normal: {-->
<!--                      color: '#009688'-->
<!--                    }-->
<!--                  },-->
<!--                  label: {-->
<!--                    show: false,-->
<!--                    position: 'insideRight'-->
<!--                  },-->
<!--                  barWidth: '60%',-->
<!--                  // data: res.listCountZc//["28","24","9","29"]-->
<!--                  data: zcData//["28","24","9","29"]-->
<!--                },-->
<!--                {-->
<!--                  name: '告警',-->
<!--                  type: 'bar',-->
<!--                  stack: '总量',-->
<!--                  itemStyle: {-->
<!--                    normal: {-->
<!--                      color: '#F56C6C'-->
<!--                    }-->
<!--                  },-->
<!--                  label: {-->
<!--                    show: false,-->
<!--                    position: 'insideRight'-->
<!--                  },-->
<!--                  data: gjData//[1, 1, 1, 1]-->
<!--                },-->
<!--                {-->
<!--                  name: '离线',-->
<!--                  type: 'bar',-->
<!--                  stack: '总量',-->
<!--                  itemStyle: {-->
<!--                    normal: {-->
<!--                      color: '#C0C0C0'-->
<!--                    }-->
<!--                  },-->
<!--                  label: {-->
<!--                    show: false,-->
<!--                    position: 'insideRight'-->
<!--                  },-->
<!--                  data:lxData//[2, 2, 1, 1]-->
<!--                  // data: this.getZclx()-->
<!--                }-->
<!--              ]-->
<!--            };-->
<!--            //初始化-->
<!--            echarts.registerTheme('sg-echarts', theme); // 注册主题-->
<!--            var homePageDashBoardZclxChart = echarts.init(document.getElementById('homePageDashBoardZclxChart'), 'sg-echarts');-->
<!--              homePageDashBoardZclxChart.setOption(option);-->
<!--            for (let i = 0; i <_self.listZclxbm.length; i++) {-->
<!--              homePageDashBoardZclxChart.on('click',-->
<!--                {dataIndex:i,name:labelArray[i]},-->
<!--                function (param) {-->
<!--                  _self.openZcztListType = 'clickHomePageDashBoardZclxChart';-->
<!--                  _self.zclxbm = _self.listZclxbm[i]-->
<!--                  _self.dialogZcztInHomePageDashBoardVisible = true-->
<!--                }-->
<!--              );-->
<!--            }-->

<!--            // 绘制图表-->
<!--         /*   homePageDashBoardZclxChart.on('click', function (param) {-->
<!--              debugger-->
<!--              _self.openZcztListType = 'clickHomePageDashBoardZclxChart';-->
<!--              if(param.dataIndex==1&&param.name==""){//异常情况 暂时未解决TODO //-->
<!--                _self.zclxbm = _self.listZclxbm[0]-->
<!--              }else{-->
<!--                _self.zclxbm = _self.listZclxbm[param.dataIndex]-->
<!--              }-->
<!--              console.log(param)-->
<!--              console.log("_self.listZclxbm="+_self.listZclxbm+"+_self.zclxbm="+_self.zclxbm)-->
<!--              _self.dialogZcztInHomePageDashBoardVisible = true-->
<!--            })*/-->

<!--        });-->
<!--        },-->

<!--        // 获取班组工区-->
<!--        getBzgq() {-->
<!--          let _self = this;-->
<!--          let url = ""-->
<!--          if(_self.constant.common.sfjl=='Y'){//如果是吉林的时候 就只显示变压器 20200320 liukp 临时演示-->
<!--            url = 'bqBqglBqxx/getBzgqByJL'-->
<!--            _self.bzgqTitle = "管理单位"-->
<!--          } else {-->
<!--            url = 'bqBqglBqxx/getBzgq'-->
<!--            _self.bzgqTitle = "班组工区"-->
<!--          }-->
<!--          //2020-02-22 添加return，在getBzgq()返回函数中进行赋值操作-->
<!--          //解决由axiso异步影响而取不到值的问题。-->
<!--         return  _self.request.getOne(-->
<!--            { url: url}-->
<!--          ).then(function (response) {-->
<!--            //组装区域饼图需要用到的数据。-->
<!--            let data = [],child0 = [],child1 = [],sumAll=0;-->
<!--            let dataResult = response.data.result-->
<!--           let countAll = 0; // 后台传过来的数据中   把设备总数量加起来-->
<!--           for (let i = 0; i < dataResult.length; i++) {-->
<!--             countAll+=dataResult[i].count;-->
<!--           }-->
<!--           let sumCount = 0; // 临时变量，用于计算百分比的-->
<!--           for (let i = 0; i < dataResult.length; i++) {-->
<!--             // Math.round 四舍五入-->
<!--             let count = Math.round(Number(dataResult[i].count)/countAll*100)   // 四舍五入 （单项count/count总和*100转成百分数）-->

<!--             let orgname= dataResult[i].name;-->
<!--             /*if(orgname.indexOf('国网')>-1){-->
<!--               orgname=orgname.replace('国网','')-->
<!--             }-->
<!--             if(orgname.indexOf('供电公司')>-1){-->
<!--               orgname=orgname.replace('供电公司','')-->
<!--             }*/-->

<!--             // 假如i==dataResult.length-1 说明是最后一项，这个时候直接用100-之前的sumCount即可-->
<!--             if (i==dataResult.length-1){-->
<!--               count = 100-sumCount;-->
<!--             }-->
<!--             child0.push(orgname+" "+count+"%");-->
<!--             child1.push({"value":Number(dataResult[i].count),"name":(orgname+" "+count+"%")});-->
<!--             sumAll = sumAll+Number(dataResult[i].count);-->
<!--             _self.listBzgqbm.push(dataResult[i].bm)-->
<!--             sumCount = sumCount+count-->
<!--           }-->
<!--           console.log(child0)-->
<!--            /*for (let key in dataResult){-->
<!--              if (key.split("_")[0] == 'bm') {-->
<!--                _self.listBzgqbm.push(dataResult[key])-->
<!--              }else {-->
<!--                child0.push(key+" "+dataResult[key]+"%");-->
<!--                child1.push({"value":Number(dataResult[key]),"name":(key+" "+dataResult[key]+"%")});-->
<!--                sumAll=sumAll+Number(dataResult[key]);-->
<!--              }-->
<!--            }*/-->
<!--            data.push(child0);-->
<!--            data.push(child1);-->
<!--            data.push(sumAll);//总数-->
<!--            return data;-->
<!--          });-->
<!--        },-->


<!--        //生成区域饼图-->
<!--        genHomePageDashBoardQyChart() {-->
<!--          let _self = this;-->
<!--          let dataShow = [[],[]];-->
<!--          //2020-02-22 在getBzgq()返回函数中进行赋值操作-->
<!--          //解决由axiso异步影响而取不到值的问题。-->
<!--          this.getBzgq().then(function (res) {-->
<!--            dataShow = res;-->

<!--            const option = {-->
<!--              tooltip: {-->
<!--                trigger: 'item',-->
<!--                formatter: '{a} <br/>{b}'-->
<!--              },-->
<!--              legend: {-->
<!--                show:_self.isShowLegend,-->
<!--                orient: 'vertical',-->
<!--                left: '60%',-->
<!--                top: '15%',-->
<!--                textStyle: {-->
<!--                  color: '#606266',//首页的统一的黑色，而不是默认的#000000的黑-->
<!--                },-->
<!--                // data: ['西区 35%', '中区 20%', '东区 45%']-->
<!--                data: dataShow[0]-->
<!--              },-->
<!--              series: [-->
<!--                {-->
<!--                  name: _self.bzgqTitle,-->
<!--                  type: 'pie',-->
<!--                  radius: ['45%', '85%'],-->
<!--                  center: _self.chartCenter,-->
<!--                  avoidLabelOverlap: false,-->
<!--                  hoverAnimation:false,-->
<!--                  label: {-->
<!--                    normal: {-->
<!--                      show: true,-->
<!--                      position: 'center',-->
<!--                      formatter:function () {-->
<!--                        return dataShow[2]//总数-->
<!--                      },-->
<!--                      textStyle:{-->
<!--                        fontSize: 15,-->
<!--                        fontWeight: '550',-->
<!--                        color: '#009688'-->
<!--                      }-->
<!--                    },-->
<!--                    emphasis: {-->
<!--                      show: true,-->
<!--                      fontSize: 15,-->
<!--                      fontWeight: '550',-->
<!--                      color: '#009688'-->
<!--                    }-->
<!--                  },-->
<!--                  labelLine: {-->
<!--                    normal: {-->
<!--                      show: false-->
<!--                    }-->
<!--                  },-->
<!--                  data: dataShow[1]-->
<!--                }-->
<!--              ]-->
<!--            };-->
<!--            //初始化-->
<!--            echarts.registerTheme('sg-echarts', theme); // 注册主题-->
<!--            var homePageDashBoardQyChart = echarts.init(document.getElementById('homePageDashBoardQyChart'), 'sg-echarts');-->
<!--            // 绘制图表-->
<!--            homePageDashBoardQyChart.setOption(option);-->
<!--            homePageDashBoardQyChart.on("click", function(param){-->
<!--              if (_self.constant.common.sfjl=='Y') {-->
<!--                _self.openZcztListType = 'clickHomePageDashBoardPieQyJL';-->
<!--                // param.dataIndex //获取当前点击索引，-->
<!--                _self.gldwByJL= _self.listBzgqbm[param.dataIndex]-->
<!--              }else {-->
<!--                _self.openZcztListType = 'clickHomePageDashBoardQyChart';-->
<!--                // param.dataIndex //获取当前点击索引，-->
<!--                _self.ssqybm= _self.listBzgqbm[param.dataIndex]-->

<!--              }-->
<!--              _self.dialogZcztInHomePageDashBoardVisible = true;-->
<!--            });-->
<!--          });-->
<!--        }-->
<!--      },-->
<!--      mounted() {-->
<!--      if(this.windowInnerWidth<=1335){-->
<!--          this.isShowLegend=false-->
<!--          this.chartCenter=["50%", "50%"],-->
<!--          this.homePageDashBoardZclxChartBottom='0%'-->
<!--      }-->

<!--        this.genHomePageDashBoardZcztChart();-->
<!--        this.genHomePageDashBoardZclxChart();-->
<!--        this.genHomePageDashBoardQyChart();-->
<!--        this.getBjCountToday();-->
<!--        this.timer = setInterval(() =>{-->
<!--           // 今日告警改成定时刷新获取 每20秒-->
<!--          this.getBjCountToday();-->
<!--        },1000* 20)-->
<!--        console.log(this.windowInnerWidth)-->

<!--      },-->
<!--    }-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--  .grid-content{-->
<!--    height: 165px;-->
<!--    background: #fff;-->
<!--    /*padding: 10px;*/-->
<!--    /*box-sizing: border-box;*/-->
<!--    .grid-hd{-->
<!--      color: #009688;-->
<!--      font-size: 15px;-->
<!--      padding-left: 30px;-->
<!--      line-height: 40px;-->
<!--    }-->
<!--    .error-group{-->
<!--      padding: 10px;-->
<!--      box-sizing: border-box;-->
<!--      margin-top: 20px;-->
<!--      .error-list{-->
<!--        float: left;-->
<!--        width: 50%;-->
<!--        text-align: center;-->
<!--        .list-name{-->
<!--          color: #3d3d3d;-->
<!--        }-->
<!--        .list-number{-->
<!--          color: #00C6AD;-->
<!--          font-size: 25px;-->
<!--          font-weight: normal;-->
<!--        }-->
<!--      }-->
<!--    }-->
<!--    .alarm-list{-->
<!--      font-style: normal;-->
<!--      padding: 0 10px;-->
<!--      box-sizing: border-box;-->
<!--      height: 108px;-->
<!--      overflow: scroll;-->
<!--      .alarm-list-item{-->
<!--        font-size: 12px;-->
<!--        .alarm-id{color: #00c5ad;}-->
<!--        .alarm-desc{color: #aaa;}-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--  .grid-text{-->
<!--    cursor: pointer;-->
<!--    padding: 30px 16%;-->
<!--    text-align: center;-->
<!--    img{-->
<!--      float: left;-->
<!--      display: inline-block;-->
<!--      width: 46px;-->
<!--      /*text-align: center;*/-->
<!--    }-->
<!--    .grid-data{-->
<!--      float: left;-->
<!--      p{}-->
<!--      strong{-->
<!--        font-weight: 400;-->
<!--        font-size: 20px;-->
<!--      }-->
<!--    }-->
<!--    &.text1{-->
<!--      color: #009688;-->
<!--    }-->
<!--    &.text2{-->
<!--      color:#f66c6c;-->
<!--    }-->
<!--  }-->

<!--//适应小屏幕-->
<!--@media screen and (max-width: 1335px) {-->
<!--   .grid-content{-->
<!--       height: 130px;-->
<!--       background: #fff;-->
<!--        .grid-hd{-->
<!--             color: #009688;-->
<!--             font-size: 14px;-->
<!--             padding-left: 20px;-->
<!--             line-height: 35px;-->
<!--        }-->
<!--        .grid-text{-->
<!--            cursor: pointer;-->
<!--            padding: 15px 8px;-->
<!--            text-align: center;-->
<!--            img{-->
<!--              float: left;-->
<!--              display: inline-block;-->
<!--              width: 37px;-->
<!--              /*text-align: center;*/-->
<!--            }-->
<!--            .grid-data{-->
<!--              float: left;-->
<!--              p{-->
<!--                font-size:13px-->
<!--              }-->
<!--              strong{-->
<!--                font-weight: 400;-->
<!--                font-size: 15px;-->
<!--              }-->
<!--            }-->
<!--            &.text1{-->
<!--              color: #009688;-->
<!--            }-->
<!--            &.text2{-->
<!--              color:#f66c6c;-->
<!--            }-->
<!--          }-->
<!--    }-->

<!--}-->
<!--</style>-->
