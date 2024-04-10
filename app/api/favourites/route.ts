import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function GET(req: NextRequest, res: NextResponse) {
    if (req.method === 'GET') {
        try {
            const uid = parseInt(req.nextUrl.searchParams.get('uid') as string);
            const client = await pool.connect();
            const query = `
                SELECT r.rid, r.recipe_name
                FROM recipes r
                WHERE r.uid = $1
                    AND r.favorite = TRUE
                `;
            const result = await client.query(query, [uid]);
            client.release();
            return NextResponse.json({ recipes: result.rows });
        } catch (error) {
            console.error('Error getting recipes: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    
    }
}