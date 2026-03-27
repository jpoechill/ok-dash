import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const googleConfigured =
  Boolean(process.env.AUTH_GOOGLE_ID?.length) && Boolean(process.env.AUTH_GOOGLE_SECRET?.length);

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Required for JWT/session cookies. Set AUTH_SECRET in .env.local (see .env.example).
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  providers: [
    ...(googleConfigured
      ? [
          Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
          }),
        ]
      : []),
  ],
  trustHost: true,
  callbacks: {
    session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
