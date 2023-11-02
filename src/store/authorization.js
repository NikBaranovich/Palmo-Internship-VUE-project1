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
  sendEmailVerification,
  sendPasswordResetEmail,
  updatePassword,
} from "firebase/auth";

export const useAuthorizationStore = defineStore("authorization", {
  state: () => ({
    currentUser: null,
    userCacheEmailState: "",
  }),
  getters: {
    user: (state) => state.currentUser,
    userCacheEmail: (state) => state.userCacheEmailState,
  },
  actions: {
    setUserCacheEmail(value) {
      this.userCacheEmailState = value;
    },
    auth() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          if (!user.emailVerified) {
            await this.logout();
            this.currentUser = null;
            return;
          }
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
        sendEmailVerification(auth.currentUser);
      } catch (error) {
        return error.code;
      }
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      return;
    },
    async signIn(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        if (!userCredential.user.emailVerified) {
          return "Email is not verified!";
        }
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

    async updateUserName(newName) {
      const auth = getAuth();
      const user = auth.currentUser;
      try {
        await updateProfile(user, {
          displayName: newName,
        });
        this.currentUser = {...auth.currentUser};
        console.log("Profile updated!");
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserImage(photoURL) {
      const auth = getAuth();
      try {
        await updateProfile(auth.currentUser, {
          photoURL,
        });
        this.currentUser = {...auth.currentUser};
        console.log("Profile updated!");
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserPassword(newPassword) {
      const auth = getAuth();
      const user = auth.currentUser;
      try {
        await updatePassword(user, newPassword);
        console.log("Password updated!");
      } catch (error) {
        console.log(error);
      }
    },
    async sendPasswordReset(email) {
      const auth = getAuth();
      try {
        const x = await sendPasswordResetEmail(auth, email);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
