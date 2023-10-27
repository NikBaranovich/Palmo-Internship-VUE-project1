import {defineStore} from "pinia";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
export const useAuthorizationStore = defineStore("authorization", {
  state: () => ({
    currentUser: null,
  }),
  getters: {
    user: (state) => state.currentUser,
  },
  actions: {
    auth() {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.currentUser = {...user};
        } else {
          this.currentUser = null;
        }
      });
    },
    async register(email, password, username) {
      const auth = getAuth();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
      } catch (error) {
        console.log(error.code);
        switch (error.code) {
          case "auth/invalid-email":
            return "Invalid Email";
          case "auth/wrong-password":
            return "Incorrect Password";
          case "auth/weak-password":
            return "Password is too weak";
          default:
            return "Email or password was incorrect";
        }
      }
      console.log("Successfully registered!");
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      this.currentUser = auth.currentUser;
      return;
    },
    async signIn(email, password) {
      try {
        await signInWithEmailAndPassword(getAuth(), email, password);
      } catch (error) {
        return error.code;
      }
    },
    async signInWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(getAuth(), provider);
      } catch (error) {
        return error.code;
      }
    },
    async logout() {
      await signOut(getAuth());
    },
  },
});
