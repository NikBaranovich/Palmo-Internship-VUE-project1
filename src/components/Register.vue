<template>
  <div>
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
      <div>
        Already have an account?
        <router-link :to="{name: 'login'}"> Login</router-link>
      </div>
    </div>
    <modal-message v-if="isModalVisible">
      <template v-slot:header>
        <h2>Last one step</h2>
      </template>
      <template v-slot:content>
        <p>
          Click the link we sent to {{ email }} to complete your account set-up.
        </p>
      </template>
      <template v-slot:buttons>
        <button class="message-button" @click="closeModal">Got It!</button>
      </template>
    </modal-message>
  </div>
</template>
<script>
import {useAuthorizationStore} from "@/store/authorization.js";
import {usePageStore} from "@/store/page.js";
import {formValidationMixin} from "@/mixins/formValidation.js";
import {redirectMixin} from "@/mixins/redirect.js";

import ModalMessage from "@/components//ModalMessage.vue";
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
      isModalVisible: false,
    };
  },
  computed: {
    ...mapState(usePageStore, ["pageYear", "pageMonth"]),
  },
  components: {
    ModalMessage,
  },
  mixins: [formValidationMixin, redirectMixin],
  methods: {
    ...mapActions(useAuthorizationStore, [
      "register",
      "signInWithGoogle",
      "setUserCacheEmail",
    ]),
    closeModal() {
      this.isModalVisible = false;
      this.setUserCacheEmail(this.email);
      this.$router.push({
        name: "login",
      });
    },
    async signInWithGoogleHandler() {
      if (await this.signInWithGoogle()) {
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
      this.isModalVisible = true;
    },
  },
};
</script>
<style scoped>
.registration-form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
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
.message-button {
  background: #2980b9;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}
</style>
