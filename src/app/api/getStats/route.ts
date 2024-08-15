import { NextResponse } from "next/server"
import { env } from "~/env";

export async function GET(){
    try{
        const headers = {
            "Content-Type": "application/json",
            Authorization: env.NEXT_PUBLIC_ISBN_AUTH,
          };
        const res = await fetch('https://api2.isbndb.com/stats', {headers:headers})
        const data = await res.json()
        console.log(await data)
        return new NextResponse(JSON.stringify(data), {status:200, headers:{'Content-Type':'application/json'}})
    }catch(err){
        console.log(err)
        return new NextResponse(JSON.stringify({success:false, error:err}), {status:405, headers:{'Content-Type':'application/json'}})
    }
    }
