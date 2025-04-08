<template>
  <div class="appointment-container">
    <div class="header">
      <button :class="{ active: currentTab === 'appointment' }" @click="currentTab = 'appointment'">预约咨询</button>
      <button :class="{ active: currentTab === 'realtime' }" @click="currentTab = 'realtime'">实时咨询</button>
    </div>
    
    <div class="consultation-list">
      <div v-for="item in filteredConsultations" :key="item.id" class="consultation-card">
        <img :src="item.avatar" alt="头像" class="avatar" />
        <div class="info">
          <p>ID: {{ item.visitorId }}</p>
          <p>时间: {{ formatTime(item.startTime) }} - {{ formatTime(item.endTime) }}</p>
        </div>
        <button 
          :disabled="!canEnterSession(item)" 
          :class="{ 'active-button': canEnterSession(item) }"
          @click="enterSession(item)">
          进入会话
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentTab: 'appointment',
      consultations: [
        // 示例数据
        { id: 1, visitorId: '1001', avatar: 'path/to/avatar1.jpg', startTime: '2025-04-08 14:00', endTime: '2025-04-08 15:00', type: 'appointment' },
        { id: 2, visitorId: '1002', avatar: 'path/to/avatar2.jpg', startTime: '2025-04-08 16:00', endTime: '2025-04-08 16:30', type: 'realtime' }
      ]
    };
  },
  computed: {
    filteredConsultations() {
      return this.consultations.filter(item => item.type === this.currentTab);
    }
  },
  methods: {
    formatTime(datetime) {
      return datetime.replace(' ', ' ');
    },
    canEnterSession(item) {
      if (this.currentTab === 'realtime') return true;
      const now = new Date();
      const startTime = new Date(item.startTime);
      return now >= startTime;
    },
    enterSession(item) {
      this.$router.push({ path: '/views/Chat.vue', query: { id: item.id } });
    }
  }
};
</script>

<style scoped>
.appointment-container {
  padding: 20px;
}
.header {
  display: flex;
  gap: 10px;
}
button {
  padding: 10px;
  border: none;
  background: lightgray;
  cursor: pointer;
}
button.active {
  background: #8B4513;
  color: white;
}
.consultation-list {
  margin-top: 20px;
}
.consultation-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px;
  border-radius: 10px;
  background: #f5f5f5;
  margin-bottom: 10px;
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.active-button {
  background: #8B4513;
  color: white;
}
</style>
