import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  console.log("getBook api POST requested");

  const body = await request.text();

  console.log(body);

  const headers = {
    "Content-Type": "application/json",
    Authorization: env.NEXT_PUBLIC_ISBN_AUTH,
  };

  try {
    const res = await fetch(`https://api2.isbndb.com/book/${body}`, {
      headers: headers,
    });

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = res.json();

    return new NextResponse(JSON.stringify(await data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
  }
}
