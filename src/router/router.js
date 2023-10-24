import { createRouter, createWebHistory } from "vue-router";

import TestComponent from '@/components/TestComponent.vue'
import Calendar from '@/components/Calendar.vue'
import Register from '@/components/Register.vue'
import Login from '@/components/Login.vue'

const routes = [
  { path: "/", name: "calendar", component: Calendar },
  { path: "/test", component: TestComponent },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;