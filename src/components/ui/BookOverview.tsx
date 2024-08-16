"use client";
import Image from "next/image";
import type { Book } from "~/app/page";
import { type ReactNode } from "react";

export const BookOverview = ({ book, children }: { book: Book, children? :ReactNode }) => {
  console.log(book)
  return (
    <div
      key={book.title}
      className="flex flex-col items-center justify-between gap-2 p-2 relative"
    >
      <div className="group relative aspect-book h-auto w-full overflow-hidden rounded-sm rounded-e-xl">
        <Image
          className="h-auto "
          src={`${book.image}`}
          layout="fill"
          alt={book.title}
        />
        {children}
      </div>
      <div className="mb-auto w-full">
        <div className="mb-auto w-auto text-sm font-bold sm:text-base md:text-lg">
          {book.title}
        </div>
        <div className="mb-auto w-auto text-xs text-zinc-400 sm:text-sm md:text-base lg:text-lg">
          {book.isbn13}
        </div>
      </div>
      
    </div>
  );
};
