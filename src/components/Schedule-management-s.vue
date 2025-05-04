<template>
  <div class="schedule-container">
    <h2>督导排班管理</h2>
    <div class="grid">
      <button
        v-for="(slot, index) in timeSlots"
        :key="index"
        @click="openScheduleDialog(slot)"
      >
        {{ slot.label }}
      </button>
    </div>

    <!-- 弹窗：展示已排班督导 + 可添加列表 -->
    <div v-if="showDialog" class="dialog">
      <h3>{{ currentSlot.label }} 已排班督导</h3>
      <ul>
        <li v-for="s in scheduledSupervisors" :key="s.supervisorId">
          {{ s.name }}
        </li>
      </ul>

      <h3>增加排班</h3>
      <div v-for="sup in availableSupervisors" :key="sup.supervisorId">
        <input
          type="checkbox"
          :value="sup.supervisorId"
          v-model="selectedSupervisors"
        />
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
      token: localStorage.getItem("token"), // 你可以根据实际方式获取 token
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
      allSupervisors: [],
      scheduledSupervisors: [], // 示例：从后端获取已排班内容
      selectedSupervisors: [],
    };
  },
  computed: {
    availableSupervisors() {
      const scheduledIds = this.scheduledSupervisors.map((s) => s.supervisorId);
      return this.allSupervisors.filter((sup) => !scheduledIds.includes(sup.supervisorId));
    },
  },
  methods: {
    openScheduleDialog(slot) {
      this.currentSlot = slot;
      this.showDialog = true;
      this.selectedSupervisors = [];

      // 获取所有督导
      axios
        .get("http://localhost:8080/internal/admin/all-supervisors", {
          headers: { token: this.token },
        })
        .then((res) => {
          if (res.data.code === "1") {
            this.allSupervisors = res.data.data;
          }
        });

      // TODO: 获取该时段已排班督导（如果有接口）
      this.scheduledSupervisors = []; // 示例默认清空
    },
    submitSchedule() {
      if (!this.selectedSupervisors.length) return;

      const schedulePayload = this.selectedSupervisors.map((id) => ({
        supervisorId: id,
        day: this.currentSlot.day,
        time: this.currentSlot.time,
      }));

      axios
        .post(
          "http://localhost:8080/internal/admin/schedule/supervisor",
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
      this.scheduledSupervisors = [];
    },
  },
};
</script>
<style scoped>
.schedule-container {
  padding: 20px;
}
.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
}
button {
  padding: 10px;
  background-color: #ffe4b5;
  border: 1px solid #8b4513;
  border-radius: 8px;
}
.dialog {
  position: fixed;
  top: 10%;
  left: 20%;
  width: 60%;
  background: white;
  border: 1px solid #ccc;
  padding: 20px;
}
</style>
