import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, profile }) {
      if (!profile) return false;

      const { name, email, image } = user;
      const { id, login, bio } = profile as {
        id: string;
        login: string;
        bio?: string;
      };

      try {
        const existingUser = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

        if (!existingUser) {
          await writeClient.create({
            _type: "author",
            id,
            name: name ?? login,
            username: login,
            email: email ?? "",
            image: image ?? "",
            bio: bio ?? "",
          });
        }

        return true;
      } catch (error) {
        console.error("[auth] signIn error:", error);
        return false;
      }
    },

    async jwt({ token, account, profile }) {
      if (account && profile) {
        try {
          const user = await client
            .withConfig({ useCdn: false })
            .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id: profile.id });

          token.id = user?._id;
        } catch (error) {
          console.error("[auth] jwt error:", error);
        }
      }

      return token;
    },

    async session({ session, token }) {
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});