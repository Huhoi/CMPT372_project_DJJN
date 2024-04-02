import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';


export async function POST(req: NextRequest) {
    if (req.method === 'POST') {

        try {
            const { ingredient_name, expiration, amount, amount_type, cid } = await req.json();
            console.log(ingredient_name, expiration, amount, amount_type, cid);
            
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
