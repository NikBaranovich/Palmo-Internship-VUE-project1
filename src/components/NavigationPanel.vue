<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/">Календарь</router-link>
    </div>
    <div class="navbar-right">
      <div v-if="user">
        <span class="user-info">Добро пожаловать, {{ user.displayName }}</span>
        <button @click="logout">Выход</button>
      </div>
      <div v-else>
        <router-link to="/login">Вход</router-link>
        <router-link to="/register">Регистрация</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";
export default {
  data() {
    return {
      currentUser: null,
    };
  },
  computed: {
    ...mapState(useAuthorizationStore, ["user"]),
  },
  methods: {
    ...mapActions(useAuthorizationStore, ["logout"]),
    logoutHandler() {
      logout();
      this.$router.push({
        name: "calendar",
      });
    },
  },
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  background-color: #007bff;
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
  color: #007bff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}
</style>
