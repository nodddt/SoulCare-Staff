<template>
    <div class="dashboard-container">
      <!-- 分割线 -->
      <div class="line horizontal-line"></div>
      <div class="line vertical-line"></div>
  
      <!-- 四个区域 -->
      <div class="area top-left">
        <div ref="weeklyChart" class="chart-box">每周总咨询人数（折线图）</div>
      </div>
      <div class="area top-right">
        <div ref="durationChart" class="chart-box">每月咨询师总时长排名（柱状图）</div>
      </div>
      <div class="area bottom-left">
        <div class="info-box">系统总咨询人次：{{ totalUsers }}</div>
      </div>
      <div class="area bottom-right">
        <div class="abnormal-box">
          <h3>异常咨询数据</h3>
          <ul>
            <li v-for="(item, index) in abnormalData" :key="index">
              咨询师ID: {{ item.consultantId }}，来访者：{{ item.username }}，原因：{{ item.Reason }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  import * as echarts from 'echarts'
  
  export default {
    name: 'Databoard',
    data () {
      return {
        // 折线图：每周总咨询人数（后端提供 week1-5）
        weeklyCounts: [], // e.g. [40, 35, 25, 50, 45]
        weeklyLabels: ['四周前', '三周前', '两周前', '上周', '本周'],
  
        // 柱状图：前十咨询师时长排行
        durationLabels: [], // ['张三', '李四', ...]
        durationValues: [], // [30, 28, ...]
  
        // 系统总咨询人次
        totalUsers: 0,
  
        // 异常咨询数据列表
        abnormalData: []
      }
    },
    mounted () {
      this.weeklyChart = echarts.init(this.$refs.weeklyChart)
      this.durationChart = echarts.init(this.$refs.durationChart)
      this.fetchDataboardData()
      this.fetchAbnormalRecords()
    },
    methods: {
      async fetchDataboardData () {
        try {
          const res = await axios.get('http://localhost:8080/internal/admin/Databoard')
          if (res.data.code === '1') {
            const d = res.data.data[0]
  
            // 填充每周人数
            this.weeklyCounts = [
              d.totaluserweek1,
              d.totaluserweek2,
              d.totaluserweek3,
              d.totaluserweek4,
              d.totaluserweek5
            ]
  
            // 填充总人次
            this.totalUsers = d.totaluser
  
            // 填充咨询师排名数据（取前十）
            this.durationLabels = []
            this.durationValues = []
            for (let i = 1; i <= 10; i++) {
              const nameKey = `rank${i}-name`
              const timeKey = `rank${i}-time`
              if (d[nameKey] && d[timeKey] != null) {
                this.durationLabels.push(d[nameKey])
                this.durationValues.push(d[timeKey])
              }
            }
  
            // 可在这里调用 renderChart()
            this.renderWeeklyChart()
            this.renderDurationChart()
          }
        } catch (err) {
          console.error('获取 Databoard 数据失败', err)
        }
      },
      async fetchAbnormalRecords () {
        try {
          const res = await axios.get('http://localhost:8080/internal/admin/Abnormalrecords')
          if (res.data.code === '1') {
            this.abnormalData = res.data.data
          }
        } catch (err) {
          console.error('获取异常咨询数据失败', err)
        }
      },
      renderWeeklyChart () {
        this.weeklyChart.setOption({
          title: { text: '每周总咨询人数' },
          xAxis: {
            type: 'category',
            data: this.weeklyLabels
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.weeklyCounts,
            type: 'line',
            smooth: true
          }]
        })
      },
      renderDurationChart () {
        this.durationChart.setOption({
          title: { text: '每月咨询师总时长排名（前十）' },
          xAxis: {
            type: 'category',
            data: this.durationLabels
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: this.durationValues,
            type: 'bar'
          }]
        })
      }
    }
  }
  </script>
  
  <style scoped>
.dashboard-container {
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: #fff;
}

/* 分割线样式 */
.line {
  position: absolute;
  background-color: #aaa;
  z-index: 1;
}
.horizontal-line {
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
}
.vertical-line {
  left: 50%;
  top: 0;
  width: 1px;
  height: 100%;
}

/* 四个区域布局 */
.area {
  position: absolute;
  width: 50%;
  height: 50%;
  padding: 20px;
  box-sizing: border-box;
  overflow: auto;
}

/* 区域位置 */
.top-left { top: 0; left: 0; }
.top-right { top: 0; left: 50%; }
.bottom-left { top: 50%; left: 0; }
.bottom-right { top: 50%; left: 50%; }

/* 内容样式：去边框、简洁排版 */
.chart-box,
.info-box,
.abnormal-box {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}
.abnormal-box ul {
  margin: 0;
  padding-left: 20px;
}
</style>


  