"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h2 className="text-2xl font-semibold">Something went wrong.</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn&apos;t load this page. Please try again.
      </p>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
