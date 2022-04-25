import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Login() {
  const { data: session } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/admin");
    }
    else {
      signIn("onelogin")
    }
  }, [router, session]);

  return (
    <>
      Loading...
    </>
  );
}