// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

// Endpoint for adding a new category
// params: category_name, uid
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {

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
    }
    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}

// Endpoint for getting all categories for a user
// params: uid
// returns: list of categories (cid, category_name, uid)
export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const uid = parseInt(req.nextUrl.searchParams.get('uid') as string);
        const client = await pool.connect();
        const categoryQuery = "SELECT * FROM category WHERE uid = $1";
        const categoryResult = await client.query(categoryQuery, [uid]);

        client.release();
        return NextResponse.json({ categories: categoryResult.rows });
    } catch (error) {
        console.error('Error getting categories: ', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}

// Endpoint for deleting a category
// params: cid
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