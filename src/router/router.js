import {createRouter, createWebHistory} from "vue-router";

import Calendar from "@/components/Calendar.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
import AccessDenied from "@/components/AccessDenied.vue";
import NotFound from "@/components/NotFound.vue";
import UserPage from "@/components/UserPage.vue";
const SingleEvent = () => import("@/components/SingleEvent.vue");

import {useEventsStore} from "@/store/events.js";
import {getAuth, onAuthStateChanged} from "firebase/auth";

const routes = [
  {path: "/", name: "calendar", component: Calendar},
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {requireNoAuth: true},
  },
  {
    path: "/access-denied",
    name: "accessDenied",
    component: AccessDenied,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {requireNoAuth: true},
  },
  {
    path: "/user",
    name: "user",
    component: UserPage,
    meta: {requireAuth: true},
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
    const eventsStore = useEventsStore();

    const hasEvent = eventsStore.events.find(
      (event) => event.id == to.params.id
    );
    if (!hasEvent) {
      next({name: "notFound"});
      return;
    }
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
