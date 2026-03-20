"use client";

import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { handleRequestAction, deleteJoinRequest } from "@/lib/actions";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn/avatar";
import { Check, X, Loader2, Mail, Briefcase, Clock, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ProjectRequests({ requests }: { requests: any[] }) {
    const [localRequests, setLocalRequests] = useState(requests);
    const [rejectModalId, setRejectModalId] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const { toast } = useToast();
    const t = useTranslations("dashboard");
    const router = useRouter();

    if (!localRequests || localRequests.length === 0) {
        return (
            <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-white/10">
                <Mail className="size-10 text-slate-300 dark:text-white/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500 dark:text-white/50">{t("no_requests_yet")}</p>
            </div>
        );
    }

    const handleAction = async (requestId: string, status: "accepted" | "rejected", email: string, name: string, project: string) => {
        const previousRequests = [...localRequests];
        setLocalRequests((prev) => prev.map(req => req._id === requestId ? { ...req, status } : req));
        setRejectModalId(null);
        setRejectReason("");

        const result = await handleRequestAction(requestId, status, email, name, project, rejectReason);

        if (result.success) {
            toast({
                title: t("success"),
                className: "bg-emerald-500 text-white border-none",
            });
            router.refresh();
        } else {
            setLocalRequests(previousRequests);
            toast({
                title: t("error"),
                description: result.error,
                variant: "destructive",
            });
        }
    };

    const handleDelete = async (requestId: string) => {
        const previousRequests = [...localRequests];
        setLocalRequests((prev) => prev.filter(req => req._id !== requestId));

        const result = await deleteJoinRequest(requestId);

        if (!result.success) {
            setLocalRequests(previousRequests);
            toast({
                title: t("error"),
                description: result.error,
                variant: "destructive",
            });
        }
    };

    return (
        <div className="space-y-4">
            {localRequests.map((request) => (
                <div key={request._id} className="p-5 bg-slate-50 dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-2xl transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex gap-4 items-start">
                            <Link href={`/user/${request.applicant?._id}`} className="shrink-0 group">
                                <Avatar className="size-12 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300">
                                    <AvatarImage src={request.applicant?.image} alt={request.applicant?.name} />
                                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                        {request.applicant?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </Link>

                            <div>
                                <Link href={`/user/${request.applicant?._id}`} className="group inline-block">
                                    <h4 className="text-base font-bold text-black dark:text-white group-hover:text-primary transition-colors duration-200">
                                        {request.applicant?.name}
                                    </h4>
                                </Link>

                                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs font-medium text-slate-500 dark:text-white/50">
                                    <span className="flex items-center gap-1.5 bg-white dark:bg-black px-2 py-1 rounded-md border border-slate-200 dark:border-white/10">
                                        <Briefcase className="size-3 text-primary" />
                                        {request.role}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="size-3" />
                                        {new Date(request._createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-600 dark:text-white/70 mt-3 bg-white dark:bg-white/5 p-3 rounded-xl border border-slate-100 dark:border-white/5 italic">
                                    "{request.message}"
                                </p>
                                <p className="text-xs font-bold text-slate-400 dark:text-white/40 mt-3">
                                    {t("applied_to")}
                                    <span className="text-primary"> {request.project?.title}</span>
                                </p>
                            </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 shrink-0">
                            {request.status === "pending" ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => handleAction(request._id, "accepted", request.applicant?.email, request.applicant?.name, request.project?.title)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-colors"
                                    >
                                        <Check className="size-4 shrink-0" />
                                        {t("accept")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setRejectModalId(request._id)}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 text-xs font-bold rounded-xl transition-colors"
                                    >
                                        <X className="size-4 shrink-0" />
                                        {t("reject")}
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-2 sm:flex-col sm:items-stretch w-full">
                                    <span className={`px-4 py-2 text-xs font-bold rounded-xl text-center uppercase tracking-wider flex-1
                                        ${request.status === "accepted" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"}`}>
                                        {t(request.status)}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(request._id)}
                                        className="p-2 flex items-center justify-center bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-500/20 dark:hover:text-red-400 rounded-xl transition-colors"
                                        title={t("delete_request")}
                                    >
                                        <Trash2 className="size-4 shrink-0" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {rejectModalId === request._id && (
                        <div className="mt-4 p-4 bg-white dark:bg-black rounded-xl border border-red-200 dark:border-red-500/20 animate-in fade-in slide-in-from-top-2">
                            <label className="block text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2">
                                {t("reject_reason_label")}
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder={t("reject_reason_placeholder")}
                                rows={2}
                                className="w-full p-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#161618] text-sm focus:ring-2 focus:ring-red-500/50 outline-none resize-none mb-3"
                            />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setRejectModalId(null)} className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-black dark:hover:text-white">
                                    {t("cancel")}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAction(request._id, "rejected", request.applicant?.email, request.applicant?.name, request.project?.title)}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg"
                                >
                                    {t("confirm_reject")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}