const { body } = require("express-validator");

export const noteValidation = [
  body("title", " min-5, max-100").isLength({ min: 3, max: 100 }),
  body("settings", "setting not object").isObject(),
  body("accessType", "accessType not boolean").isBoolean(),
];
