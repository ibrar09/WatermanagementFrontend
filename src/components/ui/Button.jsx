import React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = {
    default: "bg-[#F0B100] text-slate-900 hover:bg-[#D49B00] shadow-md shadow-yellow-200/50",
    destructive: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 text-slate-900",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
    ghost: "hover:bg-slate-100 hover:text-slate-900",
    link: "text-[#F0B100] underline-offset-4 hover:underline",
};

const buttonSizes = {
    default: "h-9 px-3 py-2 text-xs md:text-sm",
    sm: "h-8 px-2.5 text-xs",
    lg: "h-10 md:h-11 px-5 md:px-6 text-sm md:text-base",
    icon: "h-9 w-9",
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
                "inline-flex items-center justify-center rounded-xl font-bold transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400",
                "disabled:pointer-events-none disabled:opacity-50",
                "active:scale-95 touch-target",
                "whitespace-nowrap",
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
