import { fetchRecipeDetails, fetchTags, fetchRecipes } from "@/lib/tasty-api";
import Link from "next/link";
import { RecipeDetailsClient } from "@/components/RecipeDetailsClient";
import { auth } from "@/lib/auth";
import { getUserLikes } from "@/app/page";

export default async function RecipeDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // Extract the ID from slug-id format
  const recipeId = id.split("-").pop();

  // Fetch recipe details using the extracted ID
  const recipe = await fetchRecipeDetails(recipeId!);

  const session = await auth();
  let userLiked = false;
  if (session) {
    userLiked = (await getUserLikes(session.user.id)).some(
      (savedRecipe) => savedRecipe.recipe_id === recipe.id
    );
  }

  if (!recipe) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">
          Recipe Not Found
        </h1>
        <Link
          href="/"
          className="text-primary underline hover:text-secondary transition"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  // Fetch tags to create categories
  const tags = await fetchTags();
  const categories = tags.results
    .filter((tag) => tag.type === "cuisine" || tag.type === "dietary")
    .map((tag) => ({ name: tag.name, displayName: tag.display_name }));

  // Fetch related recipes based on the first tag of the recipe
  let relatedRecipes = [];
  if (recipe.tags && recipe.tags.length > 0) {
    const firstTag = recipe.tags[0].name; // Use the first tag name
    relatedRecipes = await fetchRecipes(firstTag, "", 0, 6); // Fetch up to 6 related recipes
  }

  return (
    <RecipeDetailsClient
      recipe={recipe}
      categories={categories}
      relatedRecipes={relatedRecipes}
      isUserSaved={userLiked}
      userId={session?.user.id}
    />
  );
}
