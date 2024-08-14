"use client";
import { useEffect } from "react";
import { useBookStore } from "~/state/bookStore";
import { type Book } from "../page";
import Image from "next/image";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";

export default function Library() {
  const bookStore = useBookStore();

  useEffect(() => {
    if (bookStore.books.length == 0) {
      bookStore.getBooks().catch((e) => console.log(e));
    }
  }, []);

  return (
    <div>
      <NavBar />
      <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {bookStore.books?.map((b) => <BookOverview book={b} key={b?.title} />)}
      </div>
      <MenuBar currentPage="Library" />
    </div>
  );
}

const BookOverview = ({ book }: { book: Book }) => {
  return (
    <div
      key={book.title}
      className="flex flex-col items-center justify-between gap-2 p-2"
    >
      <div className="relative aspect-book h-auto w-full overflow-hidden rounded-md">
        <Image className="h-auto" src={book.image} fill alt={book.title} />
      </div>
      <div className="mb-auto w-full">
        <div className="mb-auto w-auto text-sm font-bold sm:text-base md:text-lg">
          {book.title}
        </div>
        <div className="mb-auto w-auto text-xs text-zinc-400 sm:text-sm md:text-base lg:text-lg">
          {book.authors[0]}
        </div>
      </div>
    </div>
  );
};
