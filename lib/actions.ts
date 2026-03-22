"use server";
import "server-only"; // ← ضيف السطر ده
import * as Sentry from "@sentry/nextjs";
import { writeClient } from "@/sanity/lib/write-client";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import slugify from "slugify";
import { z } from "zod";
import { auth } from "@/auth";
import { client } from "@/sanity/lib/client";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";

const resend = new Resend(process.env.RESEND_API_KEY);

type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; validationErrors?: Record<string, string[]> };

// ─── Project ──────────────────────────────────────────────────────────────────

export const createProject = async (
  formData: FormData,
  pitch: string
): Promise<ActionResult<{ projectId: string }>> => {
  try {
    const session = await auth();

    if (!session?.id) {
      return { success: false, error: "You must be logged in to submit a project." };
    }

    const t = await getTranslations("validation");

    const formSchema = z.object({
      title: z.string().min(3, t("min_title")).max(100, t("max_title")),
      description: z.string().min(10, t("min_desc")).max(500, t("max_desc")),
      techStack: z.string().min(2, t("required_tech")),
      image: z.string().url(t("invalid_image")),
      projectLink: z.string().min(1, t("required_link")).url(t("invalid_link")),
      pitch: z.string().min(10, t("min_pitch")),
      domainId: z.string().min(1, t("required_domain")),
      subDomain: z.string().optional(),
      projectType: z.string().min(1, t("required_type")),
      isLookingForContributors: z.boolean().optional(),
      rolesNeeded: z.string().optional(),
      collaborationType: z.string().optional(),
    });

    const isLookingForContributors = formData.get("isLookingForContributors") === "true";

    const raw = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      techStack: formData.get("techStack") as string,
      image: formData.get("image") as string,
      projectLink: formData.get("projectLink") as string,
      domainId: formData.get("domainId") as string,
      subDomain: formData.get("subDomain") as string,
      projectType: (formData.get("projectType") ?? "") as string,
      rolesNeeded: formData.get("rolesNeeded") as string,
      collaborationType: formData.get("collaborationType") as string,
      isLookingForContributors,
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

    const {
      title, description, techStack, image, projectLink,
      domainId, subDomain, projectType, rolesNeeded, collaborationType,
    } = parsed.data;

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

export const updateProject = async (
  projectId: string,
  formData: FormData,
  pitch: string
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    const existing = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "project" && _id == $id][0]{author}`,
      { id: projectId }
    );

    if (existing?.author?._ref !== session.id) {
      return { success: false, error: "Not authorized" };
    }

    const isLookingForContributors = formData.get("isLookingForContributors") === "true";
    const techStack = formData.get("techStack") as string;
    const rolesNeeded = formData.get("rolesNeeded") as string;

    const techStackArray = techStack
      ? techStack.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const rolesArray = isLookingForContributors && rolesNeeded
      ? rolesNeeded.split(",").map((r) => r.trim()).filter(Boolean)
      : [];

    await writeClient
      .patch(projectId)
      .set({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        projectType: formData.get("projectType") as string,
        domain: { _type: "reference", _ref: formData.get("domainId") as string },
        subDomain: formData.get("subDomain") as string,
        techStack: techStackArray,
        githubLink: formData.get("projectLink") as string,
        image: formData.get("image") as string,
        isLookingForContributors,
        rolesNeeded: rolesArray,
        collaborationType: isLookingForContributors
          ? (formData.get("collaborationType") as string)
          : null,
        pitch,
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("[updateProject]", error);
    return { success: false, error: "Failed to update project" };
  }
};

export const deleteProject = async (projectId: string): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

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
    console.error("[deleteProject]", error);
    return { success: false, error: "Failed to delete project" };
  }
};

export const toggleUpvoteProject = async (
  projectId: string,
  isUpvoting: boolean
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "You must be logged in to vote." };

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

export const incrementProjectView = async (id: string): Promise<ActionResult> => {
  const cookieStore = await cookies();
  const cookieName = `viewed_project_${id}`;

  if (cookieStore.has(cookieName)) {
    return { success: false, error: "Already viewed recently" };
  }

  try {
    await writeClient
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    cookieStore.set(cookieName, "true", {
      maxAge: 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    return { success: true };
  } catch (error) {
    console.error("[incrementProjectView]", error);
    return { success: false, error: "Failed to increment views." };
  }
};

// ─── Join Requests ────────────────────────────────────────────────────────────

export const createJoinRequest = async (
  projectId: string,
  role: string,
  message: string
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "You must be logged in to apply." };

    const existingRequest = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "joinRequest" && project._ref == $projectId && applicant._ref == $userId][0]`,
      { projectId, userId: session.id }
    );

    if (existingRequest) {
      return { success: false, error: "You have already applied to this project." };
    }

    const projectData = await client.withConfig({ useCdn: false }).fetch(
      `*[_type == "project" && _id == $projectId][0]{ title, author->{ name, email } }`,
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
        from: "onboarding@resend.dev",
        to: projectData.author.email,
        subject: `New Join Request for "${projectData.title}" 🚀`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px;">
            <h2 style="color:#10b981;">New Team Application! 🎉</h2>
            <p>Hello <strong>${projectData.author.name}</strong>,</p>
            <p>Someone just applied to join your project <strong>"${projectData.title}"</strong>.</p>
            <div style="background:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;">
              <p style="margin:0 0 10px 0;"><strong>Role Requested:</strong> ${role}</p>
              <p style="margin:0;"><strong>Applicant's Message:</strong></p>
              <blockquote style="margin:10px 0 0 0;font-style:italic;color:#475569;">"${message}"</blockquote>
            </div>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/dashboard?tab=requests"
                style="display:inline-block;padding:12px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:10px;">
              Review Request
            </a>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("[createJoinRequest]", error);
    return { success: false, error: "An unexpected error occurred while submitting the request." };
  }
};

export const handleRequestAction = async (
  requestId: string,
  status: "accepted" | "rejected",
  applicantEmail: string,
  applicantName: string,
  projectName: string,
  rejectReason?: string
): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    await writeClient.patch(requestId).set({ status }).commit();

    if (status === "accepted") {
      const requestData = await writeClient.getDocument(requestId);
      if (requestData?.applicant?._ref && requestData?.project?._ref) {
        await writeClient
          .patch(requestData.project._ref)
          .setIfMissing({ contributors: [] })
          .append("contributors", [{
            _type: "reference",
            _ref: requestData.applicant._ref,
            _key: requestData.applicant._ref,
          }])
          .commit();
      }
    }

    const isAccepted = status === "accepted";
    const emailSubject = isAccepted
      ? `🎉 You're in! Welcome to ${projectName}`
      : `Update regarding your application for ${projectName}`;

    const emailHtml = isAccepted
      ? `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#10b981;">Application Accepted! 🚀</h2>
          <p>Hello <strong>${applicantName}</strong>,</p>
          <p>Great news! The owner of <strong>"${projectName}"</strong> has accepted your request to join the team.</p>
          <p>Login to CS-Arena to connect with the team and start building.</p>
          <a href="${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/dashboard"
              style="display:inline-block;padding:12px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin-top:10px;">
            Go to Dashboard
          </a>
        </div>
      `
      : `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px;border:1px solid #eee;border-radius:10px;">
          <h2 style="color:#64748b;">Application Update</h2>
          <p>Hello <strong>${applicantName}</strong>,</p>
          <p>Thank you for your interest in joining <strong>"${projectName}"</strong>.</p>
          <p>Unfortunately, the project owner has decided not to proceed with your application at this time.</p>
          ${rejectReason ? `
            <div style="background:#f8fafc;padding:15px;border-radius:8px;margin:20px 0;">
              <p style="margin:0;"><strong>Message from the owner:</strong></p>
              <blockquote style="margin:10px 0 0 0;font-style:italic;color:#475569;">"${rejectReason}"</blockquote>
            </div>
          ` : ""}
          <p>Keep exploring and applying to other amazing projects on CS-Arena!</p>
        </div>
      `;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: applicantEmail,
      subject: emailSubject,
      html: emailHtml,
    });

    return { success: true };
  } catch (error) {
    console.error("[handleRequestAction]", error);
    return { success: false, error: "Failed to process request" };
  }
};

export const deleteJoinRequest = async (requestId: string): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    await writeClient.delete(requestId);
    return { success: true };
  } catch (error) {
    console.error("[deleteJoinRequest]", error);
    return { success: false, error: "Failed to delete request" };
  }
};

// ─── User ─────────────────────────────────────────────────────────────────────

export const completeOnboarding = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    const universityId = formData.get("universityId") as string;
    const domainId = formData.get("domainId") as string;

    if (!universityId || !domainId) {
      return { success: false, error: "Please select both University and Domain" };
    }

    await writeClient
      .patch(session.id)
      .set({
        university: { _type: "reference", _ref: universityId },
        specialization: { _type: "reference", _ref: domainId },
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("[completeOnboarding]", error);
    return { success: false, error: "Failed to update profile. Try again." };
  }
};

export const updateUserProfile = async (formData: FormData): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    const universityId = formData.get("universityId") as string;
    const specializationId = formData.get("specializationId") as string;

    await writeClient
      .patch(session.id)
      .set({
        bio: formData.get("bio") as string,
        name: formData.get("name") as string,
        image: formData.get("image") as string,
        university: universityId ? { _type: "reference", _ref: universityId } : undefined,
        specialization: specializationId ? { _type: "reference", _ref: specializationId } : undefined,
      })
      .commit();

    return { success: true };
  } catch (error) {
    console.error("[updateUserProfile]", error);
    return { success: false, error: "Failed to update profile." };
  }
};

export const deleteAccount = async (): Promise<ActionResult> => {
  try {
    const session = await auth();
    if (!session?.id) return { success: false, error: "Not authenticated" };

    await writeClient.delete(session.id);
    return { success: true };
  } catch (error) {
    console.error("[deleteAccount]", error);
    return { success: false, error: "Failed to delete account." };
  }
};

// ─── Email ────────────────────────────────────────────────────────────────────

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
      from: "onboarding@resend.dev",
      to: ownerEmail,
      subject: `New Contributor Request — ${projectName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9f9f9;padding:40px 0;">
            <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;border:1px solid #eee;">
              <div style="margin-bottom:24px;">
                <span style="font-size:24px;font-weight:800;color:#EE2B69;">CS-Arena</span>
              </div>
              <h2 style="font-size:20px;color:#111;margin-bottom:16px;">Someone wants to join your team 🚀</h2>
              <p style="color:#555;line-height:1.6;">
                <strong>${senderName}</strong> is interested in contributing to
                <strong>"${projectName}"</strong> as an open-source collaborator.
              </p>
              <p style="color:#555;line-height:1.6;">
                Log in to CS-Arena to connect with them and start building together.
              </p>
              <a href="https://cs-arena.vercel.app"
                  style="display:inline-block;margin-top:24px;background:#EE2B69;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;">
                View on CS-Arena
              </a>
              <p style="margin-top:32px;color:#aaa;font-size:12px;">
                You received this email because someone found your project on CS-Arena.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("[sendJoinTeamEmail]", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("[sendJoinTeamEmail]", error);
    return { success: false, error: "Failed to send email." };
  }
};