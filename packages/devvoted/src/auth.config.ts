import type { NextAuthConfig } from "next-auth";
import { Provider } from "next-auth/providers";
import Github from "next-auth/providers/github";

const providers: Provider[] = [Github];

// based on: https://authjs.dev/guides/pages/signin
export const providerMap = providers.map((provider) => {
  if (typeof provider === "function") {
    const providerData = provider();
    return { id: providerData.id, name: providerData.name };
  } else {
    return { id: provider.id, name: provider.name };
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
