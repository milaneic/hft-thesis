import Link from "next/link";
import React from "react";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen z-10 overflow-hidden">
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4">
        {` Sorry, we couldn't find the page you're looking for.`}
      </p>
      <Link href="/" className="mt-6 text-green-700 text-xl hover:scale-105 ">
        Go back home
      </Link>
    </div>
  );
}
