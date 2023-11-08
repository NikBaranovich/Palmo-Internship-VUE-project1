<template lang="">
  <div class="content">
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>
<script setup>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {useAuthorizationStore} from "@/store/authorization.js";
import {useEventsStore} from "@/store/events.js";
import {onMounted} from "vue";
import "vue3-toastify/dist/index.css";

const {auth} = useAuthorizationStore();
const {fetchEvents, fetchHolidays} = useEventsStore();

onMounted(() => {
  auth();
  fetchEvents();
  fetchHolidays(new Date().getFullYear(), "UA");
});
</script>
<style scoped>
.content {
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
