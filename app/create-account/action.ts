"use server";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from "@/lib/constans";
import db from "@/lib/db";
import { z } from "zod";

function checkUsername(username: string) {
  return username.includes("potato") ? false : true;
}

async function checkUniqueUsername(username: string) {
  //check if username is taken
  const user = await db.user.findUnique({
    where: { username },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
}
async function checkUniqueEmail(email: string) {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  return !Boolean(user);
}

function checkPasswords({
  password,
  confirm_password,
}: {
  password: string;
  confirm_password: string;
}) {
  return password === confirm_password;
}
const formSchema = z
  .object({
    username: z
      .string({
        invalid_type_error: "Username must be a string!",
        required_error: "Where is the username?",
      })
      .toLowerCase()
      .trim()
      //.transform((username) => `🔥 ${username} 🔥`)
      .refine(checkUsername, "No potatoes allowed!")
      .refine(checkUniqueUsername, "This username is already taken."),
    email: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        "There is an account already registered with that email.",
      ),
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
    confirm_password: z.string().min(10),
  })
  .refine(checkPasswords, {
    message: "Both passwords should be the same!",
    path: ["confirm_password"],
  });

export const createAccount = async (prevState: any, formData: FormData) => {
  const data = {
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirm_password: formData.get("confirm_password"),
  };
  const result = await formSchema.safeParseAsync(data);

  if (!result.success) {
    return result.error.flatten();
  } else {
    // hash password
    // save the user to db using prisma
    // log the user in
    // redirect '/home'
  }
};
