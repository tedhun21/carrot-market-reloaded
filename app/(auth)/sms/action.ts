"use server";

import { redirect } from "next/navigation";

import { z } from "zod";
import validator from "validator";
import crypto from "crypto";
import twilio from "twilio";

import db from "@/lib/db";
import { LoginSession } from "../github/utils";
import getSession from "@/lib/session";

const phoneSchema = z
  .string()
  .trim()
  .refine((phone) => validator.isMobilePhone(phone, "ko-KR"), {
    message: "Wrong phone format",
  });

async function tokenExists(token: number) {
  const exists = await db.sMSToken.findUnique({
    where: {
      token: token.toString(),
    },
    select: { id: true },
  });
  return Boolean(exists);
}

const tokenSchema = z.coerce
  .number()
  .min(100000)
  .max(999999)
  .refine(tokenExists, "This token does not exist.");

interface ActionState {
  token: boolean;
}

async function getToken() {
  const token = crypto.randomInt(100000, 999999).toString();
  const exists = await db.sMSToken.findUnique({
    where: { token },
    select: {
      id: true,
    },
  });
  if (exists) {
    return getToken();
  } else {
    return token;
  }
}

export async function smsLogIn(prevState: ActionState, formData: FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");

  // 이전 입력한 token이 없을 때
  if (!prevState.token) {
    const result = phoneSchema.safeParse(phone);

    // validation 실패
    if (!result.success) {
      return { token: false, error: result.error.flatten() };
      // validation 성공
    } else {
      // delete previous token
      await db.sMSToken.deleteMany({
        where: {
          user: {
            phone: result.data,
          },
        },
      });
      // create token
      const token = await getToken();
      await db.sMSToken.create({
        data: {
          token,
          user: {
            connectOrCreate: {
              where: { phone: result.data },
              create: {
                username: crypto.randomBytes(10).toString("hex"),
                phone: result.data,
              },
            },
          },
        },
      });
      // send the token using sms
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );
      await client.messages.create({
        body: `Your Karrot verfication code is: ${token}`,
        from: process.env.TWILIO_PHONE_NUMBER!,
        // 원래 이걸 받은 전화번호를 써야하지만 체험판은 정해진 자기 번호만 가능하다
        // to: result.data
        to: process.env.MY_PHONE_NUMBER!,
      });

      return { token: true };
    }
    // 이전 입력한 token이 있을 때 (제출된 토큰이 있으면 유저 찾기)
  } else {
    const result = await tokenSchema.spa(token);
    // validation 실패
    if (!result.success) {
      return { token: true, error: result.error.flatten() };
      // validation 성공
    } else {
      // get the userId of token
      const token = await db.sMSToken.findUnique({
        where: { token: result.data.toString() },
        select: { id: true, userId: true },
      });

      await db.sMSToken.delete({ where: { id: token!.id } });
      // log the user in
      return LoginSession(token!.userId);
    }
  }
}
