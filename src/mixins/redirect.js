export const redirectMixin = {
  methods: {
    goToPage(name, params) {
      this.$router.push({
        name,
        params,
      });
    },
  },
};
