<template>
  <div class="schedule-container">
    <!-- 督导选择 -->
    <div class="supervisor-select">
      <label>选择督导：</label>
      <select v-model="selectedSupervisorId" @change="fetchConsultantsBySupervisor">
        <option disabled value="">请选择督导</option>
        <option
          v-for="sup in supervisorList"
          :key="sup.supervisorId"
          :value="sup.supervisorId"
        >
          {{ sup.name }}
        </option>
      </select>
    </div>
    <!-- 时间段按钮 -->
    <div class="grid" v-if="selectedSupervisorId">
      <button
        v-for="(slot, index) in timeSlots"
        :key="index"
        @click="openScheduleDialog(slot)"
      >
        {{ slot.label }}
      </button>
    </div>

    <!-- 弹窗：展示已排班咨询师 + 可添加 -->
    <div v-if="showDialog" class="dialog">
      <h1>{{ currentSlot.label }} </h1><!----已排班咨询师 -->
      <ul>
        <li v-for="s in scheduledConsultants" :key="s.consultantId">
          {{ s.name }}
        </li>
      </ul>

      <h3>增加排班</h3>
      <div
        v-for="sup in availableConsultants"
        :key="sup.consultantId"
        class="consultant-item"
        :class="{ selected: selectedConsultants.includes(sup.consultantId) }"
        @click="toggleConsultantSelection(sup.consultantId)"
      >
        {{ sup.name }}
      </div>

      <button @click="submitSchedule">确定排班</button>
      <button @click="closeDialog">取消</button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      token: localStorage.getItem("token"),
      timeSlots: [
        { label: "周一上午", day: "Monday", time:"AM" },
        { label: "周二上午", day: "Tuesday", time:"AM" },
        { label: "周三上午", day: "Wednesday", time:"AM" },
        { label: "周四上午", day: "Thursday", time:"AM" },
        { label: "周五上午", day: "Friday", time:"AM" },
        { label: "周六上午", day: "Saturday", time:"AM" },
        { label: "周日上午", day: "Sunday", time:"AM" },
        { label: "周一下午", day: "Monday", time:"PM" },
        { label: "周二下午", day: "Tuesday", time:"PM" },
        { label: "周三下午", day: "Wednesday", time:"PM" },
        { label: "周四下午", day: "Thursday", time:"PM" },
        { label: "周五下午", day: "Friday", time:"PM" },
        { label: "周六下午", day: "Saturday", time:"PM" },
        { label: "周日下午", day: "Sunday", time:"PM" },
      ],
      showDialog: false,
      currentSlot: null,
      supervisorList: [],
      selectedSupervisorId: "",
      allConsultants: [],
      scheduledConsultants: [],
      selectedConsultants: [],
    };
  },

  computed: {
    availableConsultants() {
      const scheduledIds = this.scheduledConsultants.map((s) => s.consultantId);
      return this.allConsultants.filter((sup) => !scheduledIds.includes(sup.consultantId));
    },
  },
  mounted() {
    this.fetchSupervisors();
  },
  methods: {
    // 初始化加载所有督导
    fetchSupervisors() {
      axios
        .get("http://localhost:8080/internal/admin/all-supervisors", {
          headers: { token: this.token },
        })
        .then((res) => {
          if (res.data.code === "1") {
            this.supervisorList = res.data.data;
          }
        });
    },

    // 根据督导 ID 获取咨询师
    fetchConsultantsBySupervisor() {
      if (!this.selectedSupervisorId) return;
      axios
        .get("http://localhost:8080/internal/admin/all-consultants", {
          headers: { token: this.token },
          params: { supervisorId: this.selectedSupervisorId },
        })
        .then((res) => {
          if (res.data.code === "1") {
            this.allConsultants = res.data.data;
          }
        });
    },

    openScheduleDialog(slot) {
      this.currentSlot = slot;
      this.showDialog = true;
      this.selectedConsultants = [];

      // TODO: 获取已排班咨询师列表（可在此处添加后端接口获取）
      this.scheduledConsultants = []; // 示例默认清空
    },

    toggleConsultantSelection(consultantId) {
      const index = this.selectedConsultants.indexOf(consultantId);
      if (index === -1) {
        this.selectedConsultants.push(consultantId);
      } else {
        this.selectedConsultants.splice(index, 1);
      }
    },

    submitSchedule() {
      if (!this.selectedConsultants.length) return;

      const schedulePayload = this.selectedConsultants.map((id) => ({
        consultantId: id,
        day: this.currentSlot.day,
        time: this.currentSlot.time,
      }));

      axios
        .post(
          "http://localhost:8080/internal/admin/schedule/consultant",
          { schedule: schedulePayload },
          { headers: { token: this.token } }
        )
        .then((res) => {
          if (res.data.code === "1") {
            alert("排班成功！");
            this.closeDialog();
          } else {
            alert("排班失败：" + res.data.msg);
          }
        });
    },

    closeDialog() {
      this.showDialog = false;
      this.currentSlot = null;
      this.scheduledConsultants = [];
    },
  },
};
</script>

<style scoped>
.schedule-container {
  padding: 24px;
  border-radius: 12px;
  font-family: "Helvetica Neue", sans-serif;
}

.schedule-container label {
  font-weight: bold;
  margin-right: 8px;
}

select {
  padding: 8px 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 24px; /* 原14px -> 更大 */
  background-color: #fff;
}
.supervisor-select {
  position: absolute;
  top: 24px;
  left: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 15px;
  margin-top: 180px;
}

.grid button {
  padding: 16px 12px; /* 原10px，增高按钮 */
  font-size: 30px;
  background-color: #ffe4b5;
  border: 1px solid #8b4513;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.grid button:hover {
  background-color: #f4c97d;
}

.dialog {
  position: fixed;
  top: 10%;
  left: 20%;
  width: 60%;
  max-height: 80vh; /* 限制最大高度 */
  overflow-y: auto; /* 超出时可滚动 */
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  padding: 24px;
  z-index: 1001;
}

.dialog h3 {
  font-size: 20px; /* 更加醒目 */
}

.dialog ul {
  padding-left: 20px;
  margin-bottom: 16px;
  font-size: 16px; /* 调大显示已排班人名字体 */
}

.dialog button {
  background-color: #8b4513;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 24px;
  border-radius: 8px;
  cursor: pointer;
  margin-right: 12px;
  margin-top: 16px;
  transition: background-color 0.3s;
}

.dialog button:hover {
  background-color: #5c3317;
}

/* 咨询师选择样式 */
.consultant-item {
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-bottom: 8px;
}

.consultant-item.selected {
  background-color: rgba(255, 228, 181, 0.5); /* 浅黄色透明 */
}

.consultant-item:hover {
  background-color: rgba(255, 228, 181, 0.7); /* 鼠标悬停时变色 */
}
</style>
