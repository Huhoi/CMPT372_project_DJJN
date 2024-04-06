import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, instruction, last_modified, favorite, uid } = await req.json();
            console.log({ title, instruction, last_modified, favorite, uid })

            const query = 'INSERT INTO Recipes(recipe_name, instruction, last_modified, favorite, uid) VALUES($1, $2, $3, $4, $5)';
            const client = await pool.connect();
            await client.query(query, [title, instruction, last_modified, favorite, uid]);

            client.release();
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
            const client = await pool.connect();
            const query = 'SELECT * FROM Recipes';
            
            const result = await client.query(query);

            console.log(result.rows)
            client.release();
            return NextResponse.json({ recipes: result.rows });

        } catch (error) {
            console.error("Error with getting ingredients: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}