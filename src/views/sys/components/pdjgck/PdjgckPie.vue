<!-- 图表 -->
<template>
  <div><div id="pdjgChart" style="height: 500px;width:100%"></div></div>
</template>

<script>
import echarts from 'echarts';
import theme from '@/utils/echarts-color';
export default {
  name: 'PdjgckPie',
  props: ['pdjgckData', 'legendData'],
  data() {
    return {};
  },

  methods: {
    getPdjgChart() {
      let _self = this;
      const option = {
        title: {
          text: '盘点结果', //主题
          subtext: '',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: _self.legendData /* ['盘点正常', '盘点异常'] */
        },
        series: [
          {
            name: '', // 提示框标题
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: _self.pdjgckData /* [{ value: 4, name: '盘点正常' }, { value: 28, name: '盘点异常' }] */, //扇形区域数据
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              },
            }
          }
        ],
        color: ['rgb(254,97,100)','rgb(0,150,136)']
      };
      //初始化
      echarts.registerTheme('sg-echarts', theme); // 注册主题
      let pdjgChart = document.getElementById('pdjgChart');
      var myChart = echarts.init(pdjgChart, 'sg-echarts');
      // 绘制图表
      myChart.setOption(option);
    }
  },
  mounted() {
    this.getPdjgChart();
  },
  watch: {
    pdjgckData: function(val) {
      if (val != null && val != undefined) {
        this.getPdjgChart();
      }
    },
    legendData: function(val) {
      if (val != null && val != undefined) {
        this.getPdjgChart();
      }
    }
  }
};
</script>
