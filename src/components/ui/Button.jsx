import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-blue-600 underline-offset-4 hover:underline",
};

const buttonSizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
};

const Button = React.forwardRef(({
    className,
    variant = "default",
    size = "default",
    isLoading = false,
    children,
    ...props
}, ref) => {
    const variantClass = buttonVariants[variant] || buttonVariants.default;
    const sizeClass = buttonSizes[size] || buttonSizes.default;

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-xl text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
                variantClass,
                sizeClass,
                className
            )}
            ref={ref}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    );
});
Button.displayName = "Button";

export { Button };
