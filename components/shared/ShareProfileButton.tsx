"use client";

import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

const ShareProfileButton = () => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (err) {
            console.error("Failed to copy link", err);
        }
    };

    return (
        <button
            type="button"
            onClick={handleShare}
            className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${copied
                ? "bg-emerald-500 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                : "bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-white"
                }`}
        >
            {copied ? <Check className="size-3.5" /> : <Share2 className="size-3.5" />}
            <span>{copied ? "Link Copied!" : "Share Profile"}</span>
        </button>
    );
};

export default ShareProfileButton;