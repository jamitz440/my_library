import { NextResponse } from "next/server";
import { env } from "~/env";
import { db } from "~/server/db";
import { count, eq, sql } from "drizzle-orm";
import { books } from "~/server/db/schema";

interface Stats {
  readBooks: number;
  totalBooks: number;
}

export async function GET() {
  try {
    // const headers = {
    //     "Content-Type": "application/json",
    //     Authorization: env.NEXT_PUBLIC_ISBN_AUTH,
    //   };
    // const res = await fetch('https://api2.isbndb.com/stats', {headers:headers})
    // const data = await res.json() as Stats

    // const res = await db
    //   .select({ count: count() })
    //   .from(books)
    //   .where(eq(books.read, true));

    const res: Stats[] = await db
      .select({
        totalBooks: count(),
        readBooks:
          sql<number>`count(case when ${books.read} = true then 1 end)`.mapWith(
            Number,
          ),
      })
      .from(books);

    const [result] = res;
    console.log(
      `Total books: ${result.totalBooks}, Read books: ${result.readBooks}`,
    );

    return new NextResponse(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(JSON.stringify({ success: false, error: err }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }
}
