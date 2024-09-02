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

type Book = InferSelectModel<typeof books>;

export const BookOverview = ({
  book,
  children,
}: {
  book: Book;
  children?: ReactNode;
}) => {
  const [dialog, setDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.authors[0] || "",
    owned: book.owned,
    read: book.read,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target.type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Perform save action here
    setDialog(false);
  };

  return (
    <Card key={book.title} className="relative flex h-full flex-col gap-2 p-2">
      <div
        className={`${
          book.read ? "bg-black" : ""
        } relative aspect-book w-full overflow-hidden rounded-sm rounded-e-xl`}
      >
        <Image
          className={`${book.read ? "opacity-70" : ""} `}
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
        <Dialog open={dialog}>
          <DialogContent
            onPointerDownOutside={() => {
              setDialog(false);
            }}
          >
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
                <div className="flex items-center justify-around gap-2 pt-4">
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
                  onClick={() => setDialog(false)}
                >
                  {`Cancel`}
                </Button>
                <Button type="submit" className="w-full">
                  {`Save Changes`}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
