// src/types/next-auth.d.ts
import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      token: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }

  interface User {
    id: string;
    username: string;
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
    token: string;
  }
}
