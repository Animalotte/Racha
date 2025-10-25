import * as React from "react";
import { cn } from "@/lib/utils";

export function Separator({ className, orientation = "horizontal", ...props }: React.HTMLAttributes<HTMLDivElement> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      className={cn(
        "bg-gray-200 my-4",
        orientation === "vertical" ? "h-full w-[1px]" : "h-[1px] w-full",
        className
      )}
      role="separator"
      {...props}
    />
  );
}