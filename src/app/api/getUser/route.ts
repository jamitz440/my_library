import { type NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET(request: NextRequest) {
  console.log("getBooks api GET requested");
  try {
    const user = await currentUser();
    const data = JSON.stringify(user);
    console.log(data);
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
