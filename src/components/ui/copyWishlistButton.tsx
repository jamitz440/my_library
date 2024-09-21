"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "./use-toast";

export default function CopyWishlistLinkButton({
  wishlistLink,
}: {
  wishlistLink: string;
}) {
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const copyToClipboard = () => {
    if (wishlistLink) {
      navigator.clipboard
        .writeText("https://books.fitzythe.dev/wishlist/" + wishlistLink)
        .then(() => {
          setIsCopied(true);
          toast({ description: "Wishlist link copied to clipboard!" });
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch((err) => {
          console.error("Failed to copy: ", err);
          toast({ description: "Failed to copy link. Please try again." });
        });
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      className="transition duration-300 ease-in-out hover:scale-105"
    >
      {isCopied ? "Copied!" : "Share Link"}
    </Button>
  );
}
