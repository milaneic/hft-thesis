import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string; // Add your custom fields here
      role: string;
    } & DefaultSession["user"];
    accessToken: string;
  }

  interface User extends DefaultUser {
    id: string;
    firstName: string; // Add custom fields to User
    role: string;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    firstName: string; // Add your custom fields here
    role: string;
    accessToken: string;
  }
}
