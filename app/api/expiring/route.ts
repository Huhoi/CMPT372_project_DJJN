// app/api/expiring/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

// Endpoint to get user's ingredients that are expiring within a week
// params: uid
// returns: list of ingredients (iid, ingredient_name, expiration, amount, amount_type, cid, category_name)
export async function GET(req: NextRequest, res: NextResponse) {
    const uid: number = parseInt(req.nextUrl.searchParams.get('uid') as string);
    try {
        
        const client = await pool.connect();

        // Get all ingredients for the category if expiration is within a week
        const ingredientQuery = `
            SELECT i.*, c.category_name 
            FROM inventory i
            JOIN category c ON i.cid = c.cid
            WHERE c.uid = $1
                AND expiration BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
                AND i.amount > 0
            ORDER BY i.expiration ASC
            `;
        const ingredientResult = await client.query(ingredientQuery, [uid]);
        client.release();

        return NextResponse.json({ ingredients: ingredientResult.rows });
    } catch (error) {
        console.error('Error getting expiring ingredients: ', error);
        return NextResponse.json({ error: 'Internal server error' });
    }
}