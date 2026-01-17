/**
 * TextField Component
 * Extended input component with label, decorations, error states, and brand color support
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const textFieldVariants = cva(
  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-input focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        grin: "border-gray-300 focus-visible:border-grin-500 focus-visible:ring-2 focus-visible:ring-grin-500/20",
        peenk:
          "border-gray-300 focus-visible:border-peenk-500 focus-visible:ring-2 focus-visible:ring-peenk-500/20",
        ohrange:
          "border-gray-300 focus-visible:border-ohrange-500 focus-visible:ring-2 focus-visible:ring-ohrange-500/20",
        perple:
          "border-gray-300 focus-visible:border-perple-500 focus-visible:ring-2 focus-visible:ring-perple-500/20",
        lermorn:
          "border-gray-300 focus-visible:border-lermorn-500 focus-visible:ring-2 focus-visible:ring-lermorn-500/20",
      },
      inputSize: {
        sm: "h-8 text-xs px-2",
        md: "h-10 text-sm px-3",
        lg: "h-12 text-base px-4",
      },
      hasError: {
        true: "border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
      inputSize: "md",
      hasError: false,
    },
  },
);

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "text-foreground",
        grin: "text-gray-700",
        peenk: "text-gray-700",
        ohrange: "text-gray-700",
        perple: "text-gray-700",
        lermorn: "text-gray-700",
      },
      hasError: {
        true: "text-red-600",
      },
      required: {
        true: "after:content-['*'] after:ml-0.5 after:text-red-500",
      },
    },
    defaultVariants: {
      variant: "default",
      hasError: false,
      required: false,
    },
  },
);

export interface TextFieldProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof textFieldVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  startDecoration?: React.ReactNode;
  endDecoration?: React.ReactNode;
  isLoading?: boolean;
  containerClassName?: string;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      variant = "default",
      inputSize = "md",
      label,
      helperText,
      errorMessage,
      startDecoration,
      endDecoration,
      isLoading,
      required,
      disabled,
      containerClassName,
      id,
      ...props
    },
    ref,
  ) => {
    const randomId = React.useId();
    const inputId = id || randomId;
    const hasError = !!errorMessage;
    const showHelperText = !hasError && helperText;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              labelVariants({
                variant,
                hasError,
                required,
              }),
            )}
          >
            {label}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative">
          {/* Start Decoration */}
          {startDecoration && (
            <div
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
                inputSize === "sm" && "left-2",
                inputSize === "lg" && "left-4",
              )}
            >
              {startDecoration}
            </div>
          )}

          {/* Input */}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled || isLoading}
            required={required}
            className={cn(
              textFieldVariants({ variant, inputSize, hasError }),
              startDecoration && inputSize === "sm" && "pl-8",
              startDecoration && inputSize === "md" && "pl-10",
              startDecoration && inputSize === "lg" && "pl-12",
              (endDecoration || isLoading) && inputSize === "sm" && "pr-8",
              (endDecoration || isLoading) && inputSize === "md" && "pr-10",
              (endDecoration || isLoading) && inputSize === "lg" && "pr-12",
              className,
            )}
            {...props}
          />

          {/* End Decoration / Loading */}
          {(endDecoration || isLoading) && (
            <div
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
                inputSize === "sm" && "right-2",
                inputSize === "lg" && "right-4",
              )}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                endDecoration
              )}
            </div>
          )}
        </div>

        {/* Helper Text / Error Message */}
        {(showHelperText || hasError) && (
          <p
            className={cn(
              "text-xs",
              hasError ? "text-red-600" : "text-gray-500",
            )}
          >
            {hasError ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField, textFieldVariants };
