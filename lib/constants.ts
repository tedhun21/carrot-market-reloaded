export const PASSWORD_MIN_LENGTH = 4;
// At least one uppercase letter, one lowercase letter, one number and one special character
export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
);

export const PASSWORD_REGEX_ERROR =
  "A paasword mush have lowercase, UPPERCASE, a number and special characters.";
