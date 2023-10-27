<template lang="">
  <div>
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {useEventsStore} from "@/store/events.js";
import {useAuthorizationStore} from "@/store/authorization.js";
import {mapActions, mapState} from "pinia";

export default {
  data() {
    return {
      msg: null,
    };
  },
  components: {
    NavigationPanel,
  },
  computed: {
    ...mapState(useEventsStore, ["events"]),
  },
  methods: {
    ...mapActions(useEventsStore, ["fetchEvents"]),
    ...mapActions(useAuthorizationStore, ["auth"]),
  },
  mounted() {
    this.fetchEvents();
    this.auth();
  },
};
</script>
