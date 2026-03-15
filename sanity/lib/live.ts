import "server-only";

import { defineLive } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { token } from "@/sanity/env";

export const { sanityFetch, SanityLive } = defineLive({
    client,
    serverToken: token,
    browserToken: token,
});