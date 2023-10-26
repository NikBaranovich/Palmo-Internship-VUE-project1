import {createRouter, createWebHistory} from "vue-router";

import Calendar from "@/components/Calendar.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";

const routes = [
  {path: "/", name: "calendar", component: Calendar},
  {path: "/register", name: "register", component: Register},
  {path: "/login", name: "login", component: Login},
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
