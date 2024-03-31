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

export async function GET(req: NextRequest) {
    try {
        const uid = req.nextUrl.searchParams.get('uid');
        const client = await pool.connect();
        const ingredientArray = [];
        const categoryQuery = "SELECT * FROM category WHERE uid = $1"; // Get all categories for the user
        const categoryResult = await client.query(categoryQuery, [uid]);

        for (const category of categoryResult.rows) {
            const ingredientQuery = "SELECT * FROM ingredient WHERE cid = $1"; // Get all ingredients for the category
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

// To handle a DELETE request to /api/account/
export async function DELETE(req: Request) {

    if (req.method === 'DELETE') {
        try {
            const { cid } = await req.json();
            console.log(cid)

            if (!cid) {
                return NextResponse.json({ error: 'Category ID is required' });
            }

            const client = await pool.connect();
            const result = await client.query('DELETE FROM category WHERE cid = $1', [cid]);

            // Check if the user was deleted
            if (result.rowCount === 0) {
                client.release();
                return NextResponse.json({ error: 'Category not found' });

            }
            
            // Release client
            client.release();

            // Return success message
            return NextResponse.json({ message: 'Category deleted successfully' });
        } catch (error) {
            console.error('Error deleting user:', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    } else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}