import {createRouter, createWebHistory} from "vue-router";

import Calendar from "@/components/Calendar.vue";
import Register from "@/components/Register.vue";
import Login from "@/components/Login.vue";
const SingleEvent = () => import('@/components/SingleEvent.vue')

const routes = [
  {path: "/", name: "calendar", component: Calendar},
  {path: "/register", name: "register", component: Register},
  {path: "/login", name: "login", component: Login},
  {path: "/events/:id", name: "singleEvent", component: SingleEvent},
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;
