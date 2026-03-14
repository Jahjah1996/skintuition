import React, { forwardRef, useState } from "react";
import { cn } from "../../utils/cn";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && isPasswordVisible ? "text" : type;

    return (
      <div className="w-full">
        {label && (
          <label className="mb-1 block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={resolvedType}
            className={cn(
              "flex h-10 w-full rounded-md border border-surface-border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
              isPassword && "pr-10",
              error && "border-status-danger focus:ring-status-danger",
              className,
            )}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setIsPasswordVisible((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              aria-label={isPasswordVisible ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {isPasswordVisible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-status-danger">{error}</p>}
      </div>
    );
  },
);
Input.displayName = "Input";
