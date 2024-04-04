import db from "@/lib/db";
import { notFound } from "next/navigation";
import { NextRequest } from "next/server";
import { LoginSession, getAccessToken, getGithubProfile } from "../utils";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return notFound();
  }
  // 받은 code로 github 토큰 발급
  const { error, access_token } = await getAccessToken(code);

  if (error) {
    return new Response(null, {
      status: 400,
    });
  }

  // 받은 코드로 github 사용자 정보 가져오기
  const { github_id, avatar, username, email } =
    await getGithubProfile(access_token);

  const existGithubUser = await db.user.findUnique({
    where: {
      github_id,
    },
    select: {
      id: true,
    },
  });
  // 같은 github_id를 가지고 있다면 -> 바로 로그인
  if (existGithubUser) {
    return LoginSession(existGithubUser);
  }
  const existUsernameUser = await db.user.findUnique({
    where: {
      username,
    },
    select: { id: true },
  });
  // 같은 username이 있다면 -> username에 `-gh`를 붙여서 생성
  if (existUsernameUser) {
    const newUser = await db.user.create({
      data: {
        username: `${username}-gh`,
        github_id,
        avatar,
        email,
      },
      select: { id: true },
    });
    return LoginSession(newUser);
  }
  // 아무것도 안걸리면 그냥 만들기
  const newUser = await db.user.create({
    data: {
      username,
      github_id,
      avatar,
      email,
    },
    select: {
      id: true,
    },
  });
  return LoginSession(newUser);
}
