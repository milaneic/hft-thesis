"use client";
import Link from "next/link";

// Error boundaries must be Client Components

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex flex-col gap-10 justify-center items-center">
      <h2 className="text-3xl text-gray-700">Something went wrong!</h2>
      <button onClick={() => reset()}>Try again!</button>
      <Link className="text-lg text-sky-500" href="/">
        Back to home page
      </Link>
    </div>
  );
}
