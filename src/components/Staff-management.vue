<template>
  <div class="staff-management">
    <h2>内部职员管理</h2>

    <div class="button-group">
      <button @click="openAddDialog('consultant')">新增咨询师</button>
      <button @click="openAddDialog('supervisor')">新增督导</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>简介</th>
          <th>类型</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="staff in staffList" :key="staff.id">
          <td>{{ staff.id }}</td>
          <td>{{ staff.username }}</td>
          <td>{{ staff.professionalInfo }}</td>
          <td>{{ staff.type }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 新增弹窗 -->
    <div v-if="showDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>新增{{ addType === 'consultant' ? '咨询师' : '督导' }}</h3>
        <input v-model="newStaff.username" placeholder="用户名" />
        <input v-model="newStaff.password" type="password" placeholder="密码" />
        <input v-model="newStaff.professionalInfo" placeholder="简介（可选）" />

        <!-- 仅咨询师新增时显示督导选择 -->
        <div v-if="addType === 'consultant'" style="margin-top: 10px;">
          <label>绑定督导：</label>
          <select v-model="newStaff.supervisorId">
            <option disabled value="">请选择督导</option>
            <option v-for="s in supervisorOptions" :key="s.supervisorId" :value="s.supervisorId">
              {{ s.name }}（{{ s.professionalInfo || '无简介' }}）
            </option>
          </select>
        </div>

        <div class="dialog-buttons">
          <button @click="submitNewStaff">提交</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'StaffManagement',
  data() {
    return {
      staffList: [],
      supervisorOptions: [], // 存储所有督导（用于绑定）
      showDialog: false,
      addType: '', // 'consultant' or 'supervisor'
      newStaff: {
        username: '',
        password: '',
        professionalInfo: '',
        supervisorId: '' // 仅在新增咨询师时使用
      },
      token: localStorage.getItem('token') || '',
    }
  },
  created() {
    this.fetchStaff()
  },
  methods: {
    async fetchStaff() {
      try {
        const [consultantRes, supervisorRes] = await Promise.all([
          axios.get('http://localhost:8080/internal/admin/all-consultants', {
            headers: { token: this.token }
          }),
          axios.get('http://localhost:8080/internal/admin/all-supervisors', {
            headers: { token: this.token }
          })
        ])

        const consultants = consultantRes.data.data.map(item => ({
          id: item.consultantId,
          username: item.consultantname,
          professionalInfo: item.professionalInfo || '无',
          type: '咨询师',
        }))

        const supervisors = supervisorRes.data.data.map(item => ({
          id: item.supervisorId,
          username: item.name,
          professionalInfo: item.professionalInfo || '无',
          type: '督导',
        }))

        this.staffList = [...consultants, ...supervisors]
        this.supervisorOptions = supervisorRes.data.data

      } catch (error) {
        console.error('获取职员列表失败', error)
      }
    },
    openAddDialog(type) {
      this.addType = type
      this.showDialog = true
      this.newStaff = {
        username: '',
        password: '',
        professionalInfo: '',
        supervisorId: ''
      }
    },
    closeDialog() {
      this.showDialog = false
    },
    async submitNewStaff() {
      const usernameRegex = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/;
      const passwordRegex = /^[a-zA-Z0-9]+$/;

      if (!this.newStaff.username || !this.newStaff.password) {
        alert('用户名和密码不能为空')
        return
      }

      if (!usernameRegex.test(this.newStaff.username)) {
        alert('用户名只能包含中文、英文和数字')
        return
      }

      if (!passwordRegex.test(this.newStaff.password)) {
        alert('密码只能包含英文和数字')
        return
      }

      if (this.addType === 'consultant' && !this.newStaff.supervisorId) {
        alert('请为咨询师选择一个督导进行绑定')
        return
      }

      const url = this.addType === 'consultant'
        ? 'http://localhost:8080/internal/admin/consultant'
        : 'http://localhost:8080/internal/admin/supervisor'

      const formData = new URLSearchParams()
      formData.append('username', this.newStaff.username)
      formData.append('password', this.newStaff.password)
      formData.append('professionalInfo', this.newStaff.professionalInfo)
      if (this.addType === 'consultant') {
        formData.append('supervisorId', this.newStaff.supervisorId)
      }

      try {
        await axios.post(url, formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            token: this.token,
          }
        })
        alert('新增成功')
        this.closeDialog()
        this.fetchStaff()
      } catch (error) {
        console.error('新增职员失败', error)
        alert('新增失败')
      }
    }
  }
}
</script>

<style scoped>
.staff-management {
  padding: 20px;
}
.button-group {
  margin-bottom: 20px;
}
.button-group button {
  background-color: #FFE4B5;
  color: #333;
  border: none;
  padding: 5px 10px;
  font-size: 15px;
  border-radius: 10px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s;
}
.button-group button:hover {
  background-color: #FFD39B;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
th, td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
}
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
}
.dialog input,
.dialog select {
  width: 100%;
  margin: 8px 0;
  padding: 8px;
  box-sizing: border-box;
}
.dialog-buttons {
  display: flex;
  justify-content: space-between;
}
.dialog-buttons button {
  padding: 8px 16px;
  font-size: 16px;
}
</style>
