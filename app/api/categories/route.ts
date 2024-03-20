// app/api/categories/route.ts
import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';


export async function POST(req: Request) {
    if (req.method === 'POST'){
        try {
            const { category_name, uid } = await req.json();
            console.log(category_name, uid);
            return NextResponse.json({ message: 'Category successfully added' });
        } catch (error) {
            console.log('Error getting session: ', error);
            return NextResponse.json({ error: 'Internal server error' });
        }
    }
    else {
        return NextResponse.json({ error: 'Method not allowed' });
    }
}