import { createRouter, createWebHistory } from "vue-router";

import TestComponent from '@/components/TestComponent.vue'

const routes = [
  { path: "/test", component: TestComponent },
  
];

const router = createRouter({
  routes,
  history: createWebHistory(),
});

export default router;