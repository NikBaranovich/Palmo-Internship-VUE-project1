<template>
  <div class="registration-form">
    <h2>Registration</h2>
    <form @submit.prevent="registerFormSubmit" class="form">
      <div class="form-group">
        <label for="email">Username:</label>
        <input type="text" id="username" v-model="username" required />
        <div v-color:red v-if="errors.username" class="invalid-input-error">
          {{ errors.username }}
        </div>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
        <div v-color:red v-if="errors.email" class="invalid-input-error">
          {{ errors.email }}
        </div>
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
        <div v-color:red v-if="errors.password" class="invalid-input-error">
          {{ errors.password }}
        </div>
      </div>
      <div class="error" v-if="error">{{ error }}</div>
      <button type="submit" class="register-button">Register</button>
    </form>
    <button @click="signInWithGoogleHandler" class="google-button">
      Register with Google
    </button>
    <button @click="$router.push({name: 'login'})">
      Already have an account? Login
    </button>
  </div>
</template>
<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {usePageStore} from "@/store/page.js";
import {formValidationMixin} from "@/mixins/formValidation.js";
import {redirectMixin} from "@/mixins/redirect.js";

import {mapActions, mapState} from "pinia";
export default {
  data() {
    return {
      username: "",
      email: "",
      password: "",
      error: null,
      errors: {
        username: null,
        email: null,
        password: null,
      },
    };
  },
  computed: {
    ...mapState(usePageStore, ["pageYear", "pageMonth"]),
  },
  mixins: [formValidationMixin, redirectMixin],
  methods: {
    ...mapActions(useAuthorizationStore, ["register", "signInWithGoogle"]),
    async signInWithGoogleHandler() {
      console.log(this.pageYear, this.pageMonth);
      await this.signInWithGoogle();
      this.$router.push({
        name: "calendar",
        query: {
          month: this.pageMonth,
          year: this.pageYear,
        },
      });
    },
    async registerFormSubmit() {
      this.errors.username = this.isNameInvalid(this.username);
      this.errors.email = this.isEmailInvalid(this.email);
      this.errors.password = this.isPasswordInvalid(this.password);
      if (this.errors.username || this.errors.email || this.errors.password) {
        return;
      }
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
        query: {
          month: this.pageMonth,
          year: this.pageYear,
        },
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
