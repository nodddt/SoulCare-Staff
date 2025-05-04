<template>
    <div class="session-records">
      <h2>会话记录</h2>
  
      <div class="session-card-container">
        <div class="session-card" v-for="session in sessions" :key="session.sessionId">
          <div class="session-left">
            <p><strong>{{ formatDate(session.startTime) }}</strong></p>
            <p>{{ session.userName }}</p>
          </div>
          <div class="session-right">
            <div class="rating">
              <el-rate :value="session.rating" disabled show-score />
            </div>
            <p class="feedback">{{ session.feedback || "来访者未填写评价" }}</p>
          </div>
          <div class="session-actions">
            <el-button size="small" type="primary" 
                       style="background-color: #FFE4B5; color: #8B4513; border-color: #FFE4B5;"
                       @click="openDetailDialog(session.sessionId)">
              咨询详情
            </el-button>
          </div>
        </div>
      </div>
  
      <!-- 咨询详情弹窗 -->
      <el-dialog title="咨询详情记录" :visible.sync="detailDialogVisible" center>
        <div class="chat-history">
          <div v-for="msg in sessionHistory" :key="msg.time" 
               :class="msg.senderType ? 'msg-consultant' : 'msg-user'">
            <p><strong>{{ msg.senderType ? '咨询师' : '来访者' }}：</strong>{{ msg.msg }}</p>
            <span class="time">{{ formatTime(msg.time) }}</span>
          </div>
        </div>
        <div style="text-align: right; margin-top: 20px;">
          <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        sessions: [],
        detailDialogVisible: false,
        sessionHistory: []
      };
    },
    methods: {
      async fetchSessions() {
        try {
          const res = await axios.get("http://localhost:8080/internal/session/list", {
            params: { consultantId: 1 }
          });
          if (res.data.code === "1") {
            this.sessions = res.data.data;
          } else {
            this.$message.error("获取会话列表失败：" + res.data.msg);
          }
        } catch (err) {
          this.$message.error("请求错误：" + err);
        }
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString();
      },
      formatTime(timeStr) {
        const date = new Date(timeStr);
        return date.toLocaleTimeString();
      },
      async openDetailDialog(sessionId) {
        try {
          const res = await axios.get("http://localhost:8080/internal/session/history", {
            params: { sessionId }
          });
          if (res.data.code === "1") {
            this.sessionHistory = res.data.data;
            this.detailDialogVisible = true;
          } else {
            this.$message.error("获取会话详情失败：" + res.data.msg);
          }
        } catch (err) {
          this.$message.error("请求错误：" + err);
        }
      }
    },
    created() {
      axios.defaults.headers.common["token"] = localStorage.getItem("token") || "";
      this.fetchSessions();
    }
  };
  </script>
  
  <style scoped>
  .session-records {
    padding: 20px;
  }
  
  .session-card-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    padding: 10px 0;
  }
  
  .session-card {
    background-color: white;
    border: 1px solid #FFE4B5;
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  
  .session-left, .session-right {
    width: 45%;
  }
  
  .session-left p {
    margin: 6px 0;
    font-size: 14px;
  }
  
  .session-right .rating {
    margin-bottom: 8px;
  }
  
  .feedback {
    font-size: 13px;
    color: #666;
  }
  
  .session-actions {
    width: 100%;
    margin-top: 10px;
    text-align: right;
  }
  
  .chat-history {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;
  }
  
  .msg-user,
  .msg-consultant {
    margin: 10px 0;
    padding: 8px;
    border-radius: 6px;
    background-color: #fef6e0;
  }
  
  .msg-consultant {
    background-color: #e0f7fa;
  }
  
  .time {
    display: block;
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
  </style>
  