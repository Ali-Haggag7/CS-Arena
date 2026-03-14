import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { AUTHOR_BY_GITHUB_ID_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";
import { writeClient } from "@/sanity/lib/write-client";

/**
 * Authentication Configuration Hub
 * Integrates NextAuth.js with GitHub OAuth and Sanity CMS.
 * Handles automatic user provisioning, JWT enrichment, and session management.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [GitHub],
  callbacks: {
    /**
     * SignIn Callback: Triggered upon successful OAuth authentication.
     * Validates if the GitHub user exists in our Sanity database.
     * If not, it automatically provisions a new author document.
     */
    async signIn({ user, profile }) {
      // Ensure profile exists to avoid runtime errors
      if (!profile) return false;

      const { name, email, image } = user;
      const { id, login, bio } = profile;

      // Check if the user already exists in Sanity by GitHub ID
      const existingUser = await client
        .withConfig({ useCdn: false }) // Disable CDN to get real-time data
        .fetch(AUTHOR_BY_GITHUB_ID_QUERY, { id });

      // Provision a new user document if they are logging in for the first time
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id,
          name,
          username: login,
          email,
          image,
          bio: bio || "",
        });
      }

      // Allow the sign-in process to complete
      return true;
    },

    /**
     * JWT Callback: Triggered when a JSON Web Token is created or updated.
     * We intercept this to inject our internal Sanity Document ID (_id) into the token.
     */
    async jwt({ token, account, profile }) {
      // Only fetch from Sanity on the initial sign-in (when account & profile are provided)
      if (account && profile) {
        const user = await client
          .withConfig({ useCdn: false })
          .fetch(AUTHOR_BY_GITHUB_ID_QUERY, {
            id: profile?.id,
          });

        // Attach the internal Sanity user ID to the token for future server requests
        token.id = user?._id;
      }

      return token;
    },

    /**
     * Session Callback: Exposes specific token data to the client-side session.
     * Passes the internal Sanity ID from the JWT token to the active session object.
     */
    async session({ session, token }) {
      // Merge the custom user ID into the session object for global access
      Object.assign(session, { id: token.id });
      return session;
    },
  },
});