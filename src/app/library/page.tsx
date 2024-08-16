"use client";
import { useEffect } from "react";
import { useBookStore } from "~/state/bookStore";
import { MenuBar } from "~/components/ui/MenuBar";
import { NavBar } from "~/components/ui/NavBar";
import { BookOverview } from "~/components/ui/BookOverview";

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
      <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-4">
      <div className="mb-16 grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {bookStore.books?.map((b) => <BookOverview book={b} key={b?.isbn13} />)}
      </div>
      </div>
      <MenuBar currentPage="Library" />
    </div>
  );
}
