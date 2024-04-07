import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const uid: number = parseInt(req.nextUrl.searchParams.get('uid') as string);
        const client = await pool.connect();

        // Get all ingredients for the category if expiration is within a week
        const ingredientQuery = `
            SELECT i.*, c.category_name 
            FROM inventory i
            JOIN category c ON i.cid = c.cid
            WHERE c.uid = $1
                AND expiration BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
            ORDER BY i.expiration ASC
            `;
        const ingredientResult = await client.query(ingredientQuery, [uid]);
        client.release();

        return NextResponse.json({ ingredients: ingredientResult.rows });
    } catch (error) {
        console.error('Error getting categories: ', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}