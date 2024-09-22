import Image from "next/image";
import React, { type ReactNode } from "react";
import { Card } from "./card";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import StarRating from "./StarRating";
import { Skeleton } from "./skeleton";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "./button";
type Book = InferSelectModel<typeof books>;

interface BookOverviewProps {
  book: Book;
  children?: ReactNode;
}

export const BookOverview = ({ book, children }: BookOverviewProps) => {
  return (
    <Card key={book.title} className="relative flex h-full flex-col gap-2 p-2">
      <div
        className={clsx(
          "group relative aspect-book w-full overflow-hidden rounded-sm rounded-e-xl",
          { "bg-black": book.read },
        )}
      >
        <Image
          className={clsx({ "opacity-70": book.read }, "z-0")}
          src={book.image ?? "/default-book-cover.jpg"}
          fill
          sizes="(max-width: 500px) 150px,
                   (max-width: 800px) 200px,
                   250px"
          alt={book.title}
        />
        {children}
        {/*<Link
          href={`/book/${book.id}`} // Change the onClick to navigate to the dynamic page
          className="absolute bottom-0 z-10 flex h-full w-full select-none items-center justify-center bg-zinc-800/80 text-2xl font-bold text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        >
          View book
        </Link>*/}
      </div>
      <div className="flex h-auto flex-col">
        <div className="flex max-w-full items-start justify-start whitespace-nowrap text-sm font-bold">
          <span className="overflow-hidden text-ellipsis">{book.title}</span>
        </div>
        <div className="w-auto text-xs text-zinc-400 sm:text-sm">
          {book.authors && book.authors.length > 0
            ? book.authors[0]
            : "Unknown Author"}
        </div>

        {book.owned && (
          <div className="mt-4 flex w-full items-center justify-center">
            <StarRating
              onSetRating={() => null}
              size={24}
              maxRating={5}
              defaultRating={book.rating!}
              dynamic={false}
            />
          </div>
        )}
        <Link href={`/book/${book.id}`}>
          <Button className={"mt-4 w-full"}>View Book </Button>
        </Link>
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
