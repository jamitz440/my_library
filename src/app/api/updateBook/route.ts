import { NextResponse } from "next/server";
import { books } from "~/server/db/schema";
import { db } from "~/server/db";
import { type NextRequest } from "next/server";
import { eq, sql } from "drizzle-orm";

interface reqData {
  id: number;
  formData: Form;
}

type Form = {
  title: string;
  author: string;
  owned: boolean;
  read: boolean;
  rating: number;
  review: string;

};

export async function POST(request: NextRequest) {
  const req = (await request.json()) as reqData;
  console.log(req.formData.title);
  try {
    await db
      .update(books)
      .set({
        title: req.formData.title,
        authors: [req.formData.author],
        owned: req.formData.owned,
        read: req.formData.read,
        rating: req.formData.rating,
        review: req.formData.review,
        readAt: sql`CASE WHEN ${books.read} = false AND ${sql.raw(req.formData.read.toString())} = true THEN CURRENT_TIMESTAMP ELSE ${books.readAt} END`,

      })
      .where(eq(books.id, req.id));

    return new NextResponse(
      JSON.stringify({
        success: true,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({
        success: false,
      }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    );
  }
}
