"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { IoLogOutOutline } from "react-icons/io5";
import { IoLogInOutline } from "react-icons/io5";
import { CiUser } from "react-icons/ci";

const SignInButton = () => {
  const { data: session } = useSession();

  if (session && session.user)
    return (
      <div className="flex gap-4 ml-auto text-white items-center">
        <Link href={`/users/${session.user.id}`}>
          <div className="relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600 hover:scale-105">
            <span className="font-medium text-gray-600 dark:text-gray-300">
              {String(session.user.firstName)[0].toUpperCase()}
            </span>
          </div>
        </Link>
        <Link
          href={""}
          className="flex text-lg gap-2 ml-auto items-center hover:scale-105"
          onClick={() => signOut()}
        >
          Sign out <IoLogOutOutline />
        </Link>
      </div>
    );

  return (
    <div className="flex gap-4 ml-auto items-center text-white text-lg">
      <Link
        href={"/auth/signin"}
        className="flex gap-2 ml-auto items-center hover:scale-105"
      >
        Sign in <IoLogInOutline />
      </Link>
      <Link
        href={"/auth/register"}
        className="flex gap-2 ml-auto items-center hover:scale-105"
      >
        SIgn up <CiUser />
      </Link>
    </div>
  );
};

export default SignInButton;
