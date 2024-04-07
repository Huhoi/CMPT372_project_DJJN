import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

// Endpoint for getting all ingredients for a user
// params: uid
// returns: list of ingredients (iid, ingredient_name, expiration, amount, amount_type, cid)
export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method === 'GET') {
        try {
            const uid = parseInt(req.nextUrl.searchParams.get('uid') as string);
            const client = await pool.connect();
            const query = `
                SELECT i.*
                FROM inventory i
                JOIN category c ON i.cid = c.cid
                WHERE c.uid = $1
                `;
            const result = await client.query(query, [uid]);
            client.release();
            return NextResponse.json({ ingredients: result.rows });
        } catch (error) {
            console.error('Error getting ingredients: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    
    }
}

// Endpoint for adding a new ingredient
// params: ingredient_name, expiration, amount, amount_type, cid
export async function POST(req: NextRequest) {
    if (req.method === 'POST') {

        try {
            const { ingredient_name, expiration, amount, amount_type, cid } = await req.json();
            const query = "INSERT INTO inventory (ingredient_name, expiration, amount, cid, amount_type ) VALUES ($1, $2, $3, $4, $5)";

            const client = await pool.connect();
            await client.query(query, [ingredient_name, expiration, amount, cid, amount_type]);
            
            client.release();

        } catch (error) {
            console.error('Error adding ingredient: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }

        return NextResponse.json({ message: 'Ingredient successfully added' });
    }

    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}

// Endpoint for updating an ingredient
// params: iid
export async function DELETE(req: NextRequest) {
    if (req.method === 'DELETE') {
        try {
            const iid = parseInt(req.nextUrl.searchParams.get('iid') as string);
            const client = await pool.connect();
            const query = "DELETE FROM inventory WHERE iid = $1";
            await client.query(query, [iid]);
            client.release();
        } catch (error) {
            console.error('Error deleting ingredient: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }

        return NextResponse.json({ message: 'Ingredient successfully deleted' });
    } else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}
