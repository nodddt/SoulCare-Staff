<template>
    <div class="schedule-management">
      <div class="calendar-view">
        <div class="calendar-header">{{ currentMonthLabel }}</div>
        <div class="calendar-grid">
          <div class="day-label" v-for="day in weekDays" :key="day">{{ day }}</div>
          <div
            v-for="(date, index) in calendarDays"
            :key="index"
            class="calendar-cell"
            :class="{ past: isPast(date) }"
          >
            <div class="date-number">{{ date.getDate() }}</div>
            <div
              class="mark morning"
              v-if="hasShift(date, 'morning')"
            ></div>
            <div
              class="mark afternoon"
              v-if="hasShift(date, 'afternoon')"
            ></div>
          </div>
        </div>
      </div>
  
      <div class="edit-panel">
        <div class="day-row" v-for="day in weekDays" :key="day">
          <div class="day-name">{{ day }}</div>
          <div class="time-slot" @click="openShiftDialog(day, 'morning')">上午</div>
          <div class="time-slot" @click="openShiftDialog(day, 'afternoon')">下午</div>
        </div>
      </div>
  
      <!-- 排班弹窗 -->
      <div v-if="showDialog" class="dialog-overlay">
        <div class="dialog-box">
          <h3>{{ dialogTitle }}</h3>
          <div class="consultant-list">
            <div v-for="c in currentConsultantList" :key="c.id">
              <input type="checkbox" :value="c.id" v-model="selectedConsultants" />
              {{ c.name }}
            </div>
          </div>
          <div class="dialog-actions">
            <button @click="confirmDialogAction">确认</button>
            <button @click="closeDialog">取消</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  const getWeekday = (date) => {
    return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][
      date.getDay()
    ];
  };
  
  export default {
    name: 'ScheduleManagement',
    data() {
      return {
        today: new Date(),
        currentYear: new Date().getFullYear(),
        currentMonth: new Date().getMonth(),
        weekDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        scheduleTemplate: {
          Monday: { morning: [], afternoon: [] },
          Tuesday: { morning: [], afternoon: [] },
          Wednesday: { morning: [], afternoon: [] },
          Thursday: { morning: [], afternoon: [] },
          Friday: { morning: [], afternoon: [] },
          Saturday: { morning: [], afternoon: [] },
          Sunday: { morning: [], afternoon: [] },
        },
        showDialog: false,
        dialogTitle: '',
        dialogMode: '',
        dialogDay: '',
        dialogTime: '',
        selectedConsultants: [],
        consultants: [
          { id: 1, name: '咨询师A' },
          { id: 2, name: '咨询师B' },
          { id: 3, name: '咨询师C' },
        ],
      };
    },
    computed: {
      currentMonthLabel() {
        return `${this.currentMonth + 1}月 April`;
      },
      calendarDays() {
        const days = [];
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const startOffset = (firstDay.getDay() + 6) % 7;
  
        for (let i = 0; i < startOffset; i++) days.push(null);
        for (let i = 1; i <= lastDay.getDate(); i++) {
          days.push(new Date(this.currentYear, this.currentMonth, i));
        }
        return days;
      },
      currentConsultantList() {
        const all = this.consultants;
        const scheduled = this.scheduleTemplate[this.dialogDay][this.dialogTime];
        if (this.dialogMode === 'add') {
          return all.filter((c) => !scheduled.includes(c.id));
        } else {
          return all.filter((c) => scheduled.includes(c.id));
        }
      },
    },
    methods: {
      isPast(date) {
        return date && date < new Date(this.today.setHours(0, 0, 0, 0));
      },
      hasShift(date, time) {
        if (!date) return false;
        const weekday = getWeekday(date);
        return this.scheduleTemplate[weekday][time].length > 0;
      },
      openShiftDialog(day, time) {
        this.dialogDay = day;
        this.dialogTime = time;
        this.dialogMode = 'view';
        this.dialogTitle = `${day} ${time === 'morning' ? '上午' : '下午'} 排班管理`;
        this.selectedConsultants = [];
        this.showDialog = true;
      },
      confirmDialogAction() {
        const targetList = this.scheduleTemplate[this.dialogDay][this.dialogTime];
        if (this.dialogMode === 'add') {
          this.selectedConsultants.forEach((id) => {
            if (!targetList.includes(id)) targetList.push(id);
          });
        } else {
          this.scheduleTemplate[this.dialogDay][this.dialogTime] = targetList.filter(
            (id) => !this.selectedConsultants.includes(id)
          );
        }
        this.closeDialog();
      },
      closeDialog() {
        this.showDialog = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .schedule-management {
    display: flex;
    padding: 20px;
    font-family: Arial, sans-serif;
  }
  
  .calendar-view {
    width: 60%;
  }
  
  .calendar-header {
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }
  
  .day-label {
    font-weight: bold;
    color: #8b4513;
    text-align: center;
  }
  
  .calendar-cell {
    height: 60px;
    border: 1px solid #ccc;
    position: relative;
    background-color: white;
  }
  
  .calendar-cell.past {
    background-color: #ddd;
  }
  
  .date-number {
    position: absolute;
    top: 2px;
    left: 4px;
    font-size: 12px;
  }
  
  .mark.morning {
    position: absolute;
    top: 18px;
    left: 8px;
    right: 8px;
    height: 5px;
    background-color: #ffe4b5;
    border-radius: 2px;
  }
  
  .mark.afternoon {
    position: absolute;
    bottom: 6px;
    left: 8px;
    right: 8px;
    height: 5px;
    background-color: #8b4513;
    border-radius: 2px;
  }
  
  .edit-panel {
    width: 35%;
    margin-left: 5%;
  }
  
  .day-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .day-name {
    width: 50px;
    font-weight: bold;
    color: #8b4513;
  }
  
  .time-slot {
    flex: 1;
    border: 1px solid #aaa;
    text-align: center;
    cursor: pointer;
    padding: 5px;
    margin: 0 5px;
  }
  
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .dialog-box {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
  }
  
  .dialog-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  </style>
  