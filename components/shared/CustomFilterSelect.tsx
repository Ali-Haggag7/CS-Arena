"use client";

import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export const CustomFilterSelect = ({
    name,
    label,
    options,
    currentValue,
    onChange,
}: {
    name: string;
    label: React.ReactNode;
    options: { _id: string; name: string }[];
    currentValue: string;
    onChange: (value: string) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const selectedOption = options.find((opt) => opt._id === currentValue);

    return (
        <div className="relative w-full sm:w-auto sm:min-w-[180px] z-50" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border border-white/10 bg-[#161618] hover:bg-[#1f1f22] transition-colors text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-md"
            >
                <span className="flex items-center gap-1.5 sm:gap-2 truncate text-white/90">
                    {label}
                    <span className="font-semibold text-white truncate max-w-[60px] sm:max-w-[100px]">
                        {selectedOption ? selectedOption.name : "All"}
                    </span>
                </span>
                <ChevronDown className={`size-3 sm:size-4 shrink-0 text-white/70 transition-transform ${isOpen ? "rotate-180 text-primary" : ""}`} />
            </button>

            {isOpen && (
                <div className="absolute z-[100] w-[200px] sm:w-full sm:min-w-full mt-2 py-2 bg-[#111115] border border-white/10 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2 ltr:left-0 rtl:right-0 sm:ltr:left-auto sm:rtl:right-auto">
                    <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20">
                        <li
                            onClick={() => { onChange(""); setIsOpen(false); }}
                            className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm cursor-pointer transition-colors flex justify-between items-center ${!currentValue ? "text-primary bg-primary/10 font-bold" : "text-white/80 hover:bg-white/10"}`}
                        >
                            <span>All</span>
                            {!currentValue && <Check className="size-3 sm:size-4 shrink-0" />}
                        </li>

                        <div className="h-px bg-white/5 my-1 mx-2" />

                        {options.map((option) => (
                            <li
                                key={option._id}
                                onClick={() => { onChange(option._id); setIsOpen(false); }}
                                className={`px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm cursor-pointer transition-colors flex justify-between items-center ${currentValue === option._id ? "text-primary bg-primary/10 font-bold" : "text-white/80 hover:bg-white/10"}`}
                            >
                                <span className="truncate">{option.name}</span>
                                {currentValue === option._id && <Check className="size-3 sm:size-4 shrink-0" />}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};