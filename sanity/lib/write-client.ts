import "server-only";

import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId, token } from "../env";

if (!token) {
  throw new Error(
    "Missing SANITY_WRITE_TOKEN. Add it to your .env.local file."
  );
}

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Always fresh data for writes
  token,
});