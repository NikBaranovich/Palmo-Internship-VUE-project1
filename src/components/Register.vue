<template>
  <div class="registration-form">
    <h2>Регистрация</h2>
    <form @submit.prevent="register" class="form">
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
    <button @click="signInWithGoogle" class="google-button">
      Register with Google
    </button>
    <button @click="$router.push({name: 'login'})" class="google-button">
      Login
    </button>
  </div>
</template>
<script>
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
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
    register() {
      this.error = null;
      createUserWithEmailAndPassword(getAuth(), this.email, this.password)
        .then((data) => {
          console.log("Successfully registered!");
          const auth = getAuth();
          updateProfile(auth.currentUser, {
            displayName: this.username,
          });
          const user = auth.currentUser;
          this.$router.push({
            name: "calendar",
          });
        })
        .catch((error) => {
          console.log(error.code);
          switch (error.code) {
            case "auth/invalid-email":
              this.error = "Invalid Email";
              break;
            case "auth/wrong-password":
              this.error = "Incorrect Password";
              break;
            case "auth/weak-password":
              this.error = "Password is too weak";
              break;
            default:
              this.error = "Email or password was incorrect";
              break;
          }
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
    const user = auth.currentUser;
    if (user) {
      console.log(user);
    } else {
      console.log("No user is signed in.");
    }
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
