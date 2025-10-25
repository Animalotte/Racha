import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";  
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "sm" | "default" | "lg";  
  asChild?: boolean;  
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"; 
    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          
          size === "sm" && "text-xs px-2 py-1",
          size === "default" && "text-sm px-4 py-2",
          size === "lg" && "text-lg px-6 py-3",
          
          variant === "default" && "bg-blue-600 text-white hover:bg-blue-700",
          variant === "outline" && "border border-gray-300 hover:bg-gray-100",
          variant === "ghost" && "hover:bg-gray-100",
          variant === "link" && "text-blue-600 underline-offset-4 hover:underline",
          className 
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";