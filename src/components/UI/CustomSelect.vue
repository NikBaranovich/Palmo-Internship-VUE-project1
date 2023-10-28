<template>
  <select name="select" class= "custom-select" v-model="selectedOption">
    <option v-for="option in options" :value="option">
      {{ option }}
    </option>
  </select>
</template>
<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  computed: {
    selectedOption: {
      get() {
        return this.modelValue;
      },
      set(newValue) {
        this.$emit("update:modelValue", newValue);
      },
    },
  },
};
</script>
