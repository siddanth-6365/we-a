import * as React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300",
      outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 active:bg-gray-100",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200",
      destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
    };

    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6 text-base"
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
