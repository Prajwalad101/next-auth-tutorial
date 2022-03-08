import AuthForm from "../components/auth/auth-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

function AuthPage() {
  const router = useRouter();

  const { data: session, state } = useSession();

  if (state === "loading") {
    return <p>Loading...</p>;
  }

  if (session) {
    router.replace("/");
  }

  return <AuthForm />;
}

export default AuthPage;
