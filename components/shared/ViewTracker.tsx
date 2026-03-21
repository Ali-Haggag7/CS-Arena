"use client";

import { useEffect } from "react";
import { incrementProjectView } from "@/lib/actions";

export default function ViewTracker({ id }: { id: string }) {
    useEffect(() => {
        incrementProjectView(id);
    }, [id]);

    return null;
}