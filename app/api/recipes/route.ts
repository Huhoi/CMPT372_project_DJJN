import { NextRequest, NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, recipe_ingredients, instruction, last_modified, favorite, uid } = await req.json();

            // Add into recipes table
            const query1 = 'INSERT INTO Recipes(recipe_name, instruction, last_modified, favorite, uid) VALUES($1, $2, $3, $4, $5) RETURNING rid';
            const client = await pool.connect();
            const response1 = await client.query(query1, [title, instruction, last_modified, favorite, uid]);
            const rid = response1.rows[0].rid;

            // Add into recipe_ingredients relation
            for (var i = 0; i < recipe_ingredients.length - 1; i++) {
                var ingredient_name = recipe_ingredients[i].ingredient_name;
                var amount = recipe_ingredients[i].amount;
                if (isNaN(parseFloat(amount))) {
                    amount = 1;
                }
                console.log("AMOUNT: ", amount)
                var amount_type = recipe_ingredients[i].amount_type;
                
                const query2 = 'INSERT INTO recipe_ingredients(rid, ingredient_name, amount, amount_type) VALUES($1, $2, $3, $4)'
                await client.query(query2, [rid, ingredient_name, amount, amount_type]);
            }
                
            client.release();
            return NextResponse.json({ message: 'Successfully added recipe and ingredients' });

        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

export async function GET(req: NextRequest) {
    if (req.method === 'GET') {
        const uid = req.nextUrl.searchParams.get('uid') as string;
        console.log("~~~~~~~~~~~~~~\n", uid)
        try {
            const client = await pool.connect();
            const query1 = 'SELECT * FROM Recipes WHERE uid = $1';
            const result1 = await client.query(query1, [uid]);

            const query2 = 'SELECT * FROM recipe_ingredients';
            const result2 = await client.query(query2);

            client.release();
            return NextResponse.json({ recipes: result1.rows, ingredients: result2.rows });

        } catch (error) {
            console.error("Error with getting ingredients: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

export async function DELETE(req: Request) {
    if (req.method === 'DELETE') {
        try {
            const { rid, uid } = await req.json();
            const client = await pool.connect();
            const query = 'DELETE FROM Recipes WHERE rid = $1 AND uid = $2';

            const result = await client.query(query, [rid, uid]);

            if (result.rowCount === 0) {
                client.release();
                return NextResponse.json({ error: 'Recipe not found' });

            }

            client.release();

            return NextResponse.json({ message: 'Recipe deleted successfully' });
        } catch (error) {
            console.error("Error with deleting recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}

export async function PUT(req: Request) {
    if (req.method === 'PUT') {
        try {
            const { rid, title, instruction, last_modified, favorite, uid } = await req.json();

            const query = 'UPDATE Recipes SET recipe_name = $2, instruction = $3, last_modified = $4, favorite = $5 WHERE rid = $1 AND uid = $6';
            const client = await pool.connect();
            await client.query(query, [rid, title, instruction, last_modified, favorite, uid]);

            // TODO: Update ingredients

            client.release();
        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}