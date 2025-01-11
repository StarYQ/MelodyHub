'use client';

import React from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import supabase from '../lib/supabase';

export default function Navbar({ user }) {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.navLogo}>MelodyHub</Link>
      <div className={styles.navLinks}>
        {user ? (
          <>
            <Link href="/myProfile">My Profile</Link>
            <Link href="/myStats">My Stats</Link>
            <Link href="/friends">Friends</Link>
            <Link href="/groups">Groups</Link>
            <button
              className={styles.logoutButton}
              onClick={async () => {
                // TODO: create an /api/logout route
                // for now, client-based signOut:
                const { error } = await supabase.auth.signOut();
                if (error) {
                  console.error('Logout error:', error);
                }
                window.location.href = '/';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
