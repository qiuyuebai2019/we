<template>
      <!--
        update by wht 2020-01-10 10:55:02
        根据浏览器窗口大小计算echart的宽度
        echart宽度=浏览器窗口宽度-弹窗边距-固定边距
      -->
      <div  id="historyLineChart"  :style="{'height':'400px','width':windowInnerWidth-(windowInnerWidth*0.2)-108+'px'}"></div>
</template>

<script>
    import echarts from "echarts";
    import theme from "@/utils/echarts-color";
    export default {
      name: "HistoryLineChart",
      props:['dataAll','zcxx','gzxxx','gjsx','gjxx'],
      data(){
          return{
            isRefresh:0,
            xAxisData :[],
            seriesData :[],
            piecesWsx: [{
              gt: 0,
              lte: this.gjxx,
              color: '#ffde33'
            }, {
              gt: this.gjxx,
              color: '#096'
            }],
            piecesYsx: [{
              gt: 0,
              lte: this.gjxx,
              color: '#ffde33'
            }, {
              gt: this.gjxx,
              lte: this.gjsx,
              color: '#096'
            }, {
              gt: this.gjsx,
              color: 'red'
            }],
            dataYsx:[{
              yAxis: this.gjxx
            }, {
              yAxis: this.gjsx
            }],
            dataWsx:[{
              yAxis: this.gjxx
            }]
          }
      },
      methods:{
        //整理曲线组件需要的数据
        getChartData(){
          this.xAxisData=[]
          this.seriesData = []
          if(this.commonUtils.isStrIsNull(this.dataAll)){
            return
          }

          console.log(this.dataAll)
          if(this.dataAll.length>0){
            let len = this.dataAll.length;
            for(let i=0;i<len;i++) {
              this.xAxisData.push(this.dataAll[i].time);
              this.seriesData.push(this.dataAll[i].value)
            }
          }else{
            return
          }

          this.makeLineChart()
        },
        makeLineChart(){
          let _self = this
          let pieces
          let data
          if(_self.gjsx!==null && _self.gjsx!==undefined && _self.gjsx!==''){
            pieces=_self.piecesYsx
            data=_self.dataYsx
          }else{
            pieces=_self.piecesWsx
            data=_self.dataWsx
          }
          const option = {
            tooltip: {
              trigger: 'axis'
            },
            xAxis: {
              data:(function(){
                let res = [];
                let len = _self.dataAll.length;
                for(let i=0,size=len;i<size;i++) {
                  res.push(_self.dataAll[i].time);
                }
                return res;
              })()
            },
            yAxis: {
              splitLine: {
                show: false
              }
            },
            //图标按钮
            toolbox: {
              left: 'center',
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
              }
            },
            //放大缩小
            dataZoom: [{
              startValue: _self.dataAll[0].time//从哪里开始放大或缩小
            }, {
              type: 'inside'
            }],
            visualMap: {
              top: 10,
              right: 10,
              pieces: pieces,
              outOfRange: {
                color: '#999'
              }
            },
            series: {
              name: this.gzxxxmc,
              type: 'line',
              data:(function () {
                let res = [];
                let len = _self.dataAll.length;
                for (let i = 0, size = len; i < size; i++) {
                  res.push(_self.dataAll[i].value);
                }
                return res;
              })(),
              markLine: {
                silent: true,
                data:data
              },
              smooth: true
            }
          }
          echarts.registerTheme('sg-echarts', theme) // 注册主题
          var myChart = echarts.init(document.getElementById('historyLineChart'),"sg-echarts");
          // 绘制图表
          myChart.setOption(option)
        }
      },
      mounted() {
          this.makeLineChart()
      },
      watch: {
        dataAll: function (val) { // 监听数据变化
          this.makeLineChart()
          console.log(1,this.gzxxx)
        },
         gzxxx: function (val) { // 监听数据变化
            console.log(2,this.gzxxx)
         },
        historyLineChart:function () {
          this.makeLineChart()
        }
      }
    }
</script>
