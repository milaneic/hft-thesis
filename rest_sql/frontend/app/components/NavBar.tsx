"use client";
import SignInButton from "@/components/SignInButton";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const NavBar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();

  const hiddenPaths = [
    "/404",
    "/not-found",
    "/signin",
    "/auth/signin",
    "/auth/register",
    "_error",
  ];

  const isHidden = hiddenPaths.includes(pathname);

  if (isHidden) return null;

  return (
    <nav
      className="w-full h-[100px] mb-5 px-10 flex items-center bg-green-700"
      id="navBar"
    >
      <Link
        href="/"
        className="text-3xl font-normal uppercase text-white tracking-widest"
      >
        trace
      </Link>
      <div className="flex gap-7 text-xl text-white ml-[50px]">
        {session?.user.role === "admin" && (
          <>
            <Link href="/users">Users</Link>
            <Link href="/roles">Roles</Link>
          </>
        )}
        <Link href="/trips">Trips</Link>
        <Link href="/orders">Orders</Link>
        <Link href="/logs">Logs</Link>
        <Link href="/events">Events</Link>
        <Link href="/countries">Countries</Link>
        <Link href="/vehicles">Vehicles</Link>
        <Link href="/drivers">Drivers</Link>
      </div>
      <SignInButton />
    </nav>
  );
};

export default NavBar;
