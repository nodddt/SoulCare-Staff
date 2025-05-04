// store/websocket.js
export default {
    state: {
      ws: null,
      isConnected: false,
      messages:[],
    },
    mutations: {
      addMessage(state, message) {
        state.messages.push(message);  // 将新消息添加到消息列表中
      },
      setMessages(state, messages) {
        state.messages = messages;  // 设置消息列表
      },
      setWebSocket(state, ws) {
        state.ws = ws;
      },
      setConnectionStatus(state, status) {
        state.isConnected = status;
      }
    },
    actions: {
      connectWebSocket({ commit, state }, token) {
        if (state.ws) return; // 如果已经有连接，则不创建新的连接
        alert('Connecting to WebSocket...');
        const ws = new WebSocket(`ws://localhost:8080/notify?token=${token}`);
  
        ws.onopen = () => {
          commit('setConnectionStatus', true);
          alert('WebSocket connected');
        };
  
        ws.onclose = () => {
          commit('setConnectionStatus', false);
          alert('WebSocket disconnected');
        };
  
        ws.onmessage = (event) => {
          // 处理消息
          const message = JSON.parse(event.data);
          alert("您有一条新消息！")
          commit('addMessage', message); // 处理消息的mutation
        };
  
        commit('setWebSocket', ws);
      },
      disconnectWebSocket({ state }) {
        if (state.ws) {
          state.ws.close();
          state.ws = null;
        }
      }
    },
    getters: {
      ws: state => state.ws,
      isConnected: state => state.isConnected,
      getMessages: state => state.messages, // 获取消息列表
    }
  };