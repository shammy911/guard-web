import { pool } from "@/lib/db";
import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        console.log("Credentials received:", credentials);
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        try {
          const normalizedEmail = credentials.email.toLowerCase().trim();
          const res = await pool.query("SELECT * FROM users WHERE email = $1", [
            normalizedEmail,
          ]);

          const user = res.rows[0];

          if (!user) {
            console.log(
              "Authentication failed: User not found or password incorrect",
            );
            return null;
          }

          const valid = await bcrypt.compare(
            credentials.password,
            user.password_hash,
          );
          if (!valid) return null;

          if (!user.is_verified) {
            throw new Error("EMAIL_NOT_VERIFIED");
          }

          return {
            id: String(user.id),
            email: user.email,
            name: user.name,
            isVerified: Boolean(user.is_verified),
          };
        } catch (dbError) {
          if (
            dbError instanceof Error &&
            dbError.message === "EMAIL_NOT_VERIFIED"
          ) {
            throw dbError;
          }
          console.error("Database Connection Error:", dbError);
          return null;
        }
      },
    }),
  ],

  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
        token.email = user.email;
        token.name = user.name;
        token.isVerified = user.isVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isVerified = Boolean(token.isVerified);
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
