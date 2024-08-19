import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { UserProfile } from "@clerk/nextjs";

export default function Profile() {
  return (
    <div>
      <NavBar selected="Profile"/>
      <div className="mb-24 flex h-full w-full items-center justify-center pt-4">
        <UserProfile path="/profile" />
      </div>
      <MenuBar currentPage="Profile" />
    </div>
  );
}

