import type { NextAuthConfig } from "next-auth";
import { Provider, ProviderType } from "next-auth/providers";
import Github from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";

const providers: Provider[] = [];
if (process.env.AUTH_GITHUB_ID) {
  providers.push(Github);
}
if (process.env.AUTH_RESEND_KEY) {
  /**
   * Disabled for now, until https://github.com/nextauthjs/next-auth/issues/10632 is resolved.
   */
  // providers.push(
  //   Resend({
  //     from: "no-reply@pollapp.echtmaatwerk.nl",
  //   })
  // );
}
// based on: https://authjs.dev/guides/pages/signin
export const providerMap = providers.map<{
  id: string;
  name: string;
  type: ProviderType;
}>((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return {
      id: providerData.id,
      name: providerData.name,
      type: providerData.type,
    };
  } else {
    return { id: provider.id, name: provider.name, type: provider.type };
  }
});

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnPolls = nextUrl.pathname.startsWith("/polls");
      if (isOnPolls) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
    async signIn({ account, profile }) {
      return true;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers,
} satisfies NextAuthConfig;
