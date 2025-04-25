<template>
  <div class="staff-management">
    <h2>账号列表</h2>
    <table border="1" cellspacing="0" cellpadding="8">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>简介</th>
          <th>类型</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in accountList" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.professionalInfo || '无' }}</td>
          <td>{{ user.type }}</td>
        </tr>
      </tbody>
    </table>

    <div class="button-group" style="margin-top: 20px;">
      <button @click="openAddDialog('consultant')">新增咨询师</button>
      <button @click="openAddDialog('supervisor')">新增督导</button>
    </div>

    <!-- 添加账号弹窗 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>添加 {{ newUser.type === 'consultant' ? '咨询师' : '督导' }}</h3>
        <label>用户名：<input v-model="newUser.username" /></label><br />
        <label>密码：<input type="password" v-model="newUser.password" /></label><br />
        <label>简介（可选）：<input v-model="newUser.professionalInfo" /></label><br />
        <div style="margin-top: 10px;">
          <button @click="submitNewUser">提交</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StaffManagement',
  data() {
    return {
      accountList: [],
      showDialog: false,
      newUser: {
        username: '',
        password: '',
        professionalInfo: '',
        type: '',
      },
    };
  },
  methods: {
    async fetchAccountList() {
      try {
        const res = await axios.get('http://localhost:8080/internal/admin/accounts', {
          headers: {
            token: localStorage.getItem('token'),
          },
        });
        if (res.data.code === 1) {
          // 假设返回的是一个包含所有账号的数组，区分类型字段为 userType（consultant/supervisor）
          this.accountList = res.data.data.map(item => ({
            id: item.consultantId || item.supervisorId,
            username: item.username,
            professionalInfo: item.professionalInfo,
            type: item.userType === 'consultant' ? '咨询师' : '督导',
          }));
        } else {
          alert('获取账号列表失败：' + res.data.msg);
        }
      } catch (err) {
        console.error(err);
        alert('获取账号列表出错');
      }
    },

    openAddDialog(type) {
      this.showDialog = true;
      this.newUser = {
        username: '',
        password: '',
        professionalInfo: '',
        type,
      };
    },

    closeDialog() {
      this.showDialog = false;
    },

    async submitNewUser() {
      const { username, password, professionalInfo, type } = this.newUser;
      if (!username || !password) {
        alert('用户名和密码不能为空');
        return;
      }

      const url =
        type === 'consultant'
          ? 'http://localhost:8080/internal/admin/consultant'
          : 'http://localhost:8080/internal/admin/supervisor';

      try {
        const res = await axios.post(
          url,
          new URLSearchParams({ username, password, professionalInfo }),
          {
            headers: {
              token: localStorage.getItem('token'),
              'Content-Type': 'application/x-www-form-urlencoded',
            },
          }
        );
        if (res.data.code === 1) {
          alert('账号添加成功');
          this.closeDialog();
          this.fetchAccountList(); // 刷新账号列表
        } else {
          alert('添加失败：' + res.data.msg);
        }
      } catch (err) {
        console.error(err);
        alert('添加账号出错');
      }
    },
  },
  mounted() {
    this.fetchAccountList();
  },
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
}
</style>
