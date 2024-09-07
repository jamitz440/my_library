// store/useBookStore.ts
import {create} from "zustand";
import { type books } from "~/server/db/schema";
import { type InferSelectModel } from "drizzle-orm";

type Book = InferSelectModel<typeof books>;

type BookStore = {
  books: Book[] | null;
  setBooks: (books: Book[]) => void;
  updateBook: (updatedBook: Book, id:number) => void; 
};

export const useBookStore = create<BookStore>((set) => ({
  books: null,
  setBooks: (books) => set({ books }),
  updateBook: (updatedBook) =>
    set((state) => ({
      books: state.books?.map((book) =>
        book.id === updatedBook.id ? {...book, ...updatedBook} : book
      ),
       
    })),
}));
