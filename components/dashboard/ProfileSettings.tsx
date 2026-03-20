"use client";

import React, { useState, useRef, useEffect } from "react";
import { updateUserProfile, deleteAccount } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, UserCircle, GraduationCap, Layers, ChevronDown, Check, User, Link as LinkIcon, AlertTriangle, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const CustomDropdown = ({
    name,
    options,
    defaultValue,
    placeholder,
}: {
    name: string;
    options: { _id: string; name: string }[];
    defaultValue: string;
    placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(defaultValue);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt._id === selectedId);

    return (
        <div className="relative" ref={dropdownRef}>
            <input type="hidden" name={name} value={selectedId} />
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-[15px] font-medium transition-all duration-300
                ${isOpen ? "border-primary ring-1 ring-primary bg-white dark:bg-[#111115]" : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111115] hover:border-slate-300 dark:hover:border-white/20"}
                ${selectedOption ? "text-black dark:text-white" : "text-slate-400 dark:text-white/40"}`}
            >
                <span className="truncate pr-2">{selectedOption ? selectedOption.name : placeholder}</span>
                <ChevronDown className={`size-4 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#161618] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                        <li
                            onClick={() => { setSelectedId(""); setIsOpen(false); }}
                            className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${!selectedId ? "bg-primary/10 text-primary font-bold" : "text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                        >
                            <span>{placeholder}</span>
                            {!selectedId && <Check className="size-4 shrink-0" />}
                        </li>
                        {options.map((option) => (
                            <li
                                key={option._id}
                                onClick={() => { setSelectedId(option._id); setIsOpen(false); }}
                                className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between ${selectedId === option._id ? "bg-primary/10 text-primary font-bold" : "text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                            >
                                <span className="truncate pr-2" title={option.name}>{option.name}</span>
                                {selectedId === option._id && <Check className="size-4 shrink-0 text-primary" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function ProfileSettings({
    user,
    universities,
    domains
}: {
    user: any;
    universities: any[];
    domains: any[];
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const { toast } = useToast();
    const t = useTranslations("manage_profile");
    const router = useRouter();
    const { update } = useSession();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateUserProfile(formData);

        if (result.success) {
            const newName = formData.get("name") as string;
            const newImage = formData.get("image") as string;

            await update({ name: newName, image: newImage });

            toast({
                title: t("success"),
                className: "bg-emerald-500 text-white border-none",
            });
            router.refresh();
        } else {
            toast({
                title: t("error"),
                description: result.error,
                variant: "destructive",
            });
        }

        setIsSubmitting(false);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        const result = await deleteAccount();

        if (result.success) {
            toast({
                title: t("account_deleted"),
                className: "bg-emerald-500 text-white border-none",
            });
            await signOut({ redirectTo: "/" });
        } else {
            toast({
                title: t("error"),
                description: result.error,
                variant: "destructive",
            });
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const inputClass = "w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111115] text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-[15px] font-medium";
    const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2.5";

    return (
        <div className="space-y-10 max-w-2xl relative z-10">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={labelClass}>
                            <User className="size-4 text-primary" />
                            {t("name_label")}
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            defaultValue={user?.name || ""}
                            placeholder={t("name_placeholder")}
                            className={inputClass}
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className={labelClass}>
                            <LinkIcon className="size-4 text-primary" />
                            {t("image_label")}
                        </label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            defaultValue={user?.image || ""}
                            placeholder={t("image_placeholder")}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="bio" className={labelClass}>
                        <UserCircle className="size-4 text-primary" />
                        {t("bio_label")}
                    </label>
                    <textarea
                        id="bio"
                        name="bio"
                        rows={4}
                        defaultValue={user?.bio || ""}
                        placeholder={t("bio_placeholder")}
                        className={`${inputClass} resize-none`}
                    />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>
                            <GraduationCap className="size-4 text-primary" />
                            {t("uni_label")}
                        </label>
                        <CustomDropdown
                            name="universityId"
                            options={universities}
                            defaultValue={user?.university?._ref || ""}
                            placeholder="-- Select University --"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>
                            <Layers className="size-4 text-primary" />
                            {t("domain_label")}
                        </label>
                        <CustomDropdown
                            name="specializationId"
                            options={domains}
                            defaultValue={user?.specialization?._ref || ""}
                            placeholder="-- Select Specialization --"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        {isSubmitting ? t("saving") : t("save_btn")}
                    </button>
                </div>
            </form>

            <div className="pt-8 border-t border-red-100 dark:border-red-900/30 mt-10">
                <div className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 rounded-2xl p-6">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-red-600 dark:text-red-400 mb-2">
                        <AlertTriangle className="size-5" />
                        {t("danger_zone")}
                    </h3>
                    <p className="text-sm text-red-500/80 dark:text-red-400/70 mb-6 font-medium">
                        {t("danger_zone_desc")}
                    </p>
                    <button
                        onClick={() => setShowDeleteModal(true)}
                        type="button"
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-100 hover:bg-red-200 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold transition-all"
                    >
                        <Trash2 className="size-4" />
                        {t("delete_account")}
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-[#161618] rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 dark:border-white/10 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-center size-12 bg-red-100 dark:bg-red-500/20 rounded-full mb-4 mx-auto">
                            <AlertTriangle className="size-6 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-bold text-center text-black dark:text-white mb-2">
                            {t("delete_confirm_title")}
                        </h3>
                        <p className="text-center text-sm text-slate-500 dark:text-white/50 mb-8 leading-relaxed">
                            {t("delete_confirm_desc")}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 py-3 px-4 rounded-xl text-sm font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white hover:bg-slate-200 dark:hover:bg-white/10 transition-colors disabled:opacity-50"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-70"
                            >
                                {isDeleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                                {t("confirm_delete")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}