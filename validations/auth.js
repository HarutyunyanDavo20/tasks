import { body } from "express-validator";

export const registerValidation = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть минимум 6 символов ")
    .isLength({ min: 5 })
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/, "i"),
  body("firstName", "Укажите имя").isLength({ min: 3 }),
  body("lastName", "Укажите фамилия").isLength({ min: 3 }),
  body("age", "Неверный возраст").isNumeric().isLength({ min: 1, max: 2 }),
];
  