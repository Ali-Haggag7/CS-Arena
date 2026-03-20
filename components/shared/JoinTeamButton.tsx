"use client";

import React, { useState } from "react";
import { Send, X, Briefcase, MessageSquare, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";
import { createJoinRequest } from "@/lib/actions";
import { useTranslations } from "next-intl";

interface JoinTeamButtonProps {
    projectId: string;
    projectName: string;
    rolesNeeded?: string[];
    hasApplied?: boolean;
    isOwner?: boolean;
}

const JoinTeamButton = ({ projectId, projectName, rolesNeeded, hasApplied = false, isOwner = false }: JoinTeamButtonProps) => {
    const t = useTranslations("join_team");

    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isOptimisticallyApplied, setIsOptimisticallyApplied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const safeRoles = rolesNeeded || [];
    const [selectedRole, setSelectedRole] = useState(safeRoles[0] || "Contributor");
    const [message, setMessage] = useState("");

    const actuallyApplied = hasApplied || isOptimisticallyApplied;

    if (isOwner) {
        return (
            <button
                type="button"
                disabled
                className="w-full px-6 py-2.5 bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed select-none"
            >
                <ShieldAlert className="size-4" />
                <span>أنت صاحب المشروع</span>
            </button>
        );
    }

    if (actuallyApplied) {
        return (
            <button
                type="button"
                disabled
                className="w-full px-6 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-not-allowed select-none"
            >
                <CheckCircle2 className="size-4" />
                <span>تم التقديم مسبقاً</span>
            </button>
        );
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (message.length < 10) {
            setError(t("error_length"));
            return;
        }

        setIsLoading(true);
        setError(null);

        const result = await createJoinRequest(projectId, selectedRole, message);

        if (result.success) {
            setIsOptimisticallyApplied(true);
            setIsOpen(false);
        } else {
            setError(result.error || "Failed to submit request.");
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget && !isLoading) {
            setIsOpen(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="w-full px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 group"
            >
                <Send className="size-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform rtl:group-hover:-translate-x-0.5" />
                <span>{t("button_text")}</span>
            </button>

            {isOpen && (
                <div
                    onMouseDown={handleBackdropClick}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                >
                    <div className="bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200">

                        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                            <div>
                                <h3 className="text-lg font-black text-black dark:text-white">{t("modal_title")}</h3>
                                <p className="text-xs text-slate-500 dark:text-white/50 mt-1 truncate max-w-[250px]">
                                    {t("project")} {projectName}
                                </p>
                            </div>
                            <button
                                type="button"
                                aria-label="Close"
                                onClick={() => !isLoading && setIsOpen(false)}
                                className="p-2 bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/20 rounded-full text-slate-600 dark:text-white/70 transition-colors"
                            >
                                <X className="size-4" />
                            </button>
                        </div>

                        <div className="p-5 sm:p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {safeRoles.length > 0 ? (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-white/80">
                                            <Briefcase className="size-4 text-emerald-500" />
                                            {t("role_required")}
                                        </label>
                                        <select
                                            title={t("role_required")}
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111115] text-black dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all shadow-sm"
                                        >
                                            {safeRoles.map((role) => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-white/80">
                                            <Briefcase className="size-4 text-emerald-500" />
                                            {t("role_suggested")}
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            placeholder={t("role_placeholder")}
                                            required
                                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111115] text-black dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-sm"
                                        />
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-white/80">
                                        <MessageSquare className="size-4 text-emerald-500" />
                                        {t("pitch")}
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder={t("pitch_placeholder")}
                                        required
                                        rows={4}
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111115] text-black dark:text-white text-sm focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-white/20 shadow-sm"
                                    />
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                                        {error}
                                    </div>
                                )}

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? (
                                            <><Loader2 className="size-4 animate-spin" /> {t("sending")}</>
                                        ) : (
                                            <><Send className="size-4" /> {t("send_request")}</>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default JoinTeamButton;