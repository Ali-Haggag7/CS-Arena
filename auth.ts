import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
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
      if (!account || !user || !user.email) return false;

      const { name, email, image } = user;

      const providerId = account.provider === 'github' ? String(profile?.id) : String(account.providerAccountId);

      const username = account.provider === 'github'
        ? (profile as any).login
        : slugify(name || "user", { lower: true, strict: true }) + Math.floor(Math.random() * 1000);

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(`*[_type == "author" && email == $email][0]`, { email });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id: providerId,
            name: name ?? username,
            username: username,
            email: email,
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

    async jwt({ token, user, trigger, session }) {
      if (user && user.email) {
        try {
          const sanityUser = await client
            .withConfig({ useCdn: false })
            .fetch(`*[_type == "author" && email == $email][0]`, { email: user.email });

          if (sanityUser) {
            token.id = sanityUser._id;
            token.isOnboarded = !!(sanityUser?.university && sanityUser?.specialization);
          }
        } catch (error) {
          console.error("[auth] jwt error:", error);
        }
      }

      if (trigger === "update" && session) {
        if (session.isOnboarded !== undefined) {
          token.isOnboarded = session.isOnboarded;
        }
        if (session.name) {
          token.name = session.name;
        }
        if (session.image) {
          token.picture = session.image;
        }
      }

      return token;
    },

    async session({ session, token }) {
      Object.assign(session, {
        id: token.id,
        isOnboarded: token.isOnboarded,
      });

      if (token.name && session.user) {
        session.user.name = token.name as string;
      }
      if (token.picture && session.user) {
        session.user.image = token.picture as string;
      }

      return session;
    },
  },
});