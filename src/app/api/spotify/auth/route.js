import querystring from "querystring";

export async function GET(req) {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri =
    "https://this-or-that-songs-version-git-main-arekaseks-projects.vercel.app/callback";
  const scope = "user-library-read  user-read-private user-read-email";

  const url =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id,
      scope,
      redirect_uri,
    });

  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
}
