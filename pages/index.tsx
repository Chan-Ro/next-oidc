import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/admin");
    } else {
      router.push("/login");
    }
  }, [session, router]);

  return <div>Loading...</div>;
};

export default Home;
