"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("react-barcode-scanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input";

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
import { useBookStore } from "~/state/bookStore";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { BookOverview } from "~/components/ui/BookOverview";

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

export interface Book {
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
  book: Book;
}

interface Res {
  data: Book[];
}

interface BarcodeData {
  rawValue: string;
}

interface Stats {
  books: string;
  authors: string;
}

export default function Home() {
  const [book, setBook] = useState<Book | null>();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const { toast } = useToast();
  const libraryStore = useBookStore();
  const [search, setSearch] = useState<string>("");
  const [authorSearch, setAuthorSearch] = useState<string>("");
  const [results, setResults] = useState<Book[]>();
  const [stats, setStats] = useState<Stats>();

  const { isLoaded, isSignedIn, user } = useUser();

  const getBook = async (book: string) => {
    try {
      const res = await fetch("api/getBook", { method: "POST", body: book });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as Data;

      setBook(data.book);
      setImage(data.book.image);
      setOpen(false);
      setDialog(true);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setBook(null);
    }
  };

  const handleAdd = () => {
    const res = fetch("api/addToLibrary", {
      method: "POST",
      body: JSON.stringify({ book: book, user_id: user?.id }),
    });
    toast({
      title: `Added to Library`,
      description: `${book?.title} - ${book?.authors[0]}`,
    });
    libraryStore.getBooks().catch((e) => console.log(e));
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

  interface Stats {
    books: string;
    authors: string;
  }

  useEffect(() => {
    const getStats = async () => {
      const res = await fetch("api/getStats");
      const data = (await res.json()) as Stats;
      setStats(data);
    };
    getStats().catch((e) => console.log(e));
  }, []);

  

  return (
    <div className="App">
      <NavBar />
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
        <div className="mb-4 grid w-full grid-cols-2 items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-200 py-16 text-lg">
            <div className="text-6xl font-bold">
              {stats?.books.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <div>Books to search</div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-2xl bg-zinc-200 py-16 text-lg">
            <div className="text-6xl font-bold">
              {stats?.authors.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </div>
            <div>Authors availiable</div>
          </div>
        </div>

        <div className="flex w-full items-center justify-center gap-4">
          <div className="flex w-1/2 flex-col gap-4">
            <Input
              className="w-full"
              value={search}
              placeholder="Title"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <Input
              className="w-full"
              placeholder="Author"
              value={authorSearch}
              onChange={(e) => {
                setAuthorSearch(e.target.value);
              }}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        <Dialog open={dialog}>
          <DialogContent
            onPointerDownOutside={() => {
              setDialog(false);
              setOpen(true);
            }}
          >
            <DialogClose onClick={() => setDialog(false)} />
            <DialogHeader>
              <DialogTitle>
                {search
                  ? "Add this book to your library?"
                  : "Is this the correct book?"}
              </DialogTitle>
            </DialogHeader>
            <div className="flex w-full gap-4">
              <div className="relative aspect-book h-52 w-auto overflow-hidden rounded-md">
                {book && (
                  <Image layout="fill" src={book.image} alt={book.title} />
                )}
              </div>
              <div className="flex flex-col">
                <div className="text-lg font-bold">{book?.title}</div>
                <div className="text-lg">{book?.authors}</div>
                <div className="text mt-4">
                  Published: {book?.date_published}
                </div>
                <div className="textlg">Pages: {book?.pages}</div>
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
        {
          // <SignInButton />
          // <SignOutButton />
          // <div>user id : {user?.id}</div>
          // <button onClick={() => setOpen(!open)}>Scan Book</button>
          // {open && (
          //   <BarcodeScanner
          //     onCapture={(i: BarcodeData) => getBook(i.rawValue)}
          //     options={{ formats: ["ean_13"] }}
          //   />
          // )}
        }
        <div className="flex flex-grow flex-wrap">
          {results ? (
            <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {results
                .reduce((uniqueBooks:Book[], b:Book) => {
                  const existingBook  = uniqueBooks.find(
                    (ub : Book) =>
                      ub.title === b.title &&
                      ub.authors.join("") === b.authors.join(""),
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
                .map((b : Book) => (
                  <div
                    className=""
                    key={b.isbn13}
                    onClick={() => getBook(b.isbn13)}
                  >
                    <BookOverview book={b}>
                      <div
                        key={`${b.isbn13}-Selector`}
                        className="absolute top-0 flex h-full w-full select-none items-center justify-center bg-zinc-500/80 p-2 text-lg font-bold text-white opacity-0 transition-opacity duration-150 hover:cursor-pointer group-hover:opacity-100"
                      >
                        Add to library
                      </div>
                    </BookOverview>
                  </div>
                ))}
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <MenuBar currentPage="Home" />
    </div>
  );
}
