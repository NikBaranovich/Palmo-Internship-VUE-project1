<template lang="">
  <div>
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";
import {useEventsStore} from "@/store/events.js";

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
  mounted() {
    this.auth();
  },
  created() {
    this.fetchEvents();
    this.fetchHolidays(2023, "UA");
  },
};
</script>
