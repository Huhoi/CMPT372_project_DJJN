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
            for (var i = 0; i < recipe_ingredients.length; i++) {
                var ingredient_name = recipe_ingredients[i].ingredient_name;
                var amount = recipe_ingredients[i].amount;
                if (isNaN(parseFloat(amount))) {
                    amount = 1;
                }
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
        
        try {
            const client = await pool.connect();

            const query1 = 'SELECT * FROM Recipes WHERE uid = $1';
            const result1 = await client.query(query1, [uid]);

            const query2 = 'SELECT * FROM recipe_ingredients';
            const result2 = await client.query(query2);

            const query3 = `
                        SELECT i.*
                        FROM inventory i
                        JOIN category c ON i.cid = c.cid
                        WHERE c.uid = $1
            `;

            const result3 = await client.query(query3, [uid]);

            client.release();
            return NextResponse.json({ recipes: result1.rows, recipe_ingredients: result2.rows, ingredients: result3.rows });

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
            const { rid, title, recipe_ingredients, instruction, last_modified, favorite } = await req.json();
            console.log({ rid, title, recipe_ingredients, instruction, last_modified, favorite })

            const query1 = 'UPDATE recipes SET recipe_name = $2, instruction = $3, last_modified = $4, favorite = $5 WHERE rid = $1';
            const client = await pool.connect();
            await client.query(query1, [rid, title, instruction, last_modified, favorite]);

            // Delete removed recipes
            // Retrieve all old recipes, compare with what's being uploaded, and remove old recipes
            const query2 = 'SELECT * FROM recipe_ingredients WHERE rid = $1';
            const result1 = await client.query(query2, [rid]);
            const old_recipe_ingredients = result1.rows;

            // Loop to find ones to be deleted
            for (const newIngredient of recipe_ingredients) {
                let found = false;
                for (const oldIngredient of old_recipe_ingredients) {
                    if (oldIngredient.ingredient_name === newIngredient.ingredient_name) {
                        found = true;
                        break;
                    }
                }
            
                if (!found) {
                    const { ingredient_name, amount, amount_type } = newIngredient;
                    const query3 = 'INSERT INTO recipe_ingredients(rid, ingredient_name, amount, amount_type) VALUES ($1, $2, $3, $4)';
                    await client.query(query3, [rid, ingredient_name, amount, amount_type]);
                }
            }            

            // Update all ingredients
            for (let i = 0; i < recipe_ingredients.length; i++) {
                var ingredient_name = recipe_ingredients[i].ingredient_name;
                var amount = recipe_ingredients[i].amount;
                if (isNaN(parseFloat(amount))) {
                    amount = 1;
                }
                var amount_type = recipe_ingredients[i].amount_type;
                
                const query4 = 'UPDATE recipe_ingredients SET amount = $2, amount_type = $3 WHERE rid = $1 AND ingredient_name = $4';
                await client.query(query4, [rid, amount, amount_type, ingredient_name]);
            }

            client.release();
            return NextResponse.json({ message: 'Recipe modified successfully' });

        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}