import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import pool from '../../utils/connectDB';
import { getSession } from '@/app/utils/actions';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, ingredients, instruction, favorite, uid } = await req.json();
            console.log("Added recipe: ", title, instruction, favorite, uid );

            const client = await pool.connect();
            const result = await client.query('INSERT INTO Recipe(title, instruction, favorite, uid) VALUES($1, $2, $3, $4)', [title, instruction, favorite, uid]);

            return NextResponse.json({ message: 'Recipe successfully added' });
            
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

            const result1 = await client.query('SELECT * FROM Ingredient');
            const ingredients = result1.rows;

            const result2 = await client.query('SELECT * From Recipe');
            const recipes = result2.rows;

            const data = {ingredients, recipes};

            await client.release();

            return NextResponse.json(data);
        } catch (error) {
            console.error("Error with getting ingredients: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

export async function DELETE(req: Request) {
    try {
        const { rid, uid } = await req.json();

        const client = await pool.connect();
        const result = client.query('DELETE FROM Recipe WHERE rid = $1 AND uid = $2', [rid, uid]);

        await client.release();
        return NextResponse.json({ message: 'Recipe successfully deleted' });
    } catch (error) {
        console.error('Error with DELETE', error)
    }
}