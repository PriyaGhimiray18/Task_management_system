// src/types/next-auth.d.ts or types/next-auth.d.ts (create if it doesn't exist)
import NextAuth from "next-auth";
import { User as NextAuthUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
    };
  }

  interface User extends NextAuthUser {
    id: string;
  }
}
