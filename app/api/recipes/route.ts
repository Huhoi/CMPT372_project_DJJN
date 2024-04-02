import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, instruction, last_modified, favorite, uid } = await req.json();

            const query = 'INSERT INTO Recipe(title, instruction, last_modified, favorite, uid) VALUES($1, $2, $3, $4, $5)';
            const client = await pool.connect();
            const result = await client.query(query, [title, instruction, last_modified, favorite, uid]);

        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

export async function GET(req: Request) {
    if (req.method === 'GET') {
        try {
            const query = 'SELECT * FROM Ingredient';
            const client = await pool.connect();
            const result = await client.query(query);

            return NextResponse.json(result.rows);
            
        } catch (error) {
            console.error("Error with getting ingredients: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}