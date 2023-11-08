<template>
  <select name="select" class="custom-select" v-model="selectedOption">
    <option v-for="option in options" :value="option">
      {{ option }}
    </option>
  </select>
</template>
<script setup>
import {defineProps, defineEmits, computed} from "vue";

const props = defineProps(["options", "modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const selectedOption = computed({
  get: () => {
    return props.modelValue;
  },
  set: (newValue) => {
    emit("update:modelValue", newValue);
  },
});
</script>
