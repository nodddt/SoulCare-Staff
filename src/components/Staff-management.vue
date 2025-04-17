<template>
    <div class="staff-management">
      <!-- 筛选条件 -->
      <el-form :inline="true" class="filter-form">
        <el-form-item label="注册时间">
          <el-date-picker v-model="filter.registerTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select v-model="filter.type" placeholder="选择类型">
            <el-option label="全部" value=""></el-option>
            <el-option label="咨询师" value="counselor"></el-option>
            <el-option label="督导" value="supervisor"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="filter.status" placeholder="选择状态">
            <el-option label="全部" value=""></el-option>
            <el-option label="在职" value="active"></el-option>
            <el-option label="离职" value="inactive"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="applyFilter">筛选</el-button>
      </el-form>
  
      <!-- 账号列表 -->
      <el-table :data="filteredAccounts" border>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150"></el-table-column>
        <el-table-column prop="registerTime" label="注册时间" width="180"></el-table-column>
        <el-table-column prop="type" label="账号类型" width="120">
          <template slot-scope="{ row }">
            {{ row.type === "counselor" ? "咨询师" : "督导" }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="账号状态" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === "active" ? "在职" : "离职" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="{ row }">
            <el-button type="danger" size="mini" @click="confirmDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <!-- 新增账号按钮 -->
      <el-button type="primary" class="add-button" @click="openAddDialog">新增账号</el-button>
  
      <!-- 新增账号弹窗 -->
      <el-dialog title="新增内部账号" :visible.sync="dialogVisible">
        <el-form label-width="100px">
          <el-form-item label="用户名" required>
            <el-input v-model="newAccount.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" required>
            <el-input v-model="newAccount.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="newAccount.description" type="textarea"></el-input>
          </el-form-item>
          <el-form-item label="账号类型" required>
            <el-select v-model="newAccount.type">
              <el-option label="咨询师" value="counselor"></el-option>
              <el-option label="督导" value="supervisor"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="newAccount.type === 'counselor'" label="绑定督导" required>
            <el-select v-model="newAccount.supervisor">
              <el-option v-for="supervisor in supervisorList" :key="supervisor.id" :label="supervisor.username" :value="supervisor.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addAccount">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        accounts: [
          { id: 1, username: "张三", registerTime: "2024-04-01", type: "counselor", status: "active", supervisor: 101 },
          { id: 2, username: "李四", registerTime: "2024-03-25", type: "supervisor", status: "active" },
          { id: 3, username: "王五", registerTime: "2024-03-20", type: "supervisor", status: "active" },
        ],
        filter: {
          registerTime: null,
          type: "",
          status: "",
        },
        dialogVisible: false,
        newAccount: {
          username: "",
          password: "",
          description: "",
          type: "",
          supervisor: null,
        },
      };
    },
    computed: {
      filteredAccounts() {
        return this.accounts.filter(account => {
          if (this.filter.type && account.type !== this.filter.type) return false;
          if (this.filter.status && account.status !== this.filter.status) return false;
          if (this.filter.registerTime) {
            const [start, end] = this.filter.registerTime;
            if (new Date(account.registerTime) < new Date(start) || new Date(account.registerTime) > new Date(end)) return false;
          }
          return true;
        });
      },
      supervisorList() {
        return this.accounts.filter(account => account.type === "supervisor");
      },
    },
    methods: {
      applyFilter() {
        // 触发筛选
      },
      openAddDialog() {
        this.dialogVisible = true;
        this.newAccount = { username: "", password: "", description: "", type: "", supervisor: null };
      },
      addAccount() {
        if (!this.newAccount.username || !this.newAccount.password || !this.newAccount.type) {
          this.$message.error("请填写完整信息");
          return;
        }
        if (this.newAccount.type === "counselor" && !this.newAccount.supervisor) {
          this.$message.error("请绑定督导");
          return;
        }
        this.accounts.push({
          id: this.accounts.length + 1,
          username: this.newAccount.username,
          registerTime: new Date().toISOString().split("T")[0],
          type: this.newAccount.type,
          status: "active",
          supervisor: this.newAccount.type === "counselor" ? this.newAccount.supervisor : null,
        });
        this.dialogVisible = false;
        this.$message.success("账号添加成功");
      },
      confirmDelete(account) {
        this.$confirm(`确定要删除账号 "${account.username}" 吗？`, "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          account.status = "inactive";
          this.$message.success("账号已删除");
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .staff-management {
    padding: 20px;
  }
  .filter-form {
    margin-bottom: 20px;
  }
  .add-button {
    margin-top: 10px;
  }
  </style>
  