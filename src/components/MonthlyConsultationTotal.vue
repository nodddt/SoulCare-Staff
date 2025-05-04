<template>
  <div class="monthly-total-box">
    <h3>本月总咨询时长</h3>
    <div class="total-value">
      <p>{{ sum }}</p>
      <span>分钟</span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'MonthlyConsultationTotal',
  data() {
    return {
      sum:0,
      token:''
    };
  },
  
  methods: {
    async fetchTotal() {
      try {
        const response = await axios.get('http://localhost:8080/internal/admin/data/consultation/total', {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        if (response.data.code === '1') {
          this.sum = response.data.data
        } else {
          console.error('获取失败：', response.data.msg)
        }
      } catch (error) {
        console.error('请求出错：', error)
      }
    }
  },
  mounted() {
    this.fetchTotal()
  },
}
</script>

<style scoped>
.monthly-total-box {
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  text-align: center;
}
.total-value {
  font-size: 28px;
  font-weight: bold;
  color: #8B4513;
  margin-top: 12px;
}
</style>