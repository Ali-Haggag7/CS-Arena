import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";
import slugify from "slugify";

declare module "next-auth" {
  interface Session {
    id: string;
    isOnboarded: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GitHub,
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !user) return false;

      const { name, email, image } = user;

      const id = account.provider === 'github' ? (profile?.id as string) : user.id;

      const username = account.provider === 'github'
        ? (profile as any).login
        : slugify(name || "user", { lower: true, strict: true }) + Math.floor(Math.random() * 1000);

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id,
            name: name ?? username,
            username: username,
            email: email ?? "",
            image: image ?? "",
            bio: (profile as any)?.bio ?? "",
          });
        }

        return true;
      } catch (error) {
        console.error("[auth] signIn error:", error);
        return false;
      }
    },

    async jwt({ token, account, profile, trigger, session }) {
      if (account && profile) {
        const id = account.provider === 'github' ? profile.id : token.sub;

        try {
          const user = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

          token.id = user?._id;
          token.isOnboarded = !!(user?.university && user?.specialization);
        } catch (error) {
          console.error("[auth] jwt error:", error);
        }
      }

      if (trigger === "update" && session?.isOnboarded !== undefined) {
        token.isOnboarded = session.isOnboarded;
      }

      return token;
    },

    async session({ session, token }) {
      Object.assign(session, {
        id: token.id,
        isOnboarded: token.isOnboarded
      });
      return session;
    },
  },
});