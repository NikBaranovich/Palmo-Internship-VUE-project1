export const formValidationMixin = {
  methods: {
    isNameInvalid(name) {
      const minLength = 3;
      const maxLength = 30;
      if (!name) {
        return "Name field is required";
      }
      if (name.length <= minLength) {
        return `Name must be at least ${minLength} characters`;
      }
      if (name.length >= maxLength) {
        return `Name must be no more than ${maxLength} characters`;
      }
      return null;
    },
    isEmailInvalid(email) {
      const atSymbol = email.indexOf("@");
      const dotSymbol = email.lastIndexOf(".");
      const spaceSymbol = email.indexOf(" ");

      if (!email) {
        return "Phone field is required";
      }

      if (atSymbol === -1 || dotSymbol === -1) {
        return "Email must contain an at symbol and a dot";
      }

      if (atSymbol === 0 || dotSymbol === 0) {
        return "Invalid email format";
      }

      if (dotSymbol <= atSymbol + 1 || email.length <= dotSymbol + 1) {
        return "Invalid email format";
      }

      if (spaceSymbol != -1) {
        return "Email must not contain spaces";
      }

      return null;
    },
    isPasswordInvalid(password) {
      const hasNumber = /\d/.test(password);
      const hasUpperCase = /[A-Z]/.test(password);
      const isLengthValid = password.length >= 6;
      if (!isLengthValid) {
        return "The password must be at least 6 characters";
      }
      if (!hasNumber || !hasUpperCase) {
        return "The password must contain at least one number or capital letter";
      }
      return null;
    },

    isEndDateInvalid(startDate, endDate) {
      if (startDate.getTime()>endDate.getTime()) {
        return "The end date must be after the start date.";
      }
      return null;
    },
  },
};
