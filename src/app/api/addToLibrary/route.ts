import { NextResponse } from "next/server";
import { books } from "~/server/db/schema";
import { db } from "~/server/db";
import { NextRequest } from "next/server";
import { Book } from "~/app/page";

interface BookData {
  book: Book;
  user_id: string;
}

export async function POST(request: NextRequest) {
  const req = (await request.json()) as BookData;
  console.log(req.book.title);

  try {
    await db.insert(books).values({
      title: req.book.title,
      user_id: req.user_id,
      authors: req.book.authors,
      pages: req.book.pages,
      image: req.book.image,
      published: req.book.date_published,
      synopsis: req.book.synopsis,
    });
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
