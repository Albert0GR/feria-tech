// src/pages/api/auth/[...nextauth].ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { supabase } from "../../../supabaseClient";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // (Opcional) Inserta o actualiza el usuario en la tabla "users" en Supabase
      const { error } = await supabase
        .from("users")
        .upsert({ email: user.email, name: user.name });
      if (error) {
        console.error("Error en signIn:", error);
        return false;
      }
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
});
