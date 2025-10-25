"use client"

import { Toaster as SonnerToaster } from "sonner"

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "bg-neutral-900 text-white border border-neutral-700 shadow-lg rounded-xl",
          actionButton: "bg-red-600 text-white hover:bg-red-700",
          cancelButton: "bg-gray-700 text-white hover:bg-gray-600",
          description: "text-gray-300",
        },
      }}
    />
  )
}