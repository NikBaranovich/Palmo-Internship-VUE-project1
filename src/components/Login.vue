<template>
  <div class="sign-in-form">
    <h2>Sign In</h2>
    <form @submit.prevent="signInFormSubmit" class="form">
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit" class="sign-in-button">Sign In</button>
    </form>
    <button @click="signInWithGoogleHandler" class="google-button">
      Sign In with Google
    </button>
  </div>
</template>
<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {usePageStore} from "@/store/page.js";
import {mapActions, mapState} from "pinia";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  computed: {
    ...mapState(usePageStore, ["pageYear", "pageMonth"]),
  },
  methods: {
    ...mapActions(useAuthorizationStore, ["signIn", "signInWithGoogle"]),
    async signInWithGoogleHandler() {
      await this.signInWithGoogle();
      this.$router.push({
        name: "calendar",
        query: {
          month: this.pageMonth,
          year: this.pageYear,
        },
      });
    },
    async signInFormSubmit() {
      this.error = await this.signIn(this.email, this.password);
      if (this.error) {
        return;
      }
      this.$router.push({
        name: "calendar",
        query: {
          month: this.pageMonth,
          year: this.pageYear,
        },
      });
    },
  },
};
</script>
<style>
.sign-in-form {
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

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.error {
  color: red;
  margin-top: 10px;
}

.sign-in-button {
  background-color: #007bff;
  color: #fff !important;
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
