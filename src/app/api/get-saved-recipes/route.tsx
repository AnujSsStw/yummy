import { connectToDatabase } from "@/lib/mongodb";

export async function GET(request: Request): Promise<Response> {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId"); // Retrieve the 'userId' query param
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing required parameter: userId." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const db = await connectToDatabase();

    // Start MongoDB query timer
    const savedRecipes = await db
      .collection("saved_recipes")
      .find({ user_id: userId })
      .project({ recipe_id: 1, title: 1, thumbnail: 1 }) // Fetch only necessary fields
      // .limit(20) // Limit results
      .toArray();

    return new Response(JSON.stringify(savedRecipes), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Internal Server Error. Please try again later.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
