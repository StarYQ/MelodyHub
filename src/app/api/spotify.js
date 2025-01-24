// src/app/api/spotify.js
async function fetchTopTracks(accessToken) {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  
    if (!result.ok) {
      throw new Error('Failed to fetch top tracks');
    }
  
    return await result.json();
  }

async function fetchProfile(accesToken) {
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (!result.ok) {
        throw new Error('Failed to fetch profile');
      }

    return await result.json();
}