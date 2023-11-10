import {defineStore} from "pinia";
import {toast} from "vue3-toastify";

import {useEventsStore} from "@/store/events.js";
import { debounce } from "../hooks/useDebouce";

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

import {ref, computed} from "vue";

export const useAuthorizationStore = defineStore("authorization", () => {
  //User cache email
  let userCacheEmailState = ref(null);

  const userCacheEmail = computed(() => {
    return userCacheEmailState.value;
  });

  const setUserCacheEmail = (value) => {
    userCacheEmailState.value = value;
  };

  //User credentials
  let currentUser = ref(null);

  const user = computed(() => {
    return currentUser.value;
  });
  const auth = () => {
    const auth = getAuth();
    const {fetchEvents} = useEventsStore();
    onAuthStateChanged(auth, async (user) => {
      await debounce(async () => {
        await fetchEvents(user);
      });
      if (user) {
        if (!user.emailVerified) {
          await logout();
          currentUser.value = null;
          return;
        }
        currentUser.value = {...user};
        return;
      }

      currentUser.value = null;
    });
  };

  //Authorization
  async function register(email, password, username) {
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
  }

  async function signIn(email, password) {
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
  }

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(getAuth(), provider);
    } catch (error) {
      return error.code;
    }
  }

  async function logout() {
    await signOut(getAuth());
  }

  //Account management
  async function updateUserName(newName) {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updateProfile(user, {
        displayName: newName,
      });

      currentUser.value = {...auth.currentUser};

      toast.success("Username updated!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function updateUserImage(photoURL) {
    const auth = getAuth();

    try {
      await updateProfile(auth.currentUser, {
        photoURL,
      });
      currentUser.value = {...auth.currentUser};
      toast.success("Image updated!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function updateUserPassword(newPassword) {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updatePassword(user, newPassword);

      toast.success("Password updated!");
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function sendPasswordReset(email) {
    const auth = getAuth();

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return {
    currentUser,
    user,
    userCacheEmailState,
    userCacheEmail,
    setUserCacheEmail,
    auth,
    register,
    signIn,
    signInWithGoogle,
    logout,
    updateUserName,
    updateUserImage,
    updateUserPassword,
    sendPasswordReset,
  };
});
