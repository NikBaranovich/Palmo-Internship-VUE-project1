import {defineStore} from "pinia";

export const usePageStore = defineStore("page", {
  state: () => ({
    yearState: null,
    monthState: null,
  }),
  getters: {
    pageYear: (state) => state.yearState,
    pageMonth: (state) => state.monthState,
  },
  actions: {
    setPageDate(month, year) {
      this.yearState = year;
      this.monthState = month;
    },
  },
});
