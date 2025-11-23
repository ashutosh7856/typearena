import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    isLoading = false,
    disabled = false,
    ...props
}) => {
    const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";

    const variants = {
        primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-[1.02]",
        secondary: "bg-surface border border-white/10 text-white hover:bg-white/5 hover:border-primary/50 hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]",
        ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5",
        danger: "bg-error/10 border border-error/20 text-error hover:bg-error/20 hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
    };

    const sizes = {
        sm: "px-4 py-2 text-sm rounded-lg",
        md: "px-6 py-3 text-base rounded-xl",
        lg: "px-8 py-4 text-lg rounded-2xl"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {/* Gradient Shine Effect for Primary */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            )}

            {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : null}

            <span className="relative z-20 flex items-center gap-2">
                {children}
            </span>
        </button>
    );
};

export default Button;
