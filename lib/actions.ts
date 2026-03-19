"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/auth";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Zod Schema ───────────────────────────────────────────────────────────────

const formSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title is too long"),
  description: z
    .string()
    .min(10, "Description is too short")
    .max(500, "Description is too long"),
  techStack: z
    .string()
    .min(2, "Please provide at least one technology"),
  image: z
    .string()
    .url("Please provide a valid image URL"),
  githubLink: z
    .string()
    .url("Please provide a valid URL")
    .regex(
      /^https:\/\/(www\.)?github\.com\/.+/,
      "Must be a valid GitHub repository URL"
    ),
  pitch: z
    .string()
    .min(10, "Project details must be at least 10 characters"),
  domainId: z
    .string()
    .min(1, "Please select a tech domain"),
  projectType: z
    .string()
    .min(1, "Please select a project type"),
  isLookingForContributors: z
    .boolean()
    .optional(),
  rolesNeeded: z
    .string()
    .optional(),
  collaborationType: z
    .string()
    .optional(),
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

// ─── Upvote ───────────────────────────────────────────────────────────────────

export const toggleUpvoteProject = async (
  projectId: string,
  isUpvoting: boolean
): Promise<ActionResult> => {
  try {
    const session = await auth();

    if (!session?.id) {
      return { success: false, error: "You must be logged in to vote." };
    }

    await writeClient
      .patch(projectId)
      .setIfMissing({ upvotes: 0 })
      .inc({ upvotes: isUpvoting ? 1 : -1 })
      .commit();

    revalidatePath(`/project/${projectId}`);
    return { success: true };
  } catch (error) {
    console.error("[toggleUpvoteProject]", error);
    return { success: false, error: "Failed to toggle upvote." };
  }
};

// ─── Join Team Email ──────────────────────────────────────────────────────────

export const sendJoinTeamEmail = async (
  ownerEmail: string,
  projectName: string,
  senderName: string
): Promise<ActionResult> => {
  if (!ownerEmail || !projectName || !senderName) {
    return { success: false, error: "Missing required fields." };
  }

  try {
    const { error } = await resend.emails.send({
      from: "CS-Arena <noreply@cs-arena.dev>",
      to: ownerEmail,
      subject: `New Contributor Request — ${projectName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f9; padding: 40px 0;">
            <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 40px; border: 1px solid #eee;">
              <div style="margin-bottom: 24px;">
                <span style="font-size: 24px; font-weight: 800; color: #EE2B69;">CS-Arena</span>
              </div>
              <h2 style="font-size: 20px; color: #111; margin-bottom: 16px;">
                Someone wants to join your team 🚀
              </h2>
              <p style="color: #555; line-height: 1.6;">
                <strong>${senderName}</strong> is interested in contributing to
                <strong>"${projectName}"</strong> as an open-source collaborator.
              </p>
              <p style="color: #555; line-height: 1.6;">
                Log in to CS-Arena to connect with them and start building together.
              </p>
              
                href="https://cs-arena.vercel.app"
                style="display: inline-block; margin-top: 24px; background: #EE2B69; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600;"
              >
                View on CS-Arena
              </a>
              <p style="margin-top: 32px; color: #aaa; font-size: 12px;">
                You received this email because someone found your project on CS-Arena.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("[sendJoinTeamEmail] Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[sendJoinTeamEmail]", error);
    return { success: false, error: "Failed to send email." };
  }
};

// ─── Create Project ───────────────────────────────────────────────────────────

export const createProject = async (
  formData: FormData,
  pitch: string
): Promise<ActionResult<{ projectId: string }>> => {
  try {
    const session = await auth();

    if (!session?.id) {
      return { success: false, error: "You must be logged in to submit a project." };
    }

    const isLookingForContributors = formData.get("isLookingForContributors") === "true";

    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      image: formData.get("image") as string,
      githubLink: formData.get("githubLink") as string,
      domainId: formData.get("domainId") as string,
      projectType: formData.get("projectType") as string,
      isLookingForContributors,
      rolesNeeded: formData.get("rolesNeeded") as string,
      collaborationType: formData.get("collaborationType") as string,
      pitch,
    };

    const parsed = formSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: "Validation failed.",
        validationErrors: parsed.error.flatten().fieldErrors,
      };
    }

    const { title, description, techStack, image, githubLink, domainId, projectType, rolesNeeded, collaborationType } = parsed.data;

    const slug = slugify(title, { lower: true, strict: true });

    const techStackArray = techStack.split(",").map((t) => t.trim()).filter(Boolean);

    // Only set rolesNeeded if the project is looking for contributors
    const rolesArray = isLookingForContributors && rolesNeeded
      ? rolesNeeded.split(",").map((r) => r.trim()).filter(Boolean)
      : [];

    const result = await writeClient.create({
      _type: "project",
      title,
      slug: { _type: "slug", current: slug },
      description,
      techStack: techStackArray,
      image,
      githubLink,
      pitch,
      views: 0,
      upvotes: 0,
      domain: { _type: "reference", _ref: domainId },
      projectType,
      isLookingForContributors,
      rolesNeeded: rolesArray,
      collaborationType: isLookingForContributors ? collaborationType : undefined,
      author: { _type: "reference", _ref: session.id },
    });

    // revalidatePath("/");

    return { success: true, data: { projectId: result._id } };
  } catch (error) {
    console.error("[createProject]", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};

// ─── Complete Onboarding ───────────────────────────────────────────────────────

export async function completeOnboarding(formData: FormData) {
  const session = await auth();

  if (!session?.id) {
    return { success: false, error: "Not authenticated" };
  }

  const universityId = formData.get("universityId") as string;
  const domainId = formData.get("domainId") as string;

  if (!universityId || !domainId) {
    return { success: false, error: "Please select both University and Domain" };
  }

  try {
    await writeClient
      .patch(session.id)
      .set({
        university: { _type: "reference", _ref: universityId },
        specialization: { _type: "reference", _ref: domainId },
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Onboarding error:", error);
    return { success: false, error: "Failed to update profile. Try again." };
  }
}