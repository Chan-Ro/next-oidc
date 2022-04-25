import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import styles from "../../styles/Home.module.css";

const Admin = () => {
  const session = useSession();
  console.log(session);
  return (
    <main className={styles.main}>
      <Image
        src="/precedent-logo.svg"
        alt="Precedent Logo"
        height="200"
        width="200"
      />
      <a href="/admin/organisations" className={styles.card}>
        Organisations
      </a>

      <button onClick={() => signOut()}>Sign out</button>
    </main>
  );
};

export default Admin;