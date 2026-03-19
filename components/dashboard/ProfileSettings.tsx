"use client";

import React, { useState, useRef, useEffect } from "react";
import { updateUserProfile } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, UserCircle, GraduationCap, Layers, ChevronDown, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

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
    const { toast } = useToast();
    const t = useTranslations("manage_profile");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const result = await updateUserProfile(formData);

        if (result.success) {
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

    const inputClass = "w-full p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#111115] text-black dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-300 text-[15px] font-medium";
    const labelClass = "flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl relative z-10">

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
    );
}