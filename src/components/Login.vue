<template>
  <div class="sign-in-form">
    <h2>Sign In</h2>
    <form @submit.prevent="signIn" class="form">
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
    <button @click="signInWithGoogle" class="google-button">Sign In with Google</button>
  </div>
</template>
<script>
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
export default {
  data() {
    return {
      email: "",
      password: "",
      error: "",
    };
  },
  methods: {
    signIn() {
      signInWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          this.$router.push({
            name: "calendar",
          });
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
    signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      signInWithPopup(getAuth(), provider)
        .then((result) => {
          this.$router.push({
            name: "calendar",
          });
        })
        .catch((error) => {
          this.error = error.message;
        });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
        console.log("No user is signed in.");
      }
    });
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
