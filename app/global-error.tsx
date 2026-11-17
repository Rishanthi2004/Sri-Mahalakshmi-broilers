"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#DDF3DF] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#C7E4CA] p-6 text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-[#26352B]">Application Error</h2>
          <p className="text-xs text-[#516357]">
            {error?.message || "An error occurred. Please refresh or try again."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 rounded-xl bg-[#287A45] hover:bg-[#1E5F35] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

