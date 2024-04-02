import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';


export async function POST(req: NextRequest) {
    if (req.method === 'POST') {

        try {
            const { ingredient_name, expiration, amount, uid } = await req.json();
            
            const query = "INSERT INTO ingredient (ingredient_name, expiration , amount, uid ) VALUES ($1, $2, $3, $4)";
            const client = await pool.connect();
            await client.query(query, [ingredient_name, expiration, amount, uid]);
            
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
