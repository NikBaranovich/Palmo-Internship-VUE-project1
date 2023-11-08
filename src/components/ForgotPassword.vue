<template>
  <div class="forgot-password">
    <div class="forgot-password-form">
      <h2>Forgot your password?</h2>
      <p>
        Enter your email address and we will send you password reset
        instructions.
      </p>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <button @click="resetPassword(email)">Send</button>
      </form>
      <modal-message v-if="isModalVisible">
        <template v-slot:content>
          <p>Password reset instructions have been sent to your email.</p>
        </template>
        <template v-slot:buttons>
          <button class="message-button" @click="closeModal">Got It!</button>
        </template>
      </modal-message>
    </div>
  </div>
</template>

<script setup>

import {useAuthorizationStore} from "@/store/authorization.js";
const {userCacheEmail, sendPasswordReset, setUserCacheEmail} =
  useAuthorizationStore();

import {useRouter} from "vue-router";
let router = useRouter();

import {ref, onMounted} from "vue";

//Email form
let email = ref("");

onMounted(() => {
  email = userCacheEmail;
});

function resetPassword(email) {
  isModalVisible.value = true;
  sendPasswordReset(email);
}

//Modal
import ModalMessage from "@/components//ModalMessage.vue";

let isModalVisible = ref(false);

function closeModal() {
  isModalVisible.value = false;
  setUserCacheEmail(email);
  router.push({
    name: "login",
  });
}

</script>
<style scoped>
.forgot-password {
  display: flex;
  justify-content: center;
  align-items: center;
}

.forgot-password-form {
  text-align: center;
  background: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 15px;
}

label {
  font-weight: bold;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button {
  padding: 10px 20px;
  background-color: #2980b9;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1c638e;
}

.success-message {
  color: #2ecc71;
  margin-top: 20px;
}
</style>
