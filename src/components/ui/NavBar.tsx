"use client";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { faBooks } from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import React from "react";

export const NavBar = () => {
  const MemoizedProfileButton = React.memo(ProfileButton);
  return (
    <nav className="border-gray-200 bg-white dark:bg-gray-900">
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <FontAwesomeIcon
            icon={faBooks as FontAwesomeIconProps["icon"]}
            className="h-8"
          />
          <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
            My Library
          </span>
        </Link>

        <div className="hidden w-full sm:block sm:w-auto" id="navbar-default">
          <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:flex-row sm:space-x-8 sm:border-0 sm:bg-white sm:p-0 sm:dark:bg-gray-900 rtl:space-x-reverse">
            <li>
              <Link
                href="/"
                className="block rounded bg-blue-700 px-3 py-2 text-white dark:text-white sm:bg-transparent sm:p-0 sm:text-blue-700 sm:dark:text-blue-500"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/tbr"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:border-0 sm:p-0 sm:hover:bg-transparent sm:hover:text-blue-700 sm:dark:hover:bg-transparent sm:dark:hover:text-blue-500"
              >
                TBR
              </Link>
            </li>
            <li>
              <Link
                href="/library"
                className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:border-0 sm:p-0 sm:hover:bg-transparent sm:hover:text-blue-700 sm:dark:hover:bg-transparent sm:dark:hover:text-blue-500"
              >
                Library
              </Link>
            </li>
            <li>
              <MemoizedProfileButton />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

const ProfileButton = () => {
  const { isSignedIn } = useUser();
  return isSignedIn ? (
    <Link
      href="/profile"
      className="block rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:border-0 sm:p-0 sm:hover:bg-transparent sm:hover:text-blue-700 sm:dark:hover:bg-transparent sm:dark:hover:text-blue-500"
    >
      Profile
    </Link>
  ) : (
    <SignInButton>
      <div className="block cursor-pointer select-none rounded px-3 py-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white sm:border-0 sm:p-0 sm:hover:bg-transparent sm:hover:text-blue-700 sm:dark:hover:bg-transparent sm:dark:hover:text-blue-500">
        Sign In
      </div>
    </SignInButton>
  );
};
