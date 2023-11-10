<template>
  <div class="sign-in">
    <div class="sign-in-form">
      <h2>Sign In</h2>
      <form @submit.prevent="signInFormSubmit" class="form">
        <div class="form-group">
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="email"
            @input="validateEmail"
            required
          />
          <div v-color:red v-if="errors.email" class="invalid-input-error">
            {{ errors.email }}
          </div>
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
      <div>
        <router-link :to="{name: 'forgot'}">Forgot your password?</router-link>
      </div>
    </div>
  </div>
</template>
<script setup>
import {useAuthorizationStore} from "@/store/authorization.js";
const {setUserCacheEmail, userCacheEmail, signIn, signInWithGoogle} =
  useAuthorizationStore();

import {usePageStore} from "@/store/page.js";
const {pageYear, pageMonth} = usePageStore();

import {useFormValidation} from "@/hooks/useFormValidation.js";
const {isEmailInvalid} = useFormValidation();

import {ref, reactive} from "vue";
import {useRouter} from "vue-router";
let router = useRouter();

//Email Sign In
let email = ref(userCacheEmail);
let password = ref("");
let error = ref("");
const errors = reactive({
  email: "",
});
const validateEmail = () => {
  errors.email = isEmailInvalid(email.value);
};

async function signInFormSubmit() {
  error.value = await signIn(email.value, password.value);

  if (error.value || errors.email) {
    return;
  }

  setUserCacheEmail(email.value);
  router.push({
    name: "calendar",
    query: {
      month: pageMonth,
      year: pageYear,
    },
  });
}

//Google Sign In
async function signInWithGoogleHandler() {
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
}
</script>
<style>
.sign-in {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.sign-in-form {
  width: 400px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  text-align: center;
  background-color: var(--secondary-color-contrast);
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
  border: 1px solid var(--primary-accent);
  color: var(--text-color);
  border-radius: 5px;
}

.error {
  color: red;
  margin-top: 10px;
}

.sign-in-button {
  background-color: var(--button-accent);
  color: var(--text-color-contrast) !important;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.google-button {
  background-color: #dd4b39;
  color: var(--text-color-contrast) !important;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}
</style>
