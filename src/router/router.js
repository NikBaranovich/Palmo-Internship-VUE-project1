import {createRouter, createWebHistory} from "vue-router";

import Calendar from "@/components/Calendar.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
import NotFound from "@/components/NotFound.vue";
import UserPage from "@/components/UserPage.vue";
import ForgotPassword from "@/components/ForgotPassword.vue";
const SingleEvent = () => import("@/components/SingleEvent.vue");

import {useEventsStore} from "@/store/events.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import {storeToRefs} from "pinia";
import {debounce} from "../hooks/useDebouce";

const routes = [
  {path: "/", name: "calendar", component: Calendar},
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {requireNoAuth: true},
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    props: true,
    meta: {requireNoAuth: true},
  },
  {
    path: "/user",
    name: "user",
    component: UserPage,
    meta: {requireAuth: true},
  },
  {
    path: "/forgot",
    name: "forgot",
    component: ForgotPassword,
  },
  {path: "/events/:id", name: "singleEvent", component: SingleEvent},
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFound,
  },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.name == "singleEvent")) {
    const {fetchEvents} = useEventsStore();
    const {events} = storeToRefs(useEventsStore());
    const user = await getCurrentUser();
    if (!user) {
      next({name: "notFound"});
      return;
    }
    if (!events.value.length) {
      await debounce(async () => {
        await fetchEvents(user);
      });
    }
    const existedEvent = events.value.find((event) => {
      return event.id == to.params.id;
    });
    if (!existedEvent) {
      next({name: "notFound"});
      return;
    }
    next();
    return;
  }
  if (to.matched.some((record) => record.meta.requireAuth == true)) {
    if (!(await getCurrentUser())) {
      next({name: "notFound"});
      return;
    }
  }
  if (to.matched.some((record) => record.meta.requireNoAuth == true)) {
    if (await getCurrentUser()) {
      next({name: "notFound"});
      return;
    }
  }
  next();
});

function getCurrentUser() {
  const auth = getAuth();
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        unsubscribe();
        resolve(user);
      },
      reject
    );
  });
}

export default router;
