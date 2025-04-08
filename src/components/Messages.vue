<template>
  <div class="messages-container">
    <!-- 左侧消息列表 -->
    <div class="sidebar">
      <div 
        v-for="contact in contacts" 
        :key="contact.id" 
        class="contact-item" 
        :class="{ active: activeContact && activeContact.id === contact.id }"
        @click="selectContact(contact)">
        <div class="contact-name">{{ contact.name }}</div>
        <div class="last-message">{{ getLastMessage(contact) }}</div>
      </div>
    </div>
    
    <!-- 右侧聊天窗口 -->
    <div class="chat-window" v-if="activeContact">
      <div class="chat-messages">
        <div 
          v-for="(message, index) in activeContact.messages" 
          :key="index" 
          :class="['message', message.sender === 'me' ? 'sent' : 'received']">
          {{ message.text }}
        </div>
      </div>
      <div class="chat-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="输入消息..." />
        <button @click="sendMessage">发送</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      contacts: [
        { id: 1, name: '管理员1', messages: [
          { sender: 'them', text: '请检查本月报告' },
          { sender: 'me', text: '好的，我会查看。' }
        ] },
        { id: 3, name: '管理员2', messages: [
          { sender: 'them', text: '4-16上午排班请假审批已通过' },
        ] },
        { id: 2, name: '督导1', messages: [
          { sender: 'them', text: '有时间开个会吗？' },
          { sender: 'me', text: '可以的，明天上午合适吗？' }
        ] }
      ],
      activeContact: null,
      newMessage: ''
    };
  },
  methods: {
    selectContact(contact) {
      this.activeContact = contact;
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
.messages-container {
  display: flex;
  height: 100vh;
}
.sidebar {
  width: 250px;
  background: #f4f4f4;
  border-right: 1px solid #ddd;
  overflow-y: auto;
}
.contact-item {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}
.contact-item.active {
  background: #8B4513;
  color: white;
}
.contact-name {
  font-weight: bold;
}
.last-message {
  font-size: 14px;
  color: gray;
}
.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.chat-messages {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
  background: #fff;
  display: flex;
  flex-direction: column;
}
.message {
  padding: 10px;
  margin: 5px 0;
  border-radius: 10px;
  max-width: 70%;
  word-wrap: break-word;
}
.sent {
  background: #8B4513;
  color: white;
  align-self: flex-end;
}
.received {
  background: #eee;
  align-self: flex-start;
}
.chat-input {
  display: flex;
  padding: 10px;
  border-top: 1px solid #ddd;
  background: #fff;
}
.chat-input input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
}
.chat-input button {
  background: #8B4513;
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}
</style>
