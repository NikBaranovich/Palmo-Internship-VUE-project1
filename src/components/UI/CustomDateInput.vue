<template>
  <input
    :value="dateToString"
    @input="updateInput"
    type="datetime-local"
  />
</template>
<script setup>
import {defineProps, defineEmits, computed} from "vue";

const props = defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue"]);

const updateInput = (event) => {
  emit("update:modelValue", stringToDate(event.target.value));
};
const focusInput = (event) => {
  emit("focus", stringToDate(event.target.value));
};

const dateToString = computed(() => {
  const date = props.modelValue;
  if (!(date instanceof Date)) {
    return;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}`;
});
const stringToDate = (string) => {
  return new Date(string);
};
</script>
