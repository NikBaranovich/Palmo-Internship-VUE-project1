import {createApp} from "vue";
import App from "./App.vue";
import router from "@/router/router.js";
import {createPinia} from "pinia";
import {db} from "@/firebase/index.js";

// Vuetify
import "vuetify/styles";
import {createVuetify} from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

import Vue3Toastify from 'vue3-toastify';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
const pinia = createPinia();

app
  .use(router)
  .use(vuetify)
  .use(pinia)
  .use(Vue3Toastify, {
    autoClose: 2000,
  })
  .directive("color", {
    mounted(el, binding) {
      const color = binding.value || binding.arg || "black";
      el.style.color = color;
    },
  })
  .mount("#app");
