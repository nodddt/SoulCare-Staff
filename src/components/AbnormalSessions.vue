<template>
  <div class="abnormal-container">
    <div class="header">
      <h3>异常咨询信息</h3>
      <div class="type-switch">
        <button @click="switchType('consultation')" :class="{ active: type === 'consultation' }">咨询师缺勤</button>
        <button @click="switchType('supervise')" :class="{ active: type === 'supervise' }">督导异常</button>
      </div>
    </div>

    <div v-if="type === 'consultation'" class="list">
      <div v-for="(item, index) in dataList" :key="index" class="list-item">
        <p>开始时间：{{ formatTime(item.start_time) }}</p>
        <p>咨询师：{{ item.name }}（ID: {{ item.consultant_id }}）</p>
        <p>来访者ID：{{ item.username }}</p>
        <p>会话ID：{{ item.session_id }}</p>
      </div>
    </div>

    <div v-if="type === 'supervise'" class="list">
      <div v-for="(item, index) in dataList" :key="index" class="list-item">
        <p>申请时间：{{ formatTime(item.request_time) }}</p>
        <p>督导：{{ item.supervisor_name }}（ID: {{ item.supervisor_id }}）</p>
        <p>咨询师：{{ item.consultant_name }}（ID: {{ item.consultant_id }}）</p>
        <p>会话ID：{{ item.session_id }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'AbnormalSessions',
  data() {
    return {
      type: 'consultation', // 默认类型
      dataList: [],
      token:''
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      const urlMap = {
        consultation: 'http://localhost:8080/internal/admin/data/consultation/abnormal',
        supervise: 'http://localhost:8080/internal/admin/data/supervise/abnormal'
      }

      try {
        const response = await axios.get(urlMap[this.type], {
          headers: {
            token: localStorage.getItem('token')
          }
        })
        if (response.data.code === '1') {
          this.dataList = response.data.data
        } else {
          console.error('获取异常数据失败：', response.data.msg)
        }
      } catch (err) {
        console.error('请求错误：', err)
      }
    },
    switchType(newType) {
      if (this.type !== newType) {
        this.type = newType
        this.dataList = []
        this.fetchData()
      }
    },
    formatTime(datetimeStr) {
      const date = new Date(datetimeStr)
      return date.toLocaleString()
    }
  }
}
</script>

<style scoped>
.abnormal-container {
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.type-switch button {
  margin-left: 8px;
  padding: 6px 12px;
  border: none;
  background-color: #eee;
  cursor: pointer;
  border-radius: 4px;
}
.type-switch .active {
  background-color: #8B4513;
  color: #fff;
}
.list {
  margin-top: 12px;
}
.list-item {
  padding: 8px 12px;
  border-bottom: 1px solid #ddd;
}
</style>
