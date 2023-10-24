<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/">Календарь</router-link>
      <router-link to="/">Настройки</router-link>
    </div>
    <div class="navbar-right">
      <div v-if="currentUser">
        <span class="user-info">Добро пожаловать, {{ currentUser.displayName }}</span>
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
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default {
  data() {
    return {
      currentUser: null,
    };
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  },
  methods: {
    logout() {
      signOut(getAuth()).then(() => {
        this.$router.push({
          name: "calendar",
        });
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
