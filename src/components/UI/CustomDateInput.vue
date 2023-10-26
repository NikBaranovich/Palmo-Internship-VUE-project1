<template>
  <input :value="dateToString" @input="updateInput" type="date" />
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

      return `${year}-${month}-${day}`;
    },
    stringToDate(string) {
      return new Date(string + "T00:00");
    },
  },
  methods: {
    updateInput(event) {
      console.log("dateString", event.target.value);
      this.$emit("update:modelValue", new Date(event.target.value + "T00:00"));
    },
  },
};
</script>
<style></style>
