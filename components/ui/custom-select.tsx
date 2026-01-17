/**
 * CustomSelect Component
 * Extended select component with label, error states, and brand color support
 */

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";

const selectVariants = cva(
  "flex h-10 w-full appearance-none rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
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
      selectSize: {
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
      selectSize: "md",
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

export interface CustomSelectProps
  extends
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  isLoading?: boolean;
  containerClassName?: string;
}

const CustomSelect = React.forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      className,
      variant = "default",
      selectSize = "md",
      label,
      helperText,
      errorMessage,
      placeholder,
      options,
      isLoading,
      required,
      disabled,
      containerClassName,
      children,
      id,
      ...props
    },
    ref,
  ) => {
    const randomId = React.useId();
    const selectId = id || randomId;
    const hasError = !!errorMessage;
    const showHelperText = !hasError && helperText;

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
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

        {/* Select Wrapper */}
        <div className="relative">
          {/* Select */}
          <select
            id={selectId}
            ref={ref}
            disabled={disabled || isLoading}
            required={required}
            className={cn(
              selectVariants({ variant, selectSize, hasError }),
              isLoading && selectSize === "sm" && "pr-8",
              isLoading && selectSize === "md" && "pr-10",
              isLoading && selectSize === "lg" && "pr-12",
              !isLoading && selectSize === "sm" && "pr-7",
              !isLoading && selectSize === "md" && "pr-9",
              !isLoading && selectSize === "lg" && "pr-11",
              className,
            )}
            {...props}
          >
            {/* Placeholder Option */}
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {/* Options from Array */}
            {options
              ? options.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))
              : children}
          </select>

          {/* Chevron Icon / Loading */}
          <div
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400",
              selectSize === "sm" && "right-2",
              selectSize === "lg" && "right-4",
            )}
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ChevronDown className="size-4" />
            )}
          </div>
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

CustomSelect.displayName = "CustomSelect";

export { CustomSelect, selectVariants };
