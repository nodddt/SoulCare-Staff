<template>
  <div>
    <div v-if="messages.length > 0">
      <div
  v-for="message in messages"
  :key="message.time"
  :class="['message-box', messageTypeClass(message.type)]"
>
        <div v-if="message.type === 0">{{ message.msg }}</div>
        <div v-if="message.type === 1">
          {{ message.msg }} (预约ID: {{ message.data && message.data.appointmentId }})
        </div>
        <div v-if="message.type === 2" @click="goToSession(message.data.sessionId,message.data.time)" class="message-box clickable">
          {{ message.msg }}，点击进入 (会话ID: {{ message.data && message.data.sessionId }})
        </div>
      </div>
    </div>
    <div v-else>
      <p>没有新的消息</p>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {

      activeContact: null,
      newMessage: ''
    };
  },
  computed: {
    messages() {
      return this.$store.getters.getMessages;  // 获取存储的消息
    }
  },
  methods: {
    messageTypeClass(type) {
    switch (type) {
      case 0: return 'type-0';
      case 1: return 'type-1';
      case 2: return 'type-2';
      default: return '';
    }
  },
    selectContact(contact) {
      this.activeContact = contact;
    },
    goToSession(sessionId,time) {
      // 假设你有一个名为 'sessionDetail' 的路由，并且它接受一个参数 'id'
      const id = sessionId;
      alert(id); // 调试信息，可以移除或替换为日志记录
      const chatUrl = this.$router.resolve({
        path: `/chat/${id}`,
        query: {
          consultantId: this.consultantId,
          consultantName: this.consultantName,
          appointmentDate: time,
          sessionId:id,
        },
      }).href;

      window.open(chatUrl, '_blank');
      this.agreeProtocol = false; // 重置协议状态
    },
    sendMessage() {
      if (this.newMessage.trim() && this.activeContact) {
        this.activeContact.messages.push({ sender: 'me', text: this.newMessage.trim() });
        this.newMessage = '';
        this.$nextTick(() => {
          const chatMessages = this.$el.querySelector('.chat-messages');
          chatMessages.scrollTop = chatMessages.scrollHeight;
        });
      }
    },
    getLastMessage(contact) {
      const lastMessage = contact.messages.length > 0 ? contact.messages[contact.messages.length - 1].text : '无消息';
      return lastMessage;
    }
  }
};
</script>

<style scoped>
.clickable {
  cursor: pointer;
  /* 可选：增加悬停时的背景颜色变化 */
  &:hover {
    background-color: #a4e2bb; /* 或者任何你喜欢的颜色 */
  }
}
.message-box {
  border-radius: 8px;
  padding: 12px 16px;
  margin: 8px 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  word-break: break-word;
}

.type-0 {
  background-color: #e6f7ff;
  color: #004080;
}

.type-1 {
  background-color: #fffbe5;
  color: #665100;
}

.type-2 {
  background-color: #f2ffef;
  color: #005a00;
}
</style>