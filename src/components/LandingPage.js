'use client';

import React from 'react';
import Navbar from './Navbar';

export default function LandingPage({ user }) {
  return (
    <div>
      <Navbar user={user} />
      <main style={{ padding: '1rem' }}>
        <h1>Welcome to MelodyHub</h1>
        <p>Track your Spotify listening history and connect with friends!</p>
      </main>
      <footer style={{ marginTop: '2rem', textAlign: 'center' }}>
        <p>&copy; {new Date().getFullYear()} MelodyHub. All rights reserved.</p>
      </footer>
    </div>
  );
}
