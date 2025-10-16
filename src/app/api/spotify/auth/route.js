import querystring from "querystring";

export async function GET() {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const redirect_uri = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI;

  const scope = [
    "user-read-private",
    "user-read-email",
    "user-library-read",
    "user-read-recently-played",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-top-read",
  ].join(" ");

  const url =
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "token",
      client_id,
      scope,
      redirect_uri,
      show_dialog: true,
    });

  return new Response(null, {
    status: 302,
    headers: { Location: url },
  });
}
