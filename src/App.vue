<template lang="">
  <div class="content">
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";
import {useEventsStore} from "@/store/events.js";
import "vue3-toastify/dist/index.css";

export default {
  data() {
    return {
      msg: null,
    };
  },
  components: {
    NavigationPanel,
  },
  methods: {
    ...mapActions(useAuthorizationStore, ["auth"]),
    ...mapActions(useEventsStore, [
      "saveEvent",
      "eventsInRange",
      "fetchEvents",
      "fetchHolidays",
    ]),
  },
  computed: {
    ...mapState(useEventsStore, ["events"]),
  },
  mounted() {
    this.auth();
    this.fetchEvents();
    this.fetchHolidays(2023, "UA");
  },
};
</script>
<style scoped>
.content {
  display: flex;
  flex-flow: column;
  height: 100%;
}
</style>
