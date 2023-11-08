import {defineStore} from "pinia";
import {ref, computed} from "vue";

export const usePageStore = defineStore("page", () => {
  let yearState = ref(null);
  let monthState = ref(null);
  const pageYear = computed(() => yearState.value);
  const pageMonth = computed(() => monthState.value);

  function setPageDate(month, year) {
    yearState.value = year;
    monthState.value = month;
  }
  return {
    pageYear,
    pageMonth,
    setPageDate,
  };
});
