"use server";

import { db } from "./db";
import { books } from "./db/schema";
import { count, sql } from "drizzle-orm";

export async function getBooks() {
  try {
    const rawData = await db.select().from(books);
    console.log(rawData);

    return rawData;
  } catch (error) {
    return { error: error };
  }
}

// export async function getBooks() {
//   return { data: [{ id: 1, title: 'Test Book' }] };
// }

export async function getStats() {
  try {
    const [sampleData] = await db
      .select({
        totalBooks: count(),
        readBooks:
          sql<number>`count(case when ${books.read} = true then 1 end)`.mapWith(
            Number,
          ),
      })
      .from(books);

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { success: true, book: newBook };
  } catch (error) {
    return { success: false, error: error };
  }
}
