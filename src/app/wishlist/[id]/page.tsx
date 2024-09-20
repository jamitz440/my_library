"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSharedWishlist, reserveBook } from "~/server/actions";
import { type InferSelectModel } from "drizzle-orm";
import { type books } from "~/server/db/schema";
import { faBooks } from "@awesome.me/kit-30477fcccd/icons/classic/solid";
import {
  FontAwesomeIcon,
  type FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Card } from "~/components/ui/card";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";

type Book = InferSelectModel<typeof books>;

export default function WishlistShare({ params }: { params: { id: string } }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["SharedWishlist"],
    queryFn: async () => {
      const result = (await getSharedWishlist(params.id)) as Book[];
      return result;
    },
    staleTime: 1000,
    refetchOnMount: true,
  });
  if (data) {
    console.log(data);
    return (
      <div className="bg-background">
        <nav className="border-b border-border">
          <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
            <FontAwesomeIcon
              icon={faBooks as FontAwesomeIconProps["icon"]}
              className="h-8 text-primary"
            />
            <span className="ml-4 mr-auto self-center whitespace-nowrap text-2xl font-semibold text-secondary-foreground">
              {`James's Wishlist`}
            </span>

            <div
              className="hidden w-full sm:block sm:w-auto"
              id="navbar-default"
            >
              <ul className="mt-4 flex flex-col rounded-lg border border-gray-100 p-4 font-medium dark:border-gray-700 dark:bg-gray-800 sm:mt-0 sm:flex-row sm:space-x-8 sm:border-0 sm:p-0 rtl:space-x-reverse"></ul>
            </div>
          </div>
        </nav>
        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
          <div className="mb-16 grid w-full grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {data.map((book: Book) => (
              <WishlistBookOverview book={book} key={book.id} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const WishlistBookOverview = ({ book }: { book: Book }) => {
  const [dialog, setDialog] = useState(false);
  const isReserved = Boolean(book.reservedBy);
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
