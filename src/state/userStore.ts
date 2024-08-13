import { create } from "zustand";
import { auth, currentUser } from "@clerk/nextjs/server";

type UserT = {
  getUser: () => void;
};

type UserState = {
  user: UserT;
};
export const useUserStore = create<UserT>((set) => ({
  getUser: () => {
    set;
    console.log(currentUser);
  },
}));
