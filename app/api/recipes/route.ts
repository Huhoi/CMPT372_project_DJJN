import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, ingredients, instruction, last_modified, favorite, uid } = await req.json();

            const client = await pool.connect();
            const result = await client.query('INSERT INTO Recipe(title, instruction, last_modified, favorite, uid) VALUES($1, $2, $3, $4, $5)', [title, instruction, last_modified, favorite, uid]);
            
        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}