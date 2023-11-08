<template>
  <div class="custom-modal">
    <div class="event-modal" :style="{left: coords.left, top: coords.top}">
      <div class="event-modal-content">
        <div class="event-header">
          <slot name="header"></slot>
        </div>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import {defineProps} from "vue";

const props = defineProps({
  coords: Object,
});
</script>
<style scoped>
.custom-modal {
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 1000;
}
.event-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  width: 320px;
  z-index: 1000;
}

.event-modal-content {
  padding: 20px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
