"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("react-barcode-scanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);
const DynamicPolyfill = dynamic(
  () =>
    import("react-barcode-scanner/polyfill").then((module) => {
      return () => null;
    }),
  { ssr: false },
);

import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { BookSearchOverview } from "~/components/ui/BookSearchOverview";
import { Checkbox } from "~/components/ui/checkbox";
import { useTheme } from "next-themes";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type Book = InferSelectModel<typeof books>;

interface DimensionsStructured {
  length: {
    unit: string;
    value: number;
  };
  width: {
    unit: string;
    value: number;
  };
  weight: {
    unit: string;
    value: number;
  };
  height: {
    unit: string;
    value: number;
  };
}
export interface Bookk {
  publisher: string;
  synopsis: string;
  language: string;
  image: string;
  title_long: string;
  dimensions: string; // This can be a more complex structure if needed
  dimensions_structured: DimensionsStructured;
  pages: number;
  date_published: string;
  subjects: string[];
  authors: string[];
  title: string;
  isbn13: string;
  msrp: string;
  binding: string;
  isbn: string;
  isbn10: string;
}

interface Data {
  book: Bookk;
}

interface Res {
  data: Bookk[];
}

interface BarcodeData {
  rawValue: string;
}

export default function Home() {
  const [book, setBook] = useState<Bookk | null>();
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const { toast } = useToast();
  const [search, setSearch] = useState<string>("");
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [results, setResults] = useState<Bookk[]>();
  const [checked, setChecked] = useState<boolean>(false);
  const [owned, setOwned] = useState<boolean>(false);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const getBook = async (book: string) => {
    try {
      const res = await fetch("api/getBook", { method: "POST", body: book });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as Data;

      setBook(data.book);
      setOpen(false);
      setDialog(true);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setBook(null);
    }
  };

  const handleAdd = async () => {
    const res = await fetch("api/addToLibrary", {
      method: "POST",
      body: JSON.stringify({
        book: book,
        user_id: user?.id,
        read: checked,
        owned: owned,
      }),
    });
    toast({
      title: `Added to Library`,
      description: `${book?.title} - ${book?.authors ? book?.authors[0] : ""}`,
    });
    await queryClient.invalidateQueries({ queryKey: ["library"] });
    await queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    await queryClient.invalidateQueries({ queryKey: ["stats"] });
    setDialog(false);
  };

  const handleReset = () => {
    setBook(null);
    setDialog(false);
    setOpen(true);
  };

  const handleSearch = async () => {
    if (search === "") {
      return;
    }
    const res = await fetch("api/searchBooks", {
      method: "POST",
      body: JSON.stringify({ title: search, author: authorSearch }),
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }

    const data = (await res.json()) as Res;

    setResults(data.data);
  };

  return (
    <div className="bg-background">
      <NavBar selected="Search" />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-center p-4">
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex w-full flex-col gap-4">
            <Input
              className="w-full text-secondary-foreground"
              value={search}
              placeholder="Title"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Input
              className="w-full text-secondary-foreground"
              placeholder="Author"
              value={authorSearch}
              onChange={(e) => {
                setAuthorSearch(e.target.value);
              }}
            />
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={handleSearch}>Search</Button>
            <Button variant={"secondary"} onClick={() => setOpen(true)}>
              Scan
            </Button>
          </div>
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
                {search
                  ? "Add this book to your library?"
                  : "Is this the correct book?"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-full gap-4 text-accent-foreground">
              <div className="relative aspect-book h-52 w-auto overflow-hidden rounded-md">
                {book && (
                  <Image layout="fill" src={book.image} alt={book.title} />
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-ellipsis text-lg font-bold">
                  {book?.title}
                </div>
                <div className="text-lg">{book?.authors}</div>
                <div className="text mt-4">
                  Published:{" "}
                  {book?.date_published ? book?.date_published : "n/a"}
                </div>
                <div className="textlg">Pages: {book?.pages}</div>
                <div className="mt-4 flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={checked}
                    onClick={() => setChecked(!checked)}
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as read
                  </label>
                  <Checkbox
                    id="owned"
                    checked={owned}
                    onClick={() => setOwned(!owned)}
                  />
                  <label
                    htmlFor="owned"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Mark as owned
                  </label>
                </div>
              </div>
            </div>
            <div className="flex w-full justify-around gap-4">
              <Button
                variant={"secondary"}
                onClick={handleReset}
                className="w-full"
              >
                {`No, that's not right!`}
              </Button>
              <Button className="w-full" onClick={handleAdd}>
                {`Add to MyLibrary! `}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={open}>
          <DialogContent
            onPointerDownOutside={() => {
              setOpen(false);
            }}
          >
            <DialogClose onClick={() => setOpen(false)} />
            <DialogHeader>
              <DialogTitle className="text-secondary-foreground">
                Scan a book to add it to your library or wishlist.
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-full gap-4 text-accent-foreground">
              <div className="overflow-hidden rounded-lg">
                <DynamicPolyfill />
                <BarcodeScanner
                  onCapture={(i: BarcodeData) => getBook(i.rawValue)}
                  options={{ formats: ["ean_13"] }}
                />
              </div>
            </div>
            <div className="flex w-full justify-around gap-4">
              <Button
                variant={"secondary"}
                onClick={handleReset}
                className="w-full"
              >
                {`No, that's not right!`}
              </Button>
              <Button className="w-full" onClick={handleAdd}>
                {`Add to MyLibrary! `}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="flex flex-grow flex-wrap">
          {results ? (
            <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results
                .reduce((uniqueBooks: Bookk[], b: Bookk) => {
                  const existingBook = uniqueBooks.find(
                    (ub: Bookk) =>
                      ub.title === b.title &&
                      Array.isArray(b.authors) &&
                      Array.isArray(ub.authors) &&
                      b.authors.join("") === ub.authors.join(""),
                  );
                  if (!existingBook) {
                    uniqueBooks.push(b);
                  } else {
                    if (BigInt(b.isbn13) > BigInt(existingBook.isbn13)) {
                      uniqueBooks.splice(
                        uniqueBooks.indexOf(existingBook),
                        1,
                        b,
                      );
                    }
                  }
                  return uniqueBooks;
                }, [])
                .map((b: Bookk) => (
                  <div
                    className=""
                    key={b.isbn13}
                    onClick={() => getBook(b.isbn13)}
                  >
                    <BookSearchOverview book={b}>
                      <div
                        key={`${b.isbn13}-Selector`}
                        className="absolute top-0 flex h-full w-full select-none items-center justify-center bg-zinc-500/80 p-2 text-lg font-bold text-white opacity-0 transition-opacity duration-150 hover:cursor-pointer group-hover:opacity-100"
                      >
                        Add to library
                      </div>
                    </BookSearchOverview>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div></div>
      <MenuBar currentPage="Add" />
    </div>
  );
}
