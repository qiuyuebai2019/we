<template>
    <div class="index">
      <el-row :gutter="10">
        <el-col :span="6">
          <div class="data-info sg-color-1">
            <div class="data-hd">
              <h6 class="hd-title">待办任务</h6>
<!--              <span class="hd-range"><i class="fa fa-level-up"></i> 5.61%</span>-->
            </div>
            <div class="data-bd">
              <strong>{{totalTodo}}</strong>
              <svg t="1572946965942" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="824" width="48" height="48"><path d="M785.06666667 430.08c0-13.65333333-13.65333333-27.30666667-27.30666667-27.30666667H266.24c-13.65333333 0-27.30666667 13.65333333-27.30666667 27.30666667s13.65333333 27.30666667 27.30666667 27.30666667h491.52c13.65333333 0 27.30666667-13.65333333 27.30666667-27.30666667z m-357.71733334 136.53333333H271.70133333c-16.384 0-30.03733333 10.92266667-30.03733333 27.30666667 0 13.65333333 13.65333333 27.30666667 30.03733333 27.30666667h155.648c16.384 0 30.03733333-13.65333333 30.03733334-27.30666667 0-16.384-13.65333333-27.30666667-30.03733334-27.30666667z m0 163.84H271.70133333c-16.384 0-30.03733333 10.92266667-30.03733333 27.30666667 0 13.65333333 13.65333333 27.30666667 30.03733333 27.30666667h155.648c16.384 0 30.03733333-13.65333333 30.03733334-27.30666667 0-16.384-13.65333333-27.30666667-30.03733334-27.30666667zM757.76 238.93333333H266.24c-13.65333333 0-27.30666667 13.65333333-27.30666667 27.30666667s13.65333333 27.30666667 27.30666667 27.30666667h491.52c13.65333333 0 27.30666667-13.65333333 27.30666667-27.30666667S771.41333333 238.93333333 757.76 238.93333333z" p-id="825" fill="#ffffff"></path><path d="M512 948.90666667H129.70666667V75.09333333h764.58666666v409.6c0 16.384 10.92266667 27.30666667 27.30666667 27.30666667s27.30666667-10.92266667 27.30666667-27.30666667V47.78666667c0-13.65333333-13.65333333-27.30666667-27.30666667-27.30666667H102.4c-13.65333333 0-27.30666667 13.65333333-27.30666667 27.30666667v928.42666666c0 13.65333333 13.65333333 27.30666667 27.30666667 27.30666667h409.6c16.384 0 27.30666667-10.92266667 27.30666667-27.30666667s-10.92266667-27.30666667-27.30666667-27.30666666z" p-id="826" fill="#ffffff"></path><path d="M785.06666667 566.61333333c-120.14933333 0-218.45333333 98.304-218.45333334 218.45333334S664.91733333 1003.52 785.06666667 1003.52 1003.52 905.216 1003.52 785.06666667 905.216 566.61333333 785.06666667 566.61333333z m0 382.29333334c-90.112 0-163.84-73.728-163.84-163.84S694.95466667 621.22666667 785.06666667 621.22666667 948.90666667 694.95466667 948.90666667 785.06666667 875.17866667 948.90666667 785.06666667 948.90666667z" p-id="827" fill="#ffffff"></path><path d="M866.98666667 757.76h-54.61333334v-54.61333333c0-13.65333333-13.65333333-27.30666667-27.30666666-27.30666667s-27.30666667 13.65333333-27.30666667 27.30666667V785.06666667c0 13.65333333 13.65333333 27.30666667 27.30666667 27.30666666h81.92c13.65333333 0 27.30666667-13.65333333 27.30666666-27.30666666s-13.65333333-27.30666667-27.30666666-27.30666667z" p-id="828" fill="#ffffff"></path></svg>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-info sg-color-4">
            <div class="data-hd">
              <h6 class="hd-title">已办任务</h6>
              <!--              <span class="hd-range"><i class="fa fa-level-up"></i> 1.25%</span>-->
            </div>
            <div class="data-bd">
              <strong>657</strong>
              <svg t="1572947030808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1050" width="48" height="48"><path d="M549.727 966.947H148.011c-50.259 0-91.143-40.893-91.143-91.152v-726.96c0-50.611 40.883-91.782 91.143-91.782H800.6c50.611 0 91.781 41.17 91.781 91.782v440.47c0 15.717 12.736 28.434 28.434 28.434 15.735 0 28.435-12.717 28.435-28.434v-440.47c0-81.97-66.68-148.65-148.649-148.65h-652.59C66.402 0.185 0 66.865 0 148.835v726.96c0 81.6 66.402 148.02 148.011 148.02h401.715c15.698 0 28.435-12.734 28.435-28.434 0-15.717-12.736-28.434-28.434-28.434z m199.039-361.074c0-15.717-12.735-28.434-28.434-28.434H228.927c-15.708 0-28.434 12.717-28.434 28.434s12.726 28.434 28.434 28.434h491.405c15.698 0 28.434-12.717 28.434-28.434z m-519.83 160.924c-15.708 0-28.435 12.736-28.435 28.434 0 15.717 12.727 28.434 28.435 28.434h199.798c15.707 0 28.434-12.717 28.434-28.434 0-15.697-12.727-28.434-28.434-28.434H228.936z m491.396-378.715H228.927c-15.708 0-28.434 12.717-28.434 28.434 0 15.698 12.726 28.434 28.434 28.434h491.405c15.698 0 28.434-12.736 28.434-28.434 0-15.717-12.736-28.434-28.434-28.434z m0-189.376H228.927c-15.708 0-28.434 12.736-28.434 28.434 0 15.716 12.726 28.434 28.434 28.434h491.405c15.698 0 28.434-12.718 28.434-28.434 0-15.698-12.736-28.434-28.434-28.434z m295.338 524.329c-11.107-11.107-29.102-11.107-40.208 0L743.324 955.174l-137.099-137.1c-11.107-11.107-29.101-11.107-40.208 0-11.107 11.088-11.107 29.102 0 40.207l157.203 157.203c5.553 5.555 12.81 8.33 20.104 8.33a28.371 28.371 0 0 0 20.104-8.33l252.242-252.242c11.106-11.107 11.106-29.119 0-40.207z" p-id="1051" fill="#ffffff"></path></svg>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-info sg-color-3">
            <div class="data-hd">
              <h6 class="hd-title">督办</h6>
<!--              <span class="hd-range"><i class="fa fa-level-up"></i> 30.93%</span>-->
            </div>
            <div class="data-bd">
              <strong>234</strong>
              <svg t="1572952750805" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="13727" width="48" height="48"><path d="M153.871 100.815h600.467v328.374s30.471 17.207 43.735 30.83l21.509 22.585v-387.525c0-32.622-26.886-59.509-59.509-59.509h-611.938c-32.622 0-59.509 26.886-59.509 59.509v792.257c0 32.98 26.528 59.509 59.509 59.509h288.582l0.358-65.245h-283.205v-780.786z" fill="#ffffff" p-id="13728"></path><path d="M665.433 340.285h-419.072c-17.924 0-32.622 14.698-32.622 32.622s14.698 32.622 32.622 32.622h419.43c16.849-1.434 30.112-15.414 30.112-32.622-0.358-17.207-13.622-31.547-30.471-32.622zM888.412 793.412h-45.529l-88.546-123.679c39.434-20.075 65.245-60.943 65.245-105.755 0-65.962-53.414-119.377-119.377-119.377-65.603 0-119.377 53.414-119.377 119.377 0 45.887 26.17 85.678 64.886 105.755l-88.546 123.679h-45.529c-32.98 0-59.509 26.886-59.509 59.509v75.999c0 32.98 26.886 59.509 59.509 59.509h376.412c32.98 0 59.509-26.528 59.509-59.509v-75.999c0.358-32.98-26.17-59.509-59.151-59.509zM700.206 509.85c29.754 0 54.132 24.018 54.132 54.132-0.358 29.754-24.377 54.132-54.491 54.132-29.037-1.075-51.981-24.735-51.981-54.132s23.301-53.414 52.339-54.132zM700.206 705.584l62.735 87.471h-125.113l62.377-87.471zM882.676 858.657v64.886h-364.94v-64.886h364.94zM698.055 261.058c-0.358-16.849-13.981-30.471-30.83-30.471h-421.581c-15.773 1.434-28.32 14.339-28.32 30.471s12.547 29.395 28.32 30.471h421.581c17.207 0 30.83-13.622 30.83-30.471z" fill="#ffffff" p-id="13729"></path></svg>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="data-info sg-color-5">
            <div class="data-hd">
              <h6 class="hd-title">预警</h6>
<!--              <span class="hd-range"><i class="fa fa-level-down"></i> 46.23%</span>-->
            </div>
            <div class="data-bd">
              <strong>12</strong>
              <svg t="1572952675574" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12646" width="48" height="48"><path d="M976.213333 1013.76H47.786667c-20.48 0-37.546667-17.066667-37.546667-37.546667 0-20.48 17.066667-37.546667 37.546667-37.546666h931.84c20.48 0 37.546667 17.066667 37.546666 37.546666-3.413333 20.48-20.48 37.546667-40.96 37.546667M512 259.413333c-191.146667 0-344.746667 157.013333-344.746667 344.746667v337.92h689.493334v-337.92c0-191.146667-153.6-344.746667-344.746667-344.746667m269.653333 682.666667H238.933333v-337.92c0-150.186667 122.88-273.066667 273.066667-273.066667s273.066667 122.88 273.066667 273.066667v337.92z m17.066667-853.333333c17.066667 10.24 20.48 30.72 10.24 47.786666l-61.44 105.813334-58.026667-34.133334L750.933333 102.4c10.24-17.066667 30.72-23.893333 47.786667-13.653333zM512 10.24c20.48 0 37.546667 13.653333 37.546667 34.133333v119.466667H477.866667V44.373333c-3.413333-20.48 13.653333-34.133333 34.133333-34.133333M225.28 88.746667c13.653333-10.24 34.133333-3.413333 44.373333 13.653333l61.44 105.813333-58.026666 34.133334L211.626667 136.533333c-10.24-17.066667-3.413333-37.546667 13.653333-47.786666M13.653333 300.373333c10.24-17.066667 30.72-20.48 44.373334-13.653333l105.813333 61.44-34.133333 58.026667-105.813334-61.44C10.24 337.92 6.826667 317.44 13.653333 300.373333m993.28 0c10.24 17.066667 3.413333 37.546667-13.653333 44.373334L887.466667 406.186667l-34.133334-58.026667 105.813334-61.44c20.48-6.826667 40.96-3.413333 47.786666 13.653333" p-id="12647" fill="#ffffff"></path><path d="M535.893333 399.36l-170.666666 279.893333h136.533333l-34.133333 211.626667 170.666666-283.306667h-136.533333z" p-id="12648" fill="#ffffff"></path></svg>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="box-card zyw-panel">
            <div slot="header" class="clearfix">
              <span>待办任务</span>
            </div>
            <div class="text item" :style="{'width': '100%','height': (tableHeight)/2-50-20+'px'}">
              <template  v-if="toDoList.length>0">
                <el-row class="map-todo-list" v-for="item in toDoList" :key="item.route">
                  <el-col :span="20">
                    <div @click="addTab(item.route,item.title)" class="map-todo-item ">{{item.title}}</div>
                  </el-col>
                  <el-col :span="4" >
                    <div @click="addTab(item.route,item.title)" class="map-todo-item text-align-right">{{item.count}}</div></el-col>
                </el-row>
              </template>
              <template v-else>
                暂无待办数据
              </template>
            </div>
          </el-card>
            <el-card class="box-card zyw-panel">
              <div slot="header" class="clearfix">
                <span>待办任务分布</span>
              </div>
              <div class="text item">
                <div id="chart1" :style="{'width': '100%','height':  (tableHeight)/2-50+'px'}">
                  暂无待办数据
                </div>
              </div>
            </el-card>
          </el-col>
        <el-col :span="12">

          <el-card class="box-card zyw-panel">
            <div slot="header" class="clearfix">
              <span>会议统计</span>
            </div>
            <div id="dbChart" :style="{'width': '100%','height': tableHeight-50+'px'}"></div>
          </el-card>
        </el-col>
      </el-row>
    </div>
</template>

<script>
  import echarts from 'echarts';
  import theme from "@/utils/echarts-color";
    export default {
        name: "index",
      data() {
        return {
          toDoList: [],
          todoConfig:[],
          echartTitle:[],
          echartData:[],
          totalTodo:"暂无"
        }
      },
      mounted(){
        // this.chart1();
        this.genDbChart();
        this.loadTodoList()
      },
      methods: {
        loadTodoList(){
          //TODO 加载出当前用户对应的待办配置
          return;
          let _self=this
          _self.request.axios(
            {
              url:'mapCommon/rest/sysTodo/config/'
            }
          ).then(
            function (response) {
              if (response.data.successful==true){
                let resultValue=response.data.resultValue;
                if (resultValue){
                  _self.todoConfig=resultValue
                  if (_self.todoConfig.length>0){
                      _self.getTodo()
                  }
                }
              }
            }
          )
        },
        getTodo(){
          let _self=this
          if (_self.todoConfig.length===0) {
            _self.chart1()
            return
          }
          _self.request.axios(
            {
              url:'mapCommon/rest/sysTodo/todo/'+_self.todoConfig[0].id
            }
          ).then(
            function (response) {
              if (response.data.successful==true){
                let resultValue=response.data.resultValue;
                if (resultValue){
                  if (resultValue.count>0){
                    _self.toDoList.push(
                      resultValue
                    )
                  }
                }
              }
            }
          ).finally(function () {
            _self.todoConfig=_self.todoConfig.slice(1)
            _self.getTodo()

          })
        },
        //新增tab页
        addTab(path, title) {
          this.$store.commit(
            'addTab',
            {
              path: path,
              title: title
            }
          )
          this.$router.push(path)
        },
        chart1(){
          let _self=this
          // 基于准备好的dom，初始化echarts实例
          echarts.registerTheme('sg-echarts', theme) // 注册主题
          var myChart = echarts.init(document.getElementById('chart1'),"sg-echarts");
          // 绘制图表
          myChart.setOption({

            legend: {
              orient: 'vertical',
              bottom:'0',
              left:0,
              // y: 'center',
              data:_self.echartTitle
            },
            // color:['#00c191','#fec105','#8fa5a5'],
            series: [
              {
                name:'待办',
                type:'pie',
                radius: '90%',
                center: ['60%', '50%'],
                data:_self.echartData,
                // label: {
                //   normal: {
                //     position: 'inner'
                //   }
                // },
              }
            ]
          });
        },
        genDbChart(){
          const option = {
            tooltip : {
              trigger: 'axis',
              axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            legend: {
              data: ['现场', '视频','其他']
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            yAxis:  {
              type: 'value'
            },
            xAxis: {
              type: 'category',
              data: ['周一','周二','周三','周四','周五','周六','周日']
            },
            series: [
              {
                name: '现场',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: [320, 302, 301, 334, 390, 330, 320]
              },
              {
                name: '视频',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: [120, 132, 101, 134, 90, 230, 210]
              },
              {
                name: '其他',
                type: 'bar',
                stack: '总量',
                label: {
                  normal: {
                    show: true,
                    position: 'insideRight'
                  }
                },
                data: [220, 182, 191, 234, 290, 330, 310]
              }

            ]
          };
          echarts.registerTheme('sg-echarts', theme) // 注册主题
          var myChart = echarts.init(document.getElementById('dbChart'),"sg-echarts");
          // 绘制图表
          myChart.setOption(option)
        }
      },
      watch:{
        toDoList(){
          this.totalTodo=0;
          this.echartTitle=[];
          this.echartData=[];
          for (let i=0;i<this.toDoList.length;i++){
            this.echartTitle.push(this.toDoList[i].title)
            this.echartData.push({
              name:this.toDoList[i].title,
              value:this.toDoList[i].count
            })
            this.totalTodo=parseInt(this.totalTodo)+this.toDoList[i].count
          }
        }
      }
    }

</script>

<style scoped lang="scss">
  @import "~@/scss/components/Index.scss";
  .map-todo-item{
    border-bottom: 1px solid #EBEEF5;
    padding: 10px 20px;
    cursor: pointer;

  }
  .map-todo-list{
    color: #5cb5aa;
    white-space:nowrap;
    overflow: hidden;
  }
  .map-todo-list:hover{
    background: #5cb5aa;
    color: #fff;
  }
  svg {
    position: absolute;
    right: 15px;
    /* bottom: -15px; */
    color: #fff;
  /* opacity: 0.2;*/
}
</style>
