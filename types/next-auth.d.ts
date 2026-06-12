import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "DEPORTISTA" | "ENTRENADOR";
    } & DefaultSession["user"];
  }

  interface User {
    role: "DEPORTISTA" | "ENTRENADOR";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "DEPORTISTA" | "ENTRENADOR";
  }
}