import { NextResponse } from "next/server";
import axios from "axios";
import querystring from "querystring";

export async function GET(req) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/");
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const tokenUrl = "https://accounts.spotify.com/api/token";
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const params = querystring.stringify({
    code: code,
    redirect_uri: redirectUri,
    grant_type: "authorization_code",
  });

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        Authorization: `Basic ${credentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token } = response.data;

    const redirectTo = `/genre?access_token=${access_token}&refresh_token=${refresh_token}`;
    return NextResponse.redirect(redirectTo);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return new Response("Authentication failed", { status: 500 });
  }
}
