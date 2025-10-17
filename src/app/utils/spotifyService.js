"use client";

export const fetchGenreTracks = async (token, genreQuery, genreArtists) => {
  const currentYear = new Date().getFullYear();

  const decades = [
    { start: 1980, end: 1989 },
    { start: 1990, end: 1999 },
    { start: 2000, end: 2009 },
    { start: 2010, end: 2014 },
    { start: 2015, end: 2019 },
    { start: 2020, end: currentYear },
  ];

  try {
    const artists = genreArtists[genreQuery];
    if (!artists) {
      throw new Error(`No artists found for genre: ${genreQuery}`);
    }

    const tracks = [];
    const seenTrackIds = new Set();

    for (const decade of decades) {
      for (const artist of artists) {
        const searchQuery = encodeURIComponent(`artist:${artist}`);
        const yearRange = `year:${decade.start}-${decade.end}`;

        const response = await fetch(
          `https://api.spotify.com/v1/search?q=${searchQuery} ${yearRange}&type=track&limit=50`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (data.tracks && data.tracks.items) {
          const filteredTracks = data.tracks.items.filter(
            (track) => !seenTrackIds.has(track.id)
          );

          for (const track of filteredTracks) {
            seenTrackIds.add(track.id);
            tracks.push(track);
          }
        }
      }
    }

    return tracks;
  } catch (error) {
    console.error("Error fetching tracks:", error);
    throw error;
  }
};

export const getRandomTracks = (tracks, count = 16) => {
  const shuffled = [...tracks].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

export const fetchUserTopTracks = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=16&time_range=long_term",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching top tracks:", error);
    throw error;
  }
};

export const fetchUserLikedTracks = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/tracks?limit=50",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.items.map((item) => item.track);
  } catch (error) {
    console.error("Error fetching liked tracks:", error);
    throw error;
  }
};

export const fetchUserRecentTracks = async (token) => {
  try {
    const response = await fetch(
      "https://api.spotify.com/v1/me/player/recently-played?limit=50",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    return data.items.map((item) => item.track);
  } catch (error) {
    console.error("Error fetching recent tracks:", error);
    throw error;
  }
};
