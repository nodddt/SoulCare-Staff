<template>
  <div class="schedule-management">
    <h2>督导排班管理</h2>
    <div class="schedule-grid">
      <div
        v-for="(slot, index) in timeSlots"
        :key="index"
        class="time-slot"
        @click="selectSlot(slot)"
      >
        {{ slot.day }} - {{ slot.time }}
      </div>
    </div>

    <div v-if="selectedSlot" class="slot-details">
      <h3>{{ selectedSlot.day }} - {{ selectedSlot.time }} 的排班</h3>
      <ul>
        <li
          v-for="supervisor in getScheduledSupervisors(selectedSlot)"
          :key="supervisor.supervisorId"
        >
          {{ supervisor.username }}
          <button @click="removeSchedule(supervisor.supervisorId)">删除</button>
        </li>
      </ul>

      <h4>添加排班</h4>
      <select v-model="selectedSupervisorToAdd">
        <option disabled value="">请选择督导</option>
        <option
          v-for="supervisor in getUnscheduledSupervisors(selectedSlot)"
          :key="supervisor.supervisorId"
          :value="supervisor.supervisorId"
        >
          {{ supervisor.username }}
        </option>
      </select>
      <button @click="addSchedule">添加</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ScheduleManagementS',
  data() {
    return {
      timeSlots: [],
      selectedSlot: null,
      schedules: [],
      supervisors: [],
      selectedSupervisorToAdd: '',
    };
  },
  created() {
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const times = ['上午', '下午'];
    for (const day of days) {
      for (const time of times) {
        this.timeSlots.push({ day, time });
      }
    }
  },
  mounted() {
    this.fetchSupervisors();
    this.fetchSchedules();
  },
  methods: {
    async fetchSupervisors() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/internal/admin/all-supervisors', {
          headers: { token },
        });
        if (res.data.code === 1) {
          this.supervisors = res.data.data;
        } else {
          alert('获取督导列表失败');
        }
      } catch (err) {
        console.error(err);
        alert('获取督导出错');
      }
    },
    async fetchSchedules() {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/internal/admin/schedule/supervisor', {
          headers: { token },
        });
        if (res.data.code === 1) {
          this.schedules = res.data.data;
        } else {
          alert('获取排班失败');
        }
      } catch (err) {
        console.error(err);
        alert('获取排班出错');
      }
    },
    selectSlot(slot) {
      this.selectedSlot = slot;
      this.selectedSupervisorToAdd = '';
    },
    getScheduledSupervisors(slot) {
      const filtered = this.schedules.filter(
        (s) => s.day === slot.day && s.time === slot.time
      );
      return this.supervisors.filter((s) =>
        filtered.some((sch) => sch.supervisorId === s.supervisorId)
      );
    },
    getUnscheduledSupervisors(slot) {
      const scheduledIds = this.schedules
        .filter((s) => s.day === slot.day && s.time === slot.time)
        .map((s) => s.supervisorId);
      return this.supervisors.filter((s) => !scheduledIds.includes(s.supervisorId));
    },
    async addSchedule() {
      if (!this.selectedSupervisorToAdd || !this.selectedSlot) return;

      const newEntry = {
        supervisorId: this.selectedSupervisorToAdd,
        day: this.selectedSlot.day,
        time: this.selectedSlot.time,
      };

      const updatedSchedules = [...this.schedules, newEntry];

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:8080/internal/admin/schedule/supervisor',
          { schedule: updatedSchedules },
          {
            headers: {
              token,
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data.code === 1) {
          this.schedules = res.data.data;
          this.selectedSupervisorToAdd = '';
        } else {
          alert('添加排班失败：' + res.data.msg);
        }
      } catch (err) {
        console.error(err);
        alert('添加排班出错');
      }
    },
    async removeSchedule(supervisorId) {
      if (!this.selectedSlot) return;

      const updatedSchedules = this.schedules.filter(
        (s) =>
          !(
            s.supervisorId === supervisorId &&
            s.day === this.selectedSlot.day &&
            s.time === this.selectedSlot.time
          )
      );

      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          'http://localhost:8080/internal/admin/schedule/supervisor',
          { schedule: updatedSchedules },
          {
            headers: {
              token,
              'Content-Type': 'application/json',
            },
          }
        );
        if (res.data.code === 1) {
          this.schedules = res.data.data;
        } else {
          alert('删除排班失败：' + res.data.msg);
        }
      } catch (err) {
        console.error(err);
        alert('删除排班出错');
      }
    },
  },
};
</script>

<style scoped>
.schedule-management {
  padding: 20px;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-bottom: 20px;
}

.time-slot {
  background-color: #ffe4b5;
  padding: 10px;
  text-align: center;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.time-slot:hover {
  background-color: #f0c97d;
}

.slot-details {
  background: #f9f9f9;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.slot-details ul {
  list-style: none;
  padding: 0;
}

.slot-details li {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
}
</style>
