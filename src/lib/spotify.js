// src/app/api/spotify.js
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

export async function getToken(code) {
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        // Add code_verifier if using PKCE
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Spotify token error: ${errorData.error_description}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Token fetch failed:', error);
    throw error;
  }
}


export async function fetchTopTracks(accessToken) {
    const result = await fetch('https://api.spotify.com/v1/me/top/tracks', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
  
    if (!result.ok) {
      throw new Error('Failed to fetch top tracks');
    }
  
    return await result.json();
  }

  export async function fetchProfile(accessToken) {
    try {
      const result = await fetch("https://api.spotify.com/v1/me", {
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (!result.ok) {
        const errorData = await result.json();
        throw new Error(`Spotify API error: ${errorData.error.message}`);
      }
  
      return await result.json();
    } catch (error) {
      console.error('Profile fetch error:', error.message);
      throw new Error('Failed to fetch profile data');
    }
  }