// app/api/hello/route.js 

import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

// To handle a GET request to /api
export async function GET() {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World from hello route" }, { status: 200 });
}

// To handle a POST request to /api
export async function POST() {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

export default function test(req: NextApiRequest, res: NextApiResponse) {
  res.json({hello: 'world', method: req.method })
}

// Same logic to add a `PATCH`, `DELETE`...