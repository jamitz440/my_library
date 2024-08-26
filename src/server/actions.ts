"use server";

import { db } from "./db";
import { books } from "./db/schema";
import { count, sql, eq, ne, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getLibrary() {
  const { userId } = auth();
  try {
    const rawData = await db
      .select()
      .from(books)
      .where(and(eq(books.owned, true), eq(books.user_id, userId!)));

    return rawData;
  } catch (error) {
    return { error: error };
  }
}
export async function getWishlist() {
  const { userId } = auth();
  try {
    const rawData = await db
      .select()
      .from(books)
      .where(and(ne(books.owned, true), eq(books.user_id, userId!)));

    return rawData;
  } catch (error) {
    return { error: error };
  }
}

// export async function getBooks() {
//   return { data: [{ id: 1, title: 'Test Book' }] };
// }

export async function getStats() {
  const { userId } = auth();
  try {
    const [sampleData] = await db
      .select({
        totalBooks: count(),
        readBooks:
          sql<number>`count(case when ${books.read} = true then 1 end)`.mapWith(
            Number,
          ),
      })
      .from(books)
      .where(and(eq(books.user_id, userId!), eq(books.owned, true)));

    return JSON.stringify(sampleData); // Return as a plain object, not a string
  } catch (error) {
    return { error: "An error occurred while fetching statistics." };
  }
}

export async function addBook({
  title,
  user_id,
  authors,
  pages,
  published,
  synopsis,
  image,
  read,
  owned,
  subjects,
}: {
  title: string;
  user_id: string;
  authors: string[];
  pages: number;
  published: string;
  synopsis: string;
  image: string;
  read: boolean;
  owned: boolean;
  subjects: string[];
}) {
  try {
    const newBook = await db.insert(books).values({
      title,
      user_id,
      authors,
      pages,
      published,
      synopsis,
      image,
      read,
      owned,
      subjects,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, book: newBook };
  } catch (error) {
    return { success: false, error: error };
  }
}
