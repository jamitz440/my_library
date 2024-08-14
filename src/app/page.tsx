"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const BarcodeScanner = dynamic(
  () => import("react-barcode-scanner").then((mod) => mod.BarcodeScanner),
  { ssr: false },
);
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
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

interface BarcodeData {
  rawValue: string;
}

export default function Home() {
  const [book, setBook] = useState<Book | null>();
  const [image, setImage] = useState("");
  const [open, setOpen] = useState(false);
  const [dialog, setDialog] = useState(false);
  const [library, setLibrary] = useState<Book[]>([]);
  const { toast } = useToast();
  const libraryStore = useBookStore();

  const { isLoaded, isSignedIn, user } = useUser();

  const getBook = async (book: string) => {
    try {
      const res = await fetch("api/getBook", { method: "POST", body: book });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = (await res.json()) as Data;

      console.log(data);

      setBook(data.book);
      setImage(data.book.image);
      setOpen(false);
      setDialog(true);
    } catch (error) {
      console.error("Failed to fetch book data:", error);
      setBook(null);
    }
  };

  useEffect(() => {
    libraryStore.getBooks().catch((e) => {
      console.log(e);
    });
    setLibrary(libraryStore.books);
  }, [library]);

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

  return (
    <div className="App">
      <NavBar />

      <Dialog open={dialog}>
        <DialogContent
          onPointerDownOutside={() => {
            setDialog(false);
            setOpen(true);
          }}
        >
          <DialogClose onClick={() => setDialog(false)} />
          <DialogHeader>
            <DialogTitle> Is this the correct book? </DialogTitle>
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
              <div className="text mt-4">Published: {book?.date_published}</div>
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
              {`That's the one! `}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <SignInButton />
      <SignOutButton />
      <div>user id : {user?.id}</div>
      <button onClick={() => setOpen(!open)}>Scan Book</button>
      {open && (
        <BarcodeScanner
          onCapture={(i: BarcodeData) => getBook(i.rawValue)}
          options={{ formats: ["ean_13"] }}
        />
      )}
      <MenuBar currentPage="Home" />
    </div>
  );
}
