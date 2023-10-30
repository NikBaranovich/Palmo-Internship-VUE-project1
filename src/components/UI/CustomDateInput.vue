<template>
  <input :value="dateToString" @input="updateInput" type="datetime-local" />
</template>
<script>
export default {
  props: {
    modelValue: {
      type: Date,
      required: true,
    },
  },
  computed: {
    dateToString() {
      const date = this.modelValue;
      if (!(date instanceof Date)) {
        return;
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hour = String(date.getHours()).padStart(2, "0");
      const minute = String(date.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hour}:${minute}`;
    },
  },
  methods: {
    updateInput(event) {
      this.$emit("update:modelValue", this.stringToDate(event.target.value));
    },
    stringToDate(string) {
      return new Date(string);
    },
  },
};
</script>
<style></style>
