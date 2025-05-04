<template>
    <div class="consultation-chart">
      <div class="chart-header">
        <h3>系统总咨询人次（按周）</h3>
        <div class="controls">
          <button @click="changeWeeks(-1)" :disabled="weekNum <= 1">-</button>
          <span>展示 {{ weekNum }} 周</span>
          <button @click="changeWeeks(1)">+</button>
        </div>
      </div>
      <div ref="chartContainer" class="chart-container" style="width: 100%; height: 300px;"></div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import * as echarts from 'echarts'
  
  export default {
    name: 'ConsultationDurationChart',
    data() {
      return {
        chartInstance: null,
        weekNum: 3,
        chartData: [],
      }
    },
    mounted() {
      this.chartInstance = echarts.init(this.$refs.chartContainer)
      this.fetchChartData()
    },
    methods: {
      changeWeeks(amount) {
        const newVal = this.weekNum + amount
        if (newVal < 1) return
        this.weekNum = newVal
        this.fetchChartData()
      },
      async fetchChartData() {
        try {
          const response = await axios.get('http://localhost:8080/internal/admin/data/consultation/week', {
            headers: {
              token: localStorage.getItem('token')
            },
            params: {
              num: this.weekNum
            }
          })
          if (response.data.code === '1') {
            this.chartData = response.data.data
            this.renderChart()
          } else {
            console.error('获取数据失败：', response.data.msg)
          }
        } catch (error) {
          console.error('请求出错：', error)
        }
      },
      renderChart() {
        const weeks = this.chartData.map(item => item.week_start)
        const totals = this.chartData.map(item => item.total)
        const option = {
          tooltip: {
            trigger: 'axis'
          },
          xAxis: {
            type: 'category',
            data: weeks,
            axisLabel: { rotate: 45 }
          },
          yAxis: {
            type: 'value',
            name: '总咨询人次'
          },
          series: [{
            data: totals,
            type: 'line',
            smooth: true,
            name: '咨询人次',
            areaStyle: {},
            lineStyle: {
              color: '#8B4513'
            }
          }]
        }
        this.chartInstance.setOption(option)
      }
    }
  }
  </script>
  
  <style scoped>
  .consultation-chart {
    padding: 16px;
    background-color: #fff;
    border-radius: 8px;
  }
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  .controls button {
    margin: 0 4px;
  }
  </style>
  