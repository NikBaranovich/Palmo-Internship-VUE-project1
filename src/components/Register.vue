<template>
  <div class="registration-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="registerFormSubmit" class="form">
      <div class="form-group">
        <label for="email">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit" class="register-button">Register</button>
    </form>
    <button @click="signInWithGoogleHandler" class="google-button">
      Register with Google
    </button>
    <button @click="$router.push({name: 'login'})" class="google-button">
      Login
    </button>
  </div>
</template>
<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: null,
    };
  },
  methods: {
    ...mapActions(useAuthorizationStore, ["register", "signInWithGoogle"]),
    async signInWithGoogleHandler() {
      await this.signInWithGoogle();
      this.$router.push({
        name: "calendar",
      });
    },
    async registerFormSubmit() {
      this.error = await this.register(
        this.email,
        this.password,
        this.username
      );
      if (this.error) {
        return;
      }
      this.$router.push({
        name: "calendar",
      });
    },
  },
};
</script>
<style scoped>
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  text-align: center;
}

.form-group {
  margin: 10px 0;
}

label {
  display: block;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
  margin-top: 10px;
}

.register-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.google-button {
  background-color: #dd4b39;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
