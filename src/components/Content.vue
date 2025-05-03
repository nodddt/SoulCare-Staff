<template>
  <div class="content-container">
    <MySchedule v-if="activeTab === 'schedule'" />
    <Appointment v-if="activeTab === 'appointment'"/>
    <Messages v-if="activeTab === 'messages'"/>
    <Reviews v-if="activeTab === 'reviews'"/>
  </div>
</template>

<script>
import MySchedule from "@/components/MySchedule.vue";
import Appointment from "@/components/Appointment.vue";
import Reviews from "@/components/Reviews.vue";
import Messages from "@/components/Messages.vue";


export default {
  props: {
    activeTab: String
  },
  components: {
    MySchedule,
    Appointment,
    Reviews,
    Messages
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