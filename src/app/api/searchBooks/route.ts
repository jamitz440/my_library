import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

export async function POST(request: NextRequest) {
  console.log("searchBooks api POST requested");

  const body = await request.text();

  console.log(body);
  const strbody = body.replace(/ /g, "%20");
  const headers = {
    "Content-Type": "application/json",
    Authorization: env.NEXT_PUBLIC_ISBN_AUTH,
  };

  try {
    const res = await fetch(
      `https://api2.isbndb.com/search/books?page=1&pageSize=10&text=${strbody}`,
      {
        headers: headers,
      },
    );

    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    const data = res.json();
    console.log(data);
    return new NextResponse(JSON.stringify(await data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.log(e);
    return new NextResponse(JSON.stringify(e), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
