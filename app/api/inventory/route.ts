import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';


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
