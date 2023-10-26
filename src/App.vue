<template lang="">
  <div>
    <navigation-panel />
    <router-view></router-view>
  </div>
</template>
<script>
import NavigationPanel from "@/components/NavigationPanel.vue";
import {useEventsStore} from "@/store/events.js";
import {mapActions, mapState} from "pinia";

export default {
  components: {
    NavigationPanel,
  },
  computed: {
    ...mapState(useEventsStore, ["events"]),
  },
  methods: {
    ...mapActions(useEventsStore, ["fetchEvents"]),
  },
  mounted() {
    this.fetchEvents();
    console.log(this.events);
  },
};
</script>
