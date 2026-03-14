"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/auth";

// Initialize Resend with the API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Server Action to handle upvoting/downvoting a project.
 * Uses Sanity's 'inc' to safely add (+1) or remove (-1) an upvote.
 */
export const toggleUpvoteProject = async (projectId: string, isUpvoting: boolean) => {
  try {
    await writeClient
      .patch(projectId)
      .setIfMissing({ upvotes: 0 })
      .inc({ upvotes: isUpvoting ? 1 : -1 })
      .commit();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle upvote:", error);
    return { success: false, error: "Failed to toggle upvote" };
  }
};

/**
 * Server Action to send a "Join Team" email notification using Resend.
 * Notifies the project owner that a developer is interested in collaborating.
 */
export const sendJoinTeamEmail = async (
  ownerEmail: string,
  projectName: string,
  senderName: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "CS-Arena <onboarding@resend.dev>", // Default testing email for Resend free tier
      to: ownerEmail, // Must be your verified Resend email during testing
      subject: `🚀 New Teammate Request for ${projectName}!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #e50914;">CS-Arena Notification</h2>
          <p>Hello!</p>
          <p>Great news! <strong>${senderName}</strong> has just seen your project <strong>"${projectName}"</strong> on the arena and is very interested in joining your team as an open-source contributor.</p>
          <p>Log in to your dashboard to connect with them and start building something awesome together.</p>
          <br/>
          <p>Best regards,<br/>CS-Arena Team</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
};

// Zod Schema for validation
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description is too short").max(500, "Description is too long"),
  techStack: z.string().min(2, "Please provide at least one technology"),
  image: z.string().url("Please provide a valid image URL"),
  githubLink: z
    .string()
    .url("Please provide a valid URL")
    .regex(/^https:\/\/(www\.)?github\.com\/.+/, "Must be a valid GitHub repository URL"),
  pitch: z.string().min(10, "Project details must be at least 10 characters"),
});

/**
 * Server Action to create a new project in Sanity.
 * Validates data, generates a slug, and associates the project with the logged-in user.
 */
export const createProject = async (formData: FormData, pitch: string) => {
  try {
    const session = await auth();

    if (!session || !session.id) {
      return { success: false, error: "You must be logged in to submit a project." };
    }

    const authorId = session.id;

    // 2. Extract Data
    const data = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      image: formData.get("image") as string,
      githubLink: formData.get("githubLink") as string,
      pitch,
    };

    // 3. Validate Data with Zod
    formSchema.parse(data);

    // 4. Generate Slug and Format Tech Stack
    const slug = slugify(data.title, { lower: true, strict: true });
    // Convert "Next.js, Tailwind" into an array: ["Next.js", "Tailwind"]
    const techStackArray = data.techStack.split(",").map((tech) => tech.trim()).filter(Boolean);

    // 5. Prepare Sanity Document
    const newProject = {
      _type: "project",
      title: data.title,
      slug: { _type: "slug", current: slug },
      description: data.description,
      techStack: techStackArray,
      image: data.image,
      githubLink: data.githubLink,
      pitch,
      views: 0,
      upvotes: 0,
      isLookingForContributors: false,
      author: {
        _type: "reference",
        _ref: authorId,
      },
    };

    // 6. Write to Sanity
    const result = await writeClient.create(newProject);

    return { success: true, projectId: result._id };
  } catch (error: any) {
    console.error("Failed to create project:", error);

    if (error instanceof z.ZodError) {
      const fieldErrors = error.flatten().fieldErrors;

      return {
        success: false,
        error: "Validation failed",
        validationErrors: fieldErrors
      };
    }

    return { success: false, error: "An unexpected error occurred." };
  }
};