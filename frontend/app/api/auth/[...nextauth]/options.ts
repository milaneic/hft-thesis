import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
          {
            method: "POST",
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" },
          }
        );

        const data = await res.json();
        // If no error and we have user data, return it
        if (res.ok && data?.user) {
          return {
            id: data.user._id,
            email: data.user.email,
            firstName: data.user.firstName,
            role: data.user.role,
            accessToken: data.backendTokens.accessToken,
          };
        }

        // Return null if user data could not be retrieved
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user?.firstName;
        token.role = user?.role;
        token.accessToken = user?.accessToken;
      }

      // Always return the token object
      return token;
    },

    async session({ session, token }) {
      // Ensure the session object contains all the necessary data
      session.user.id = token.id;
      session.user.firstName = token.firstName;
      session.user.role = token.role;
      session.accessToken = token.accessToken; // Add accessToken to session
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
