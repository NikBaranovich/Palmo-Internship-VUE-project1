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
      <toggle-switch v-model="isLightTheme" />
    </div>
  </nav>
</template>

<script setup>
import {useAuthorizationStore} from "../store/authorization.js";
import ToggleSwitch from "@/components/UI/ToggleSwitch.vue";

import {storeToRefs} from "pinia";
const {logout} = useAuthorizationStore();
const {user} = storeToRefs(useAuthorizationStore());
import {useEventsStore} from "@/store/events.js";
const {clearEvents} = useEventsStore();
import {ref, watch} from "vue";

import {useRouter} from "vue-router";
let router = useRouter();

function logoutHandler() {
  clearEvents();
  logout();
  router.push({
    name: "calendar",
  });
}

//Theme switch
function getMediaPreference() {
  const hasDarkPreference = window.matchMedia(
    "(prefers-color-scheme: light)"
  ).matches;
  return hasDarkPreference;
}
function getTheme() {
  const theme = localStorage.getItem("user-theme");
  return theme == "light-theme" ? true : false;
}
function setTheme(isLightTheme) {
  const theme = isLightTheme ? "light-theme" : "dark-theme";
  localStorage.setItem("user-theme", theme);
  document.documentElement.className = theme;
}

const initUserTheme = getTheme() || getMediaPreference();
setTheme(initUserTheme);

let isLightTheme = ref(getTheme());
watch(isLightTheme, () => {
  setTheme(isLightTheme.value);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: var(--secondary-color);
  color: var(--text-color);
  padding: 10px;
}

.navbar a {
  text-decoration: none;
  color: var(--text-color-contrast);
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
  background-color: var(--primary-color);
  color: var(--text-color);
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
