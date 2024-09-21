import React, { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { checkSignIn } from "../server/actions";

export const CheckSignedIn = ({ children }: { children: React.ReactNode }) => {
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      const res = checkSignIn(user.id);

      console.log(res);
    }
  }, [isSignedIn, user]);

  return { children };
};
