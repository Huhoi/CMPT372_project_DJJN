import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const { title, ingredients, instruction, last_modified, favorite, uid } = await req.json();

            // Add into recipes table
            const query1 = 'INSERT INTO Recipes(recipe_name, instruction, last_modified, favorite, uid) VALUES($1, $2, $3, $4, $5)';
            const client = await pool.connect();
            await client.query(query1, [title, instruction, last_modified, favorite, uid]);

            // // Add into recipe_ingredients relation
            // ingredients.forEach(ingredient => {
            //     var query2 = 'INSERT INTO recipe_ingredients(rid, ingredient_name, amount, amount_type)'
            // });
            // const query2 = 'INSERT INTO '

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

export async function GET(req: Request) {
    if (req.method === 'GET') {
        try {
            const client = await pool.connect();
            const query = 'SELECT * FROM Recipes';
            
            const result = await client.query(query);

            client.release();
            return NextResponse.json({ recipes: result.rows });

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