import { type NextRequest, NextResponse } from "next/server";
import { env } from "~/env";

interface Body  {
  title: string
  author: string
}

export async function POST(request: NextRequest) {
  console.log("searchBooks api POST requested");

  const body = await request.json() as Body;

  const strbody = body.title.replace(/ /g, "%20");
  const headers = {
    "Content-Type": "application/json",
    Authorization: env.NEXT_PUBLIC_ISBN_AUTH,
  };


  try {
    const res = await fetch(
      `https://api2.isbndb.com/search/books?author=${body.author}&text=${strbody}`,
      {
        headers: headers,
      }
      
    );


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
    return new NextResponse(JSON.stringify(e), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
