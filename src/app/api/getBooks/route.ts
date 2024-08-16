import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { books } from "~/server/db/schema";

export async function GET() {
  console.log("getBooks api GET requested");
  try {
    const res = await db.select().from(books);
    // .where(eq(books.user_id, "user_2kZTQnYmZdIdNX7cMq3vmpT3QUe"));

    const data = JSON.stringify(res);
    
    return new NextResponse(data, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({
        success: false,
        error: err,
      }),
      { status: 405, headers: { "Content-Type": "application/json" } },
    );
  }
}
