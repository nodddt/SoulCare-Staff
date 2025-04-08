<template>
  <div class="container">
    <Navbar />
    <Sidebar @menu-change="handleMenuChange" />
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/SupervisorSidebar.vue";

export default {
  components: {
    Navbar,
    Sidebar
  },
  data() {
    return {
      currentTab: "schedule"
    };
  },
  methods: {
    handleMenuChange(tab) {
      this.currentTab = tab;
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  margin-left: 180px; /* 侧边栏宽度 */
  margin-top: 80px; /* 顶部导航栏高度 */
  padding: 20px;
  flex-grow: 1;
}
</style>
