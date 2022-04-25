import NextAuth, { User } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import OneLoginProvider from "next-auth/providers/onelogin";
import { AppConfigs } from "../../../config/AppConfigs";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    // GitHubProvider({
    //   clientId: AppConfigs.GITHUB_CLIENT_ID,
    //   clientSecret: AppConfigs.GITHUB_CLIENT_SECRET,
    // }),
    OneLoginProvider({
      clientId: AppConfigs.ONELOGIN_CLIENT_ID,
      clientSecret: AppConfigs.ONELOGIN_CLIENT_SECRET,
      issuer: AppConfigs.ONELOGIN_ISSUER,
    }),
    // ...add more providers here
  ],
  secret: AppConfigs.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      const isAllowedToSignIn = isUserAllowedToSignIn(user);
      if (isAllowedToSignIn) {
        return true;
      } else {
        // Return false to display a default error message
        return false;
        // Or you can return a URL to redirect to:
        // return '/unauthorized'
      }
    },
  },
});

const isUserAllowedToSignIn = (user: User) => {
  return (
    user?.email?.endsWith("@onit.com") ||
    user?.email?.endsWith("@mccarthyfinch.com")
  );
};
