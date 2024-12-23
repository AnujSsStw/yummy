import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth, { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import client, { connectToDatabase } from "@/lib/mongodb";
import { cache } from "react";

export const {
  handlers,
  signIn,
  signOut,
  auth: uncachedAuth,
} = NextAuth({
  providers: [Google],
  // adapter: MongoDBAdapter(client),
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET, // Ensure this is defined in your .env file
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!; // Include user ID in session
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        // Optional: Store user information in the database
        const db = await connectToDatabase();
        const existingUser = await db
          .collection("users")
          .findOne({ email: user.email });

        if (!existingUser) {
          await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: new Date(),
          });
          console.info("[Auth] New user added to the database.");
        }

        return true;
      } catch (error) {
        console.error("[Auth] Sign-In Error:", error);
        return false;
      }
    },
  },
});

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export const auth = cache(uncachedAuth);
