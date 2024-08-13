import { create } from "zustand";
import type { Book } from "~/app/page";

type BookState = {
  books: Book[];
  getBooks: () => Promise<void>;
};
export const useBookStore = create<BookState>((set) => ({
  books: [],
  getBooks: async () => {
    const response = await fetch("api/getBooks", { method: "GET" });
    const data = (await response.json()) as Book[];
    set((state) => ({ ...state, books: data }));
  },
}));
