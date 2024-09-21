"use server";

import { db } from "./db";
import { books, users } from "./db/schema";
import { count, sql, eq, ne, and, gte, lte } from "drizzle-orm";
import { auth, clerkClient } from "@clerk/nextjs/server";

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

export async function getSharedWishlist(id: string) {
  try {
    const userData = await db
      .select()
      .from(users)
      .where(eq(users.wishlistLink, id));
    const user_id = userData[0]?.user_id;
    if (!user_id) {
      return { error: "No user id found" };
    }
    const rawData = await db
      .select()
      .from(books)
      .where(and(ne(books.owned, true), eq(books.user_id, user_id)));

    return rawData;
  } catch (error) {
    return { error: error };
  }
}

export async function getBooksReadPerMonth() {
  const { userId } = auth(); // Assuming you have an auth function to get the user ID

  // Calculate the date six months ago
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  try {
    const rawData = await db
      .select()
      .from(books)
      .where(
        and(
          eq(books.user_id, userId!),
          gte(books.readAt, sixMonthsAgo),
          eq(books.read, true),
        ),
      );

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

export async function getBook(id: number) {
  const book = await db.select().from(books).where(eq(books.id, id));
  return book[0];
}

export async function deleteBook(id: number) {
  const res = await db.delete(books).where(eq(books.id, id)).returning();
  if (res) {
    return { success: true };
  } else {
    return { success: false };
  }
}

export async function reserveBook(id: number, name: string) {
  const res = await db
    .update(books)
    .set({ reservedBy: name })
    .where(eq(books.id, id));

  if (res) {
    return { success: true };
  } else {
    return { success: false };
  }
}

import { randomBytes } from "crypto";
export async function checkSignIn(user_id: string) {
  const res = await db.select().from(users).where(eq(users.user_id, user_id));

  if (res.length === 0) {
    const token = randomBytes(32).toString("base64url");
    const newUser = await db.insert(users).values({
      user_id: user_id,
      onboarding: true,
      wishlistLink: token,
    });
    if (newUser) {
      return { success: true, info: "added new user to db" };
    }
  } else {
    return { success: true, info: "user found" };
  }
}

export async function getUsersName(id: string) {
  const user = await clerkClient.users.getUser(id);

  if (user) {
    return { name: user.firstName };
  } else {
    {
      error: "failed to fetch name";
    }
  }
}

export async function setTheme(theme: string, user_id: string) {
  const res = await db
    .update(users)
    .set({ theme: theme })
    .where(eq(users.user_id, user_id));
  if (res) {
    return { success: true };
  } else {
    return { success: false };
  }
}

export async function getUser(user_id: string) {
  const res = await db.select().from(users).where(eq(users.user_id, user_id));

  return res[0]!;
}
