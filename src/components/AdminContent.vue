<template>
    <div class="content-container">
      <Staffmanagement v-if="activeTab === 'staff-management'" />
      <Exportdata v-if="activeTab === 'export-data'"/>
      <Leaveapproval v-if="activeTab === 'leave-approval'"/>
      <Schedulemanagementc v-if="activeTab === 'schedule-management-c'"/>
      <Schedulemanagements v-if="activeTab === 'schedule-management-s'"/>
    </div>
  </template>
  
  <script>
  import Staffmanagement from "@/components/Staff-management.vue";
  import Exportdata from "@/components/Export-data.vue";
  import Leaveapproval from "@/components/Leave-approval.vue";
  import Schedulemanagementc from "@/components/Schedule-management-c.vue";
  import Schedulemanagements from "@/components/Schedule-management-s.vue";
  
  
  export default {
    props: {
      activeTab: String
    },
    components: {
      Staffmanagement,
      Exportdata,
      Leaveapproval,
      Schedulemanagementc,
      Schedulemanagements,
    }
  };
  </script>
  
  <style scoped>
  .content-container {
    position:absolute;
    top:80px;
    left: 180px;
    right:0;
    bottom:0;
    padding: 20px;
    overflow: hidden;
    background-color: #fff; /* 确保内容区有背景，不会透到底层 */
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  </style>