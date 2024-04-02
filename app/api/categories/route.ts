// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';


export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const { category_name, uid } = await req.json();

            try {
                const query = "INSERT INTO category (category_name, uid) VALUES ($1, $2)";
                const client = await pool.connect();
                await client.query(query, [category_name, uid]);
                client.release();
            } catch (error) {
                console.error('Error adding category: ', error);
                return NextResponse.json({ error: 'Internal server error' });
            }

            return NextResponse.json({ message: 'Category successfully added' });
        } catch (error) {
            console.log('Error getting session: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }
    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const uid = req.nextUrl.searchParams.get('uid');
        const client = await pool.connect();
        const ingredientArray = [];
        const categoryQuery = "SELECT * FROM category WHERE uid = $1"; // Get all categories for the user
        const categoryResult = await client.query(categoryQuery, [uid]);

        for (const category of categoryResult.rows) {
            const ingredientQuery = "SELECT * FROM inventory WHERE cid = $1"; // Get all ingredients for the category
            const ingredientResult = await client.query(ingredientQuery, [category.cid]);
            
            for (const ingredient of ingredientResult.rows) {
                ingredientArray.push(ingredient);
            }
        }
        return NextResponse.json({ categories: categoryResult.rows, ingredients: ingredientArray });
    } catch (error) {
        console.error('Error getting categories: ', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

export async function DELETE(req: NextRequest) {
    if (req.method === 'DELETE') {
        try {
            const cid = parseInt(req.nextUrl.searchParams.get('cid') as string);
            const client = await pool.connect();
            const query = "DELETE FROM category WHERE cid = $1";
            await client.query(query, [cid]);
            client.release();
            return NextResponse.json({ message: 'Category successfully deleted' });
        } catch (error) {
            console.error('Error deleting category: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }
    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}