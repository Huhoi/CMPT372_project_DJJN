import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';


export async function POST(req: NextRequest) {
    if (req.method === 'POST') {
        try {
            const { name, expiration, amount, cid } = await req.json();

            try {
                const query = "INSERT INTO ingredient (name, expiration , amount, cid ) VALUES ($1, $2, $3, $4)";
                const client = await pool.connect();
                await client.query(query, [name, expiration, amount, cid]);
                client.release();
            } catch (error) {
                console.error('Error adding ingredient: ', error);
                return NextResponse.json({ error: 'Internal server error' });
            }

            return NextResponse.json({ message: 'Ingredient successfully added' });
        } catch (error) {
            console.log('Error getting session: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }
    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}