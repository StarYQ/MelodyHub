// src/app/page.js
import React from 'react';
import LandingPage from '../components/LandingPage';
import { getUser } from '../lib/auth';

export const metadata = {
  title: 'MelodyHub - Home',
};

export default async function HomePage() {
  const user = await getUser();
  return <LandingPage user={user} />;
}
