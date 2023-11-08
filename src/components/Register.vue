<template>
  <div class="registration">
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
<script setup>
//Store
import {useAuthorizationStore} from "@/store/authorization.js";
const {register, signInWithGoogle, setUserCacheEmail} = useAuthorizationStore();

import {usePageStore} from "@/store/page.js";
const {pageYear, pageMonth} = usePageStore();

//Hooks
import {useFormValidation} from "@/hooks/useFormValidation.js";
const {isNameInvalid, isEmailInvalid, isPasswordInvalid} = useFormValidation();

import {ref, reactive} from "vue";

import {useRouter} from "vue-router";
let router = useRouter();

//Register
let username = ref("");
let email = ref("");
let password = ref("");
let error = ref("");
const errors = reactive({
  username: null,
  email: null,
  password: null,
});
const registerFormSubmit = async () => {
  errors.username = isNameInvalid(username.value);
  errors.email = isEmailInvalid(email.value);
  errors.password = isPasswordInvalid(password.value);
  if (errors.username || errors.email || errors.password) {
    return;
  }
  error.value = await register(email.value, password.value, username.value);
  if (error.value) {
    return;
  }
  isModalVisible.value = true;
};

const signInWithGoogleHandler = async () => {
  if (await signInWithGoogle()) {
    return;
  }
  router.push({
    name: "calendar",
    query: {
      month: pageMonth,
      year: pageYear,
    },
  });
};

//Modal
import ModalMessage from "@/components//ModalMessage.vue";

let isModalVisible = ref(false);

const closeModal = () => {
  isModalVisible.value = false;
  setUserCacheEmail(email.value);
  router.push({
    name: "login",
  });
};
</script>
<style scoped>
.registration {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.registration-form {
  width: 400px;
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
