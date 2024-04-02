import { COOKIE_NAME } from "@/constants";
import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

interface JwtPayload {
  username: string;
  uid: string;
}

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);

  if (!token) {
    return NextResponse.json(
      {
        message: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const { value } = token;

  // Always check this
  const secret = process.env.JWT_SECRET || "";

  try {
    const decodedToken = await verifyAsync(value, secret) as JwtPayload; // Await the verification

    const username = decodedToken.username;
    const uid = decodedToken.uid;

    const response = {
      token: token.name,
      username: username,
      uid: uid
    };

    console.log(response);

    return NextResponse.json(response, { status: 200 }); // Return a Next.js JSON response
  } catch (e) {
    return NextResponse.json(
      {
        message: "Something went wrong",
      },
      {
        status: 400,
      }
    );
  }
}

// Wrap verify function in a promise
function verifyAsync(token: string, secret: string): Promise<JwtPayload> {
  return new Promise((resolve, reject) => {
    verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as JwtPayload);
      }
    });
  });
}