import SearchForm from "@/components/shared/SearchForm";
import TechFilters from "@/components/shared/TechFilters";
import ProjectCard, { ProjectTypeCard } from "@/components/project/ProjectCard";
import { PROJECTS_QUERY } from "@/sanity/lib/queries";
import { sanityFetch, SanityLive } from "@/sanity/lib/live";

/**
 * Main Landing Page for CS-Arena.
 * Implements Server Components and Sanity Live API for real-time updates.
 */
export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  // Extract the search query from the URL parameters (e.g., ?query=react)
  const query = (await searchParams).query;
  const params = { search: query || null };

  // Fetch projects from Sanity using the live fetcher for real-time UI updates
  const { data: posts } = await sanityFetch({ query: PROJECTS_QUERY, params });

  return (
    <>
      {/* Hero Section */}
      <section className="pink_container">
        <h1 className="heading">
          Showcase Your Code, <br />
          Dominate The Arena
        </h1>

        <p className="sub-heading !max-w-3xl">
          Submit your CS graduation projects, find open-source contributors,
          and get headhunted by top tech recruiters.
        </p>

        {/* The Search Form Component */}
        <SearchForm query={query} />

        {/* Tech Filters for quick-click filtering */}
        <TechFilters />
      </section>

      {/* Projects Grid Section */}
      <section className="section_container">
        <p className="text-30-semibold">
          {query ? `Search results for "${query}"` : "Explore Top Projects"}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((post: ProjectTypeCard) => (
              <ProjectCard key={post?._id} post={post} />
            ))
          ) : (
            <p className="no-results">No projects found in the arena yet.</p>
          )}
        </ul>
      </section>

      {/* Enables real-time content updates without refreshing the page */}
      {/* <SanityLive /> */}
    </>
  );
}