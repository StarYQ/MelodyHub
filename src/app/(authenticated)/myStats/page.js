// src/app/(authenticated)/myStats/page.js
import { getUser } from '@/lib/auth';
import styles from './myStats.module.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'My Stats - MelodyHub',
};
export default async function MyStatsPage() {
  const user = await getUser();

  if (!user) {
    return <div className={styles.container}>Loading...</div>;
  }
  return (
    <div className={styles.container}>
      <Navbar user={user} />
      <h1>My Profile</h1>
      <div className={styles.userInfo}>
        <p><strong>Spotify Name:</strong> {user.name}</p>
        <p><strong></strong></p>
      </div>
    </div>
  );
  }
  