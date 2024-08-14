"use client";
import Image from "next/image";
import type { Book } from "~/app/page";

export const BookOverview = ({ book }: { book: Book }) => {
  return (
    <div
      key={book.title}
      className="flex flex-col items-center justify-between gap-2 p-2"
    >
      <div className="relative aspect-book h-auto w-full overflow-hidden rounded-md">
        <Image
          className="h-auto"
          src={book.image}
          layout="fill"
          alt={book.title}
        />
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
