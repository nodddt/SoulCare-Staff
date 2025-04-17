<template>
  <div>
    <!-- 筛选条件 -->
    <el-form :inline="true" class="filter-form">
      <el-form-item label="申请时间">
        <el-date-picker
          v-model="filterDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>
      <el-form-item label="审批状态">
        <el-select v-model="filterStatus" placeholder="请选择">
          <el-option label="全部" value="" />
          <el-option label="未审批" value="pending" />
          <el-option label="已通过" value="approved" />
          <el-option label="已驳回" value="rejected" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="filterRecords">筛选</el-button>
      </el-form-item>
    </el-form>

    <!-- 请假记录列表 -->
    <el-table :data="filteredLeaves" style="width: 100%">
      <el-table-column prop="counselorName" label="咨询师" width="120" />
      <el-table-column prop="applyTime" label="申请时间" width="180" />
      <el-table-column prop="leaveDate" label="请假日期" width="120" />
      <el-table-column prop="timePeriod" label="时间段" width="100" />
      <el-table-column label="请假理由" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="showReason(scope.row.reason)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="statusText" label="审批状态" width="120" />
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="openApprovalDialog(scope.row)"
            v-if="scope.row.status === 'pending'"
          >
            审批
          </el-button>
          <span v-else>{{ scope.row.statusText }}</span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 请假理由弹窗 -->
    <el-dialog title="请假理由" :visible.sync="reasonDialogVisible">
      <p>{{ selectedReason }}</p>
      <el-button type="primary" @click="reasonDialogVisible = false">关闭</el-button>
    </el-dialog>

    <!-- 审批弹窗 -->
    <el-dialog title="审批请假申请" :visible.sync="approvalDialogVisible">
      <p>请审批该咨询师的请假申请：</p>
      <el-radio-group v-model="approvalStatus">
        <el-radio label="approved">通过</el-radio>
        <el-radio label="rejected">驳回</el-radio>
      </el-radio-group>
      <div style="margin-top: 20px;">
        <el-button type="primary" @click="submitApproval">确认</el-button>
        <el-button @click="approvalDialogVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leaveRecords: [
        {
          id: 1,
          counselorName: "张三",
          applyTime: "2025-04-10 09:30",
          leaveDate: "2025-04-12",
          timePeriod: "上午",
          reason: "家中有急事",
          status: "pending",
        },
        {
          id: 2,
          counselorName: "李四",
          applyTime: "2025-04-09 15:20",
          leaveDate: "2025-04-11",
          timePeriod: "下午",
          reason: "身体不适",
          status: "approved",
        }
      ],
      filterDate: null,
      filterStatus: "",
      reasonDialogVisible: false,
      selectedReason: "",
      approvalDialogVisible: false,
      selectedLeave: null,
      approvalStatus: ""
    };
  },
  computed: {
    filteredLeaves() {
      return this.leaveRecords
        .filter((record) => {
          if (this.filterStatus && record.status !== this.filterStatus) return false;
          if (this.filterDate) {
            const [start, end] = this.filterDate;
            const applyTime = new Date(record.applyTime);
            if (applyTime < start || applyTime > end) return false;
          }
          return true;
        })
        .map(record => ({
          ...record,
          statusText: this.getStatusText(record.status)
        }));
    }
  },
  methods: {
    filterRecords() {
      // 这里的筛选逻辑已经写在 computed 里，调用时会自动更新
    },
    showReason(reason) {
      this.selectedReason = reason;
      this.reasonDialogVisible = true;
    },
    openApprovalDialog(record) {
      this.selectedLeave = record;
      this.approvalStatus = "";
      this.approvalDialogVisible = true;
    },
    submitApproval() {
      if (!this.selectedLeave) return;
      this.selectedLeave.status = this.approvalStatus;
      this.approvalDialogVisible = false;
    },
    getStatusText(status) {
      const statusMap = {
        pending: "未审批",
        approved: "已通过",
        rejected: "已驳回"
      };
      return statusMap[status] || "未知状态";
    }
  }
};
</script>

<style scoped>
.filter-form {
  margin-bottom: 20px;
}
</style>
