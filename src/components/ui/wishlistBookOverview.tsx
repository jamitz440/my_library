"use client";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { type InferSelectModel } from "drizzle-orm";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { getUser, reserveBook } from "~/server/actions";
import { type books } from "~/server/db/schema";
import { Button } from "./button";
import { Card } from "./card";
import { DialogHeader, Dialog, DialogContent, DialogTitle } from "./dialog";
import Image from "next/image";
import { Label } from "./label";
import { Input } from "./input";
import { useTheme } from "next-themes";

type Book = InferSelectModel<typeof books>;
export const WishlistBookOverview = ({ book }: { book: Book }) => {
  const [dialog, setDialog] = useState(false);
  const isReserved = Boolean(book.reservedBy);
  const { setTheme } = useTheme();

  useEffect(() => {
    const getTheme = async () => {
      const user = await getUser(book.user_id!);

      if (user.theme!) {
        setTheme(user.theme);
      }
    };
    getTheme().catch((e) => {
      console.log(e);
    });
  }, []);
  return (
    <Card key={book.title} className="relative flex h-full flex-col gap-2 p-2">
      <div
        className={`${
          book.read ? "bg-black" : ""
        } group relative aspect-book w-full overflow-hidden rounded-sm rounded-e-xl hover:cursor-pointer`}
      >
        <Image
          className="z-0"
          src={book.image ?? "/default-book-cover.jpg"}
          fill
          alt={book.title}
        />
      </div>
      <div className="flex h-auto flex-col">
        <div className="flex max-w-full items-start justify-start whitespace-nowrap text-sm font-bold">
          <span className="overflow-hidden text-ellipsis">{book.title}</span>
        </div>
        <div className="w-auto text-xs text-zinc-400 sm:text-sm">
          {book.authors ? book.authors[0] : ""}
        </div>
        <div className="mt-4 flex w-full items-center justify-center">
          <Button
            className={clsx("w-full", {
              "bg-secondary text-primary hover:text-secondary": isReserved,
            })}
            onClick={() => !isReserved && setDialog(true)}
            disabled={isReserved}
          >
            {isReserved ? `Reserved by ${book.reservedBy}` : "Reserve book"}
          </Button>

          <ReserveDialog dialog={dialog} id={book.id} setDialog={setDialog} />
        </div>
      </div>
    </Card>
  );
};

const ReserveDialog = ({
  dialog,
  id,
  setDialog,
}: {
  dialog: boolean;
  id: number;
  setDialog: Dispatch<SetStateAction<boolean>>;
}) => {
  const [name, setName] = useState("");
  const queryClient = useQueryClient();

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name.");
      return;
    }
    try {
      await reserveBook(id, name);
      await queryClient.invalidateQueries({
        queryKey: ["SharedWishlist"],
      });
      setDialog(false);
    } catch (error) {
      alert("Failed to reserve the book. Please try again.");
    }
  };

  return (
    <Dialog open={dialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-secondary-foreground">
            Edit Book
          </DialogTitle>
        </DialogHeader>
        <form
          className="flex w-full flex-col gap-4 text-accent-foreground"
          onSubmit={handleReserve}
        >
          <div className="flex flex-col gap-4">
            <div className="text-ellipsis text-lg">
              <Label htmlFor="name">Enter your name to reserve this:</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="flex w-full justify-around gap-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => setDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full">
              {`Save Changes`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
