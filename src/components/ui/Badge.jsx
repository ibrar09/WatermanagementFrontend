import React from "react";
import { cn } from "../../lib/utils";

const badgeVariants = {
    default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
    secondary: "border-transparent bg-slate-100 text-slate-900 hover:bg-slate-200",
    destructive: "border-transparent bg-red-100 text-red-600 hover:bg-red-200",
    outline: "text-slate-950 border-slate-200",
    success: "border-transparent bg-emerald-100 text-emerald-600 hover:bg-emerald-200",
    warning: "border-transparent bg-amber-100 text-amber-600 hover:bg-amber-200",
};

function Badge({ className, variant = "default", ...props }) {
    const variantClass = badgeVariants[variant] || badgeVariants.default;

    return (
        <div
            className={cn(
                "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 uppercase tracking-wide",
                variantClass,
                className
            )}
            {...props}
        />
    );
}

export { Badge };
