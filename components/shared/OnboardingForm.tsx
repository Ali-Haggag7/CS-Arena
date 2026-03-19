"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { completeOnboarding } from "@/lib/actions";
import { Loader2, GraduationCap, Code2, ArrowRight, AlertCircle, ChevronDown, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type DropdownItem = { _id: string; name: string };

const CustomDropdown = ({
    name,
    label,
    icon: Icon,
    options,
    placeholder,
}: {
    name: string;
    label: string;
    icon: React.ElementType;
    options: DropdownItem[];
    placeholder: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<DropdownItem | null>(null);
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

    return (
        <div className="relative" ref={dropdownRef}>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2">
                <Icon className="size-4" />
                {label}
            </label>

            <input type="hidden" name={name} value={selected?._id || ""} required />

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-4 rounded-xl border flex items-center justify-between text-[15px] font-medium transition-all duration-300
                            ${isOpen ? "border-primary ring-1 ring-primary bg-white dark:bg-black" : "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black hover:border-slate-300 dark:hover:border-white/20"}
                            ${selected ? "text-black dark:text-white" : "text-slate-400 dark:text-white/30"}`}
            >
                <span>{selected ? selected.name : placeholder}</span>
                <ChevronDown className={`size-4 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white dark:bg-[#111115] border border-slate-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-white/10">
                        {options.map((option) => (
                            <li
                                key={option._id}
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-3 text-sm font-medium cursor-pointer transition-colors flex items-center justify-between
                                        ${selected?._id === option._id
                                        ? "bg-primary/10 text-primary"
                                        : "text-slate-600 dark:text-white/70 hover:bg-slate-50 dark:hover:bg-white/5"}`}
                            >
                                {option.name}
                                {selected?._id === option._id && <Check className="size-4" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default function OnboardingForm({
    universities,
    domains,
}: {
    universities: DropdownItem[];
    domains: DropdownItem[];
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const { update } = useSession();
    const { toast } = useToast();
    const t = useTranslations("onboarding");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);

        // to make sure that the user has selected a university and a domain before submitting the form
        if (!formData.get("universityId") || !formData.get("domainId")) {
            setError(t("error_generic"));
            setIsSubmitting(false);
            return;
        }

        const result = await completeOnboarding(formData);

        if (result.success) {
            toast({
                title: t("toast_success_title"),
                description: t("toast_success_desc"),
                className: "bg-emerald-500 text-white border-none",
            });

            await update({ isOnboarded: true });
            router.push("/");
            router.refresh();
        } else {
            setError(result.error || t("error_generic"));
            setIsSubmitting(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#161618] p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl dark:shadow-2xl"
        >
            <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-black dark:text-white mb-3 tracking-tight">
                    {t("title")}
                </h1>
                <p className="text-sm text-slate-500 dark:text-white/50">
                    {t("subtitle")}
                </p>
            </div>

            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 p-4 rounded-xl mb-6 text-sm font-semibold border border-red-200 dark:border-red-500/20">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-6">
                <CustomDropdown
                    name="universityId"
                    label={t("uni_label")}
                    icon={GraduationCap}
                    options={universities}
                    placeholder={t("uni_placeholder")}
                />

                <CustomDropdown
                    name="domainId"
                    label={t("domain_label")}
                    icon={Code2}
                    options={domains}
                    placeholder={t("domain_placeholder")}
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-8 flex justify-center items-center gap-2 bg-primary text-white py-4 rounded-xl text-base font-bold transition-all duration-300 hover:bg-blue-600 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-70 disabled:cursor-not-allowed group rtl:flex-row-reverse"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 className="size-5 animate-spin" />
                        <span>{t("btn_submitting")}</span>
                    </>
                ) : (
                    <>
                        <span>{t("btn_submit")}</span>
                        <ArrowRight className="size-5 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}