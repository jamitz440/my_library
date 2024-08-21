import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
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
    name: "Wishlist",
    icon: faBookmark as FontAwesomeIconProps["icon"],
    link: "/wishlist",
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
    <div className="fixed bottom-0 left-0 z-50 h-16 w-full border-t border-border bg-backgroundsm:hidden">
      <div className="mx-auto grid h-full max-w-lg grid-cols-5 font-medium">
        {pages.map((page) =>
          page.name == "Add" ? (
            <Link
              key={`${page.name}-menu-button`}
              href={page.link}
              className="mx-auto my-auto flex h-16 w-16 -translate-y-4 items-center justify-center rounded-full bg-primary"
            >
              <FontAwesomeIcon
                className={`mb-2 flex h-10 w-10 translate-y-1 items-center justify-center text-white dark:text-gray-400`}
                icon={page.icon}
              />
            </Link>
          ) : (
            <Link
              key={`${page.name}-menu-button`}
              href={page.link}
              type="button"
              className="group inline-flex flex-col items-center justify-center px-5 hover:bg-muted "
            >
              <FontAwesomeIcon
                className={`mb-2 h-5 w-5 text-gray-500 dark:text-gray-400 ${page.name == currentPage && "text-primary"} `}
                icon={page.icon}
              />
              <span
                className={`text-sm text-gray-500 dark:text-gray-400 ${page.name == currentPage && "text-primary"}`}
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
