import { NextResponse } from "next/server";
import { books } from "~/server/db/schema";
import { db } from "~/server/db";
import { type NextRequest } from "next/server";
import { eq } from "drizzle-orm";

type Request = {
  id: number;
  formData: FormData;
};
type FormData = {
  title: string;
  author: string;
  owned: boolean;
  read: boolean;
  rating: number;
};
export async function POST(request: NextRequest) {
  const req = (await request.json()) as Request;
  console.log(req);
  try {
    await db
      .update(books)
      .set({
        title: req.formData.title,
        authors: [req.formData.author],
        owned: req.formData.owned,
        read: req.formData.read,
        rating: req.formData.rating,
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
