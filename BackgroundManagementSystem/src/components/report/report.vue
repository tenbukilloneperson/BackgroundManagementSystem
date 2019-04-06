<template>
  <div>
    <my-breadcrumb
      level2="数据统计"
      level3="数据报表"></my-breadcrumb>
    <!-- 用来初始化 Echarts 的区域 -->
    <el-card>
      <div ref="ecartsArea" style="width: 800px; height: 500px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';

export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ]
      }
    };
  },
  methods: {
    async loadCharts() {
      const res = await this.$http.get('/reports/type/1');
      const data = res.data.data;

      this.option = _.merge(this.option, data);

      console.log(this.option);
      const myChart = echarts.init(this.$refs.ecartsArea);
      myChart.showLoading();
      myChart.setOption(this.option);
      myChart.hideLoading();
    }
  },
  mounted() {
    this.loadCharts();
  }
};
</script>

<style>

</style>
