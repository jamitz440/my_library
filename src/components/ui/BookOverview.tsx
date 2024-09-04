"use client";
import Image from "next/image";
import { useState, type ReactNode } from "react";
import { Card } from "./card";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "./button";
import { Input } from "./input";
import { Checkbox } from "./checkbox";
import StarRating from "./StarRating";
import { Skeleton } from "./skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";

type Book = InferSelectModel<typeof books>;

export const BookOverview = ({
  book,
  children,
}: {
  book: Book;
  children?: ReactNode;
}) => {
  const [dialog, setDialog] = useState(false);
  return (
    <Card key={book.title} className="relative flex h-full flex-col gap-2 p-2">
      <div
        className={`${
          book.read ? "bg-black" : ""
        } group relative aspect-book w-full overflow-hidden rounded-sm rounded-e-xl hover:cursor-pointer`}
      >
        <Image
          className={`${book.read ? "opacity-70" : ""} z-0`}
          src={`${book.image}`}
          fill
          alt={book.title}
        />
        {children}
        <div
          onClick={() => setDialog(true)}
          className="absolute bottom-0 z-10 flex h-full w-full select-none items-center justify-center bg-zinc-800/80 text-2xl font-bold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          Edit book
        </div>
        <DialogPopUp dialog={dialog} setDialog={setDialog} book={book} />
      </div>
      <div className="flex h-auto flex-col">
        <div className="flex max-w-full items-start justify-start whitespace-nowrap text-sm font-bold">
          <span className="overflow-hidden text-ellipsis">{book.title}</span>
        </div>
        <div className="w-auto text-xs text-zinc-400 sm:text-sm">
          {book.authors ? book.authors[0] : ""}
        </div>
        <div className="mt-4 flex w-full items-center justify-center">
          {book.owned && (
            <StarRating
              onSetRating={() => null}
              size={24}
              maxRating={5}
              defaultRating={book.rating!}
              dynamic={false}
            />
          )}
        </div>
      </div>
    </Card>
  );
};

BookOverview.Loading = function BookOverviewLoading({
  page,
}: {
  page: string;
}) {
  return (
    <Card className="flex flex-col gap-2 p-2">
      <div>
        <Skeleton className="mx-auto aspect-book w-full rounded-sm rounded-e-xl" />
      </div>
      <div className="flex h-auto flex-col">
        <Skeleton className="mb-2 mr-auto h-[20px] w-3/4 rounded-full" />
        <Skeleton className="mb-2 mr-auto h-[10px] w-1/2 rounded-full" />
        {page == "wishlist" ? (
          <div className="h-4"></div>
        ) : (
          <Skeleton className="mx-auto mt-3 h-[20px] w-1/2 min-w-32 rounded-full" />
        )}
      </div>
    </Card>
  );
};

const DialogPopUp = ({
  dialog,
  setDialog,
  book,
}: {
  dialog: boolean;
  setDialog: (arg0: boolean) => void;
  book: Book;
}) => {
  const defaultData = {
    title: book.title,
    author: book.authors![0] ?? "",
    owned: book.owned,
    read: book.read,
    rating: book.rating,
  };

  const [formData, setFormData] = useState(defaultData);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target.type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const [alert, setAlert] = useState(false);

  const handleRating = (rating: number) => {
    setFormData({ ...formData, rating: rating });
    console.log(rating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform save action here
    setDialog(false);
  };

  const checkChanges = () => {
    const hasChanges = JSON.stringify(defaultData) !== JSON.stringify(formData);
    if (!hasChanges) {
      setDialog(false);
    } else {
      // Optionally, you can show a confirmation dialog here
      setAlert(true);
    }
  };
  return (
    <Dialog open={dialog}>
      <DialogContent onPointerDownOutside={() => checkChanges()}>
        <DialogClose onClick={() => setDialog(false)} />
        <DialogHeader>
          <DialogTitle className="text-secondary-foreground">
            Edit Book
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-4 text-accent-foreground"
        >
          <div className="flex flex-col gap-4">
            <div className="text-ellipsis text-lg">
              Title:{" "}
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="text-lg">
              Author:{" "}
              <Input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex pt-2">
              <label htmlFor="rating">Rating: </label>
              <StarRating
                maxRating={5}
                defaultRating={book.rating!}
                size={32}
                className="mx-auto"
                onSetRating={handleRating}
              />
            </div>
            <div className="flex items-center justify-around gap-2 pt-2">
              <div className="flex gap-2">
                <Checkbox
                  id="owned"
                  name="owned"
                  checked={formData.owned!}
                  onClick={() =>
                    setFormData({ ...formData, owned: !formData.owned })
                  }
                />
                <label
                  htmlFor="owned"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as owned
                </label>
              </div>
              <div className="flex gap-2">
                <Checkbox
                  id="read"
                  name="read"
                  checked={formData.read!}
                  onClick={() =>
                    setFormData({ ...formData, read: !formData.read })
                  }
                />
                <label
                  htmlFor="read"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mark as read
                </label>
              </div>
            </div>
          </div>
          <div className="flex w-full justify-around gap-4">
            <Button
              variant={"secondary"}
              className="w-full"
              onClick={() => checkChanges()}
            >
              {`Cancel`}
            </Button>
            <Button type="submit" className="w-full">
              {`Save Changes`}
            </Button>
          </div>
        </form>
        <AlertDialog open={alert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                You have changes that you havent saved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setAlert(false);
                  setDialog(false);
                  setFormData(defaultData);
                }}
              >
                Close Dialog
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
};
