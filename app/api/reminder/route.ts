// app/api/account/reminder.ts
import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';
import { fetchData } from '@/app/utils/functions';

// To handle a GET request to /api/account
// export async function GET(req: NextRequest, res: NextResponse) {
//     try {
//         const uid = parseInt(req.nextUrl.searchParams.get('uid') as string);
//         const client = await pool.connect();
//         const ingredientArray = [];
//         const categoryQuery = "SELECT * FROM category WHERE uid = $1"; // Get all categories for the user
//         const categoryResult = await client.query(categoryQuery, [uid]);

//         for (const category of categoryResult.rows) {
//             const ingredientQuery = "SELECT * FROM inventory WHERE cid = $1"; // Get all ingredients for the category
//             const ingredientResult = await client.query(ingredientQuery, [category.cid]);

//             for (const ingredient of ingredientResult.rows) {
//                 ingredient.amount = parseFloat(ingredient.amount); // For some reason, postgres returns amount as a string
//                 ingredientArray.push(ingredient);
//             }
//         }
//         client.release();
//         return NextResponse.json({ categories: categoryResult.rows, ingredients: ingredientArray });
//     } catch (error) {
//         console.error('Error getting categories: ', error);
//         return NextResponse.json({ error: 'Internal server error' });
//     }
// }
