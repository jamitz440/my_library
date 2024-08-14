import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faBooks,
  faHouse,
  faUser,
  faBookmark,
  faPlus,
} from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import Link from "next/link";

type Page = {
  name: string;
  icon: FontAwesomeIconProps["icon"];
  link: string;
};

const pages: Page[] = [
  { name: "Home", icon: faHouse as FontAwesomeIconProps["icon"], link: "/" },
  {
    name: "TBR",
    icon: faBookmark as FontAwesomeIconProps["icon"],
    link: "/",
  },
  { name: "Add", icon: faPlus as FontAwesomeIconProps["icon"], link: "/" },
  {
    name: "Library",
    icon: faBooks as FontAwesomeIconProps["icon"],
    link: "/library",
  },
  {
    name: "Profile",
    icon: faUser as FontAwesomeIconProps["icon"],
    link: "/profile",
  },
];

export const MenuBar = ({
  currentPage,
}: {
  currentPage: "Home" | "TBR" | "Library" | "Profile";
}) => {
  return (
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-gray-200 bg-white dark:border-gray-600 dark:bg-gray-700 sm:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
        {pages.map((page) =>
          page.name == "Add" ? (
            <Link
              key={`${page.name}-menu-button`}
              href={page.link}
              className="mx-auto my-auto flex h-16 w-16 -translate-y-2 items-center justify-center rounded-full bg-blue-400"
            >
              <FontAwesomeIcon
                className={`mb-2 flex h-10 w-10 translate-y-1 items-center justify-center text-blue-50 dark:text-gray-400`}
                icon={page.icon}
              />
            </Link>
          ) : (
            <Link
              key={`${page.name}-menu-button`}
              href={page.link}
              type="button"
              className="group inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FontAwesomeIcon
                className={`mb-2 h-5 w-5 text-gray-500 dark:text-gray-400 ${page.name == currentPage && "text-blue-600 dark:text-blue-500"} `}
                icon={page.icon}
              />
              <span
                className={`text-sm text-gray-500 dark:text-gray-400 ${page.name == currentPage && "text-blue-600 dark:text-blue-500"}`}
              >
                {page.name}
              </span>
            </Link>
          ),
        )}
      </div>
    </div>
  );
};
