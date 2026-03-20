"use server";

import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  projectLink: z
    .string()
    .min(1, "Required")
    .url("Please provide a valid URL"),
  pitch: z
    .string()
    .min(10, "Project details must be at least 10 characters"),
  domainId: z
    .string()
    .min(1, "Please select a tech domain"),
  subDomain: z
    .string()
    .optional(),
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

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

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
              <a
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
      projectLink: formData.get("projectLink") as string,
      domainId: formData.get("domainId") as string,
      subDomain: formData.get("subDomain") as string,
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

    const { title, description, techStack, image, projectLink, domainId, subDomain, projectType, rolesNeeded, collaborationType } = parsed.data;

    const slug = slugify(title, { lower: true, strict: true });

    const techStackArray = techStack.split(",").map((t) => t.trim()).filter(Boolean);

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
      githubLink: projectLink,
      pitch,
      views: 0,
      upvotes: 0,
      domain: { _type: "reference", _ref: domainId },
      subDomain,
      projectType,
      isLookingForContributors,
      rolesNeeded: rolesArray,
      collaborationType: isLookingForContributors ? collaborationType : undefined,
      author: { _type: "reference", _ref: session.id },
    });

    return { success: true, data: { projectId: result._id } };
  } catch (error) {
    console.error("[createProject]", error);
    return { success: false, error: "An unexpected error occurred." };
  }
};


export const updateProject = async (projectId: string, formData: FormData, pitch: string) => {
  const session = await auth();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const existing = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "project" && _id == $id][0]{author}`,
      { id: projectId }
    );

    if (existing?.author?._ref !== session.id) {
      return { success: false, error: "Not authorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const projectType = formData.get("projectType") as string;
    const domainId = formData.get("domainId") as string;
    const subDomain = formData.get("subDomain") as string;
    const techStack = formData.get("techStack") as string;
    const projectLink = formData.get("projectLink") as string;
    const image = formData.get("image") as string;
    const isLookingForContributors = formData.get("isLookingForContributors") === "true";
    const rolesNeeded = formData.get("rolesNeeded") as string;
    const collaborationType = formData.get("collaborationType") as string;

    const techStackArray = techStack ? techStack.split(",").map(t => t.trim()).filter(Boolean) : [];
    const rolesArray = isLookingForContributors && rolesNeeded ? rolesNeeded.split(",").map(r => r.trim()).filter(Boolean) : [];

    await writeClient
      .patch(projectId)
      .set({
        title,
        description,
        projectType,
        domain: { _type: "reference", _ref: domainId },
        subDomain,
        techStack: techStackArray,
        githubLink: projectLink,
        image,
        isLookingForContributors,
        rolesNeeded: rolesArray,
        collaborationType: isLookingForContributors ? collaborationType : null,
        pitch
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false, error: "Failed to update project" };
  }
};

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

export const deleteProject = async (projectId: string) => {
  const session = await auth();
  if (!session) return { success: false, error: "Not authenticated" };

  try {
    const project = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "project" && _id == $id][0]{author}`,
      { id: projectId }
    );

    if (project?.author?._ref !== session.id) {
      return { success: false, error: "Not authorized to delete this project." };
    }

    await writeClient.delete(projectId);
    return { success: true };
  } catch (error) {
    console.error("Error deleting project:", error);
    return { success: false, error: "Failed to delete project" };
  }
};

export const updateUserProfile = async (formData: FormData) => {
  const session = await auth();
  if (!session) return { success: false, error: "Not authenticated" };

  const bio = formData.get("bio") as string;
  const universityId = formData.get("universityId") as string;
  const specializationId = formData.get("specializationId") as string;

  try {
    const updateData: any = { bio };

    if (universityId) {
      updateData.university = { _type: "reference", _ref: universityId };
    }

    if (specializationId) {
      updateData.specialization = { _type: "reference", _ref: specializationId };
    }

    await writeClient
      .patch(session.id)
      .set(updateData)
      .commit();

    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
};

// ─── Create Join Request ───────────────────────────────────────────────────────

export const createJoinRequest = async (
  projectId: string,
  role: string,
  message: string
) => {
  try {
    const session = await auth();

    if (!session?.id) {
      return { success: false, error: "You must be logged in to apply." };
    }

    const existingRequest = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "joinRequest" && project._ref == $projectId && applicant._ref == $userId][0]`,
      { projectId, userId: session.id }
    );

    if (existingRequest) {
      return { success: false, error: "لقد قمت بتقديم طلب لهذا المشروع بالفعل." };
    }

    const projectData = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "project" && _id == $projectId][0]{
        title,
        author->{name, email}
      }`,
      { projectId }
    );

    await writeClient.create({
      _type: "joinRequest",
      project: { _type: "reference", _ref: projectId },
      applicant: { _type: "reference", _ref: session.id },
      role,
      message,
      status: "pending",
    });

    if (projectData?.author?.email) {
      await resend.emails.send({
        from: "CS-Arena <noreply@cs-arena.dev>",
        to: projectData.author.email,
        subject: `New Join Request for "${projectData.title}" 🚀`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #10b981;">New Team Application! 🎉</h2>
            <p>Hello <strong>${projectData.author.name}</strong>,</p>
            <p>Someone just applied to join your project <strong>"${projectData.title}"</strong>.</p>
            
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0;"><strong>Role Requested:</strong> ${role}</p>
              <p style="margin: 0;"><strong>Applicant's Message:</strong></p>
              <blockquote style="margin: 10px 0 0 0; font-style: italic; color: #475569;">"${message}"</blockquote>
            </div>

            <p>Click the button below to review this request in your dashboard:</p>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?tab=requests" 
                style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
              Review Request
            </a>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[createJoinRequest]", error);
    return { success: false, error: "حدث خطأ غير متوقع أثناء إرسال الطلب." };
  }
};