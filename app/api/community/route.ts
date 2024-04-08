import { NextResponse } from "next/server";
import pool from '../../utils/connectDB';

export async function POST(req: Request) {
    if (req.method === 'POST') {
        try {
            const recipeData = await req.json();

            const { recipe_name, instruction, ingredients, uid, image } = recipeData;

            // Start a transaction to ensure data consistency across tables
            const client = await pool.connect();
            try {
                // Insert into Recipes table
                const recipeQuery = 'INSERT INTO recipes(recipe_name, instruction, favorite, uid, image) VALUES($1, $2, $3, $4, $5) RETURNING rid';
                const recipeResult = await client.query(recipeQuery, [recipe_name, instruction, false, uid, recipeData.image]);
                const rid = recipeResult.rows[0].rid; // Retrieve the generated recipe ID

                // Insert into Recipe_Ingredients table
                const ingredientQuery = 'INSERT INTO recipe_ingredients(rid, ingredient_name, amount, amount_type) VALUES($1, $2, $3, $4)';
                for (const ingredient of ingredients) {
                    await client.query(ingredientQuery, [rid, ingredient.name, ingredient.amount, ingredient.unitShort]);
                }

                // Commit the transaction
                await client.query('COMMIT');
                client.release();

            } catch (error) {
                // Rollback the transaction in case of error
                await client.query('ROLLBACK');
                throw error; // Rethrow the error to be caught by the outer catch block
            }
            return NextResponse.json({ message: 'Category successfully added' });
        } catch (error) {
            console.error("Error with adding recipe: ", error);
            return NextResponse.json({ error: "internal server error" });
        }
    }
    else {
        return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
    }
}


// export async function POST(req: Request) {
//     if (req.method === 'POST') {
//         try {
//             // Parse the request body as JSON
//             const recipeData = await req.json();

//             // Log the received data
//             console.log("Received recipe data:", recipeData);

//             // Respond with a success message
//             return NextResponse.json({ message: "Recipe data received successfully" });
//         } catch (error) {
//             console.error("Error with adding recipe: ", error);
//             return NextResponse.json({ error: "internal server error" });
//         }
//     } else {
//         return NextResponse.json({ error: `Method ${req.method} Not Allowed` });
//     }
// }