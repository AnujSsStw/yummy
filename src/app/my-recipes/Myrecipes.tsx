"use client";
import { RecipeCard } from "@/components/RecipeCard";
import { useSession } from "next-auth/react";
import { Key, useEffect, useState } from "react";

export const MyRecipes = ({
  UserRecipes,
  userId,
}: {
  UserRecipes: any;
  userId: string;
}) => {
  const [recipes, setRecipes] = useState(UserRecipes);

  // Handle recipe deletion
  const handleDelete = async (recipeId: any) => {
    try {
      const response = await fetch("/api/delete-saved-recipe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, recipeId }),
      });

      if (response.ok) {
        setRecipes(
          recipes.filter(
            (recipe: { recipe_id: any }) => recipe.recipe_id !== recipeId
          )
        );
        console.log("Recipe removed successfully");
      } else {
        console.error("Failed to remove recipe.");
      }
    } catch (error) {
      console.error("Error removing recipe:", error);
    }
  };

  return (
    <main className="flex-1 p-6">
      <h1 className="text-3xl font-bold mb-6">My Saved Recipes</h1>
      {recipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {recipes.map(
            (
              recipe: { recipe_id: string; title: string; thumbnail: any },
              idx: Key | null | undefined
            ) => (
              <div key={idx} className="relative">
                <RecipeCard
                  id={recipe.recipe_id}
                  title={recipe.title}
                  thumbnail={
                    recipe.thumbnail || "https://via.placeholder.com/300x200"
                  }
                  removeFromList={(id) => {
                    setRecipes(
                      recipes.filter(
                        (recipe: { recipe_id: string }) =>
                          recipe.recipe_id !== id
                      )
                    );
                  }}
                  isLiked={true}
                />
                <button
                  onClick={() => handleDelete(recipe.recipe_id)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow hover:bg-red-600 transition"
                  aria-label="Remove Recipe"
                >
                  &#x2715; {/* Cross icon */}
                </button>
              </div>
            )
          )}
        </div>
      ) : (
        <p>You have no saved recipes yet.</p>
      )}
    </main>
  );
};
