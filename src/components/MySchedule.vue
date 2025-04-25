<template>
  <div class="schedule-container">
    <div class="header">
      <h2>{{ currentMonth }}月{{ currentMonthName }}</h2>
      <button @click="toggleView">
        切换至 {{ isCalendarView ? "列表" : "日历" }} 视图
      </button>
    </div>
    
    <!-- 日历视图 -->
    <div v-if="isCalendarView" class="weekdays">
      <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
    </div>

    <div v-if="isCalendarView" class="calendar-view">
      <div v-for="n in firstDayOffset" :key="'empty'+n" class="day empty"></div>
      <div v-for="day in monthDays" :key="day.date"
           :class="['day', { past: day.isPast }]" 
           @click="showSchedule(day.date)">
        <div v-if="day.morning" class="morning-slot"></div>
        <div v-if="day.afternoon" class="afternoon-slot"></div>
        {{ day.date }}
      </div>
    </div>

    <!-- 列表视图 -->
    <div v-else class="list-view">
      <table>
        <thead>
          <tr>
            <th>日期</th>
            <th>时间</th>
            <th>是否完成</th>
            <th>请假申请</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in scheduleList" :key="item.date">
            <td>{{ item.date }}</td>
            <td>{{ item.time }}</td>
            <td>
              <span v-if="item.isCompleted" class="completed">✔</span>
              <span v-else class="pending">○</span>
            </td>
            <td>
              <button v-if="!item.isCompleted && !item.leaveApplied"
                      @click="applyLeave(item)">
                申请请假
              </button>
              <span v-else-if="item.leaveApplied">申请审核中</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 请假申请弹窗 -->
    <div v-if="showLeaveModal" class="modal">
      <h3>请假申请</h3>
      <textarea v-model="leaveReason" placeholder="请填写请假理由"></textarea>
      <button @click="submitLeave">提交</button>
      <button @click="showLeaveModal = false">取消</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCalendarView: true,
      currentMonth: new Date().getMonth() + 1,
      currentMonthName: new Intl.DateTimeFormat("en", { month: "long" }).format(new Date()),
      weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      monthDays: [],
      firstDayOffset: 0,
      scheduleList: [],
      showLeaveModal: false,
      leaveReason: "",
      currentLeaveItem: null,
      consultantId: 123 // 登录时获取的咨询师ID
    };
  },
  created() {
    this.loadSchedule();
  },
  methods: {
    // 切换视图模式
    toggleView() {
      this.isCalendarView = !this.isCalendarView;
    },

    // 显示某一天的排班
    showSchedule(date) {
      this.isCalendarView = false;
      this.$nextTick(() => {
        const target = this.scheduleList.find(item => item.date === date);
        if (target) {
          document.querySelector(`tr[data-date="${date}"]`).scrollIntoView();
        }
      });
    },

    // 点击申请请假
    applyLeave(item) {
      this.currentLeaveItem = item;
      this.showLeaveModal = true;
    },

    // 提交请假申请
    submitLeave() {
      if (!this.leaveReason.trim()) {
        alert("请填写请假理由");
        return;
      }

      // 发起请假请求
      this.$axios.post('/internal/consultant/leave', {
        consultantId: this.consultantId,
        date: this.currentLeaveItem.date,
        time: this.currentLeaveItem.time,
        cancellationReason: this.leaveReason
      }).then(response => {
        if (response.data.code === 1) {
          alert("请假申请已提交！");
          this.currentLeaveItem.leaveApplied = true;
        } else {
          alert("请假申请失败，请稍后再试。");
        }
      }).catch(error => {
        console.error("请假申请请求失败", error);
        alert("请假申请失败，请稍后再试。");
      });

      // 关闭弹窗
      this.showLeaveModal = false;
      this.leaveReason = "";
    },

    // 加载排班数据
    loadSchedule() {
      this.$axios.get(`/internal/consultant/schedule`, {//这个咨询师获取自己排班的接口我不知道应该怎么写，，
        params: { consultantId: this.consultantId }
      }).then(response => {
        if (response.data && response.data.schedule) {
          this.scheduleList = response.data.schedule.map(item => ({
            date: item.date,
            time: item.time,
            isCompleted: item.isCompleted,
            leaveApplied: item.leaveApplied
          }));
        }
      }).catch(error => {
        console.error("获取排班数据失败", error);
      });
    }
  }
};
</script>

<style scoped>
.schedule-container {
  width: 100%;
  height: 100%;
  flex-direction: column;
  padding: 20px;
  background-color: white;
  overflow-x: hidden;
  overflow-y: auto;
}

.header {
  text-align: right;
  margin-bottom: 10px;
}

button {
  padding: 5px 10px;
  background-color: #8B4513;
  color: white;
  border: none;
  cursor: pointer;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  text-align: center;
  font-weight: bold;
  color: #8B4513;
  margin-bottom: 5px;
  width: 100%;
}

.weekdays div {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

.calendar-view {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  width: 100%;
  padding: 0;
  margin: 0 auto;
}

.day {
  height: 80px;
  right: 5px;
  border: 1px solid #ccc;
  text-align: center;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
}

.day.past {
  background: #ddd;
}

.morning-slot {
  position: absolute;
  top: 27px;
  left: 50%;
  width: 50px;
  height: 5px;
  background: #FFE4B5;
  transform: translateX(-50%);
}

.afternoon-slot {
  position: absolute;
  bottom: 27px;
  left: 50%;
  width: 50px;
  height: 5px;
  background: #8B4513;
  transform: translateX(-50%);
}

.list-view table {
  width: 100%;
  border-collapse: collapse;
}

.list-view th, .list-view td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.completed {
  color: green;
}

.pending {
  color: gray;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border: 1px solid #ccc;
}
</style>
