// src/app/(authenticated)/myProfile/page.js
import { getUser } from '@/lib/auth';
import styles from './myProfile.module.css';
import Navbar from '@/components/Navbar';
import { getToken } from '@/lib/spotify'
import { fetchProfile } from '@/lib/spotify'

export const metadata = {
  title: 'My Profile - MelodyHub',
};

export default async function MyProfile() {
  const user = await getUser();
  const profile = await fetchProfile(getToken());

  if (!user || !profile) {
    return <div className={styles.container}>Loading...</div>;
  }



  return (
    <div className={styles.container}>
      <Navbar user={user} />
      <h1>My Profile</h1>
      <div className={styles.userInfo}>
        <section>
          <h2>Logged in as <span>{profile.display_name}</span></h2>
          {profile.images?.[0] && (
            <img 
              src={profile.images[0].url} 
              width={200}
              height={200}
              alt="Profile"
              className={styles.avatar}
            />
          )}
          <ul>
            <li>User ID: <span>{profile.id}</span></li>
            <li>Email: <span>{profile.email}</span></li>
            {/* <li>Spotify URI: <a href={profile.external_urls.spotify}>{profile.uri}</a></li> */}
            <li>Link: <a href={profile.href}>{profile.href}</a></li>
            {profile.images?.[0] && (
              <li>Profile Image: <span>{profile.images[0].url}</span></li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}