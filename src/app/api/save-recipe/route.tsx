import clientPromise, { connectToDatabase } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, recipeId, title, thumbnail } = body || {};

    // Validate the incoming payload
    if (!userId || !recipeId || !title) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: userId, recipeId, title.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = await connectToDatabase();

    const result = await db.collection("saved_recipes").insertOne({
      user_id: userId,
      recipe_id: recipeId,
      title,
      thumbnail: thumbnail || null,
      saved_at: new Date(),
    });

    return new Response(
      JSON.stringify({
        message: "Recipe saved successfully.",
        id: result.insertedId,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    if ((error as any)?.code === 11000) {
      return new Response(
        JSON.stringify({ message: "Recipe already saved." }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ error: "Failed to save recipe." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  const startTime = Date.now(); // Start time for logging
  try {
    const body = await request.json();
    const { userId, recipeId } = body || {};

    // Validate the incoming payload
    if (!userId || !recipeId) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, recipeId." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Connect to MongoDB
    const db = await connectToDatabase();

    const result = await db.collection("saved_recipes").deleteOne({
      user_id: userId,
      recipe_id: recipeId,
    });

    if (result.deletedCount === 0) {
      return new Response(JSON.stringify({ error: "Recipe not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Recipe removed successfully." }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to remove recipe." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
