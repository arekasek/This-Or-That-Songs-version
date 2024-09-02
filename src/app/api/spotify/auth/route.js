import { NextResponse } from "next/server";
import querystring from "querystring";

export async function GET() {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;
  const scope = "user-read-private user-read-email";

  const queryParams = querystring.stringify({
    response_type: "code",
    client_id: clientId,
    scope: scope,
    redirect_uri: redirectUri,
  });

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${queryParams}`;

  return NextResponse.redirect(spotifyAuthUrl);
}
