import getSession from "@/lib/session";
import { redirect } from "next/navigation";

export async function LoginSession(user: any) {
  const session = await getSession();
  session.id = user.id;
  await session.save();
  return redirect("/profile");
}

export async function getAccessToken(code: string) {
  const accessTokenParams = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID!,
    client_secret: process.env.GITHUB_CLIENT_SECRET!,
    code,
  }).toString();
  const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
  const accessTokenResponse = await fetch(accessTokenURL, {
    method: "POST",
    headers: {
      Accept: "application/json",
    },
  });

  return await accessTokenResponse.json();
}

export async function getGithubProfile(access_token: string) {
  const userProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-cache",
  });
  const userEmailResponse = await fetch("https://api.github.com/user/emails", {
    headers: { Authorization: `Bearer ${access_token}` },
    cache: "no-cache",
  });
  const { id, avatar_url, login } = await userProfileResponse.json();
  const data = await userEmailResponse.json();
  return {
    github_id: id + "",
    avatar: avatar_url,
    username: login,
    email: data[0].email,
  };
}
