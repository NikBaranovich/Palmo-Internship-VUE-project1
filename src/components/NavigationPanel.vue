<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link :to="{name: 'calendar'}">Calendar</router-link>
    </div>
    <div class="navbar-right">
      <div v-if="user">
        <router-link :to="{name: 'user'}" class="user-info"
          >Welcome, {{ user.displayName }}</router-link
        >
        <button @click="logoutHandler">Logout</button>
      </div>
      <div v-else>
        <router-link :to="{name: 'login'}">Login</router-link>
        <router-link :to="{name: 'register'}">Register</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import {useAuthorizationStore} from "../store/authorization.js";
import {storeToRefs} from "pinia";
const {logout} = useAuthorizationStore();
const {user} = storeToRefs(useAuthorizationStore());
import {useEventsStore} from "@/store/events.js";
const {clearEvents} = useEventsStore();

import {useRouter} from "vue-router";
let router = useRouter();

function logoutHandler() {
  clearEvents();
  logout();
  router.push({
    name: "calendar",
  });
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--secondary-color);
  color: #fff;
  padding: 10px;
}

.navbar a {
  text-decoration: none;
  color: #fff;
  margin-right: 20px;
}

.navbar-right {
  display: flex;
  align-items: center;
}

.navbar-right .user-info {
  margin-right: 10px;
}

.navbar-right button {
  background-color: #fff;
  color: var(--secondary-color);
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
