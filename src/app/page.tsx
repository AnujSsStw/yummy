import { fetchPreloadedData } from "@/lib/tasty-api";
import HomeClient from "@/components/HomeClient";
import { fetchTags } from "@/lib/tasty-api";
import { auth } from "@/lib/auth";
import { getUserLikes } from "../lib/getUserLikes";

export default async function Home() {
  try {
    const { popular, trending, otherSections } = await fetchPreloadedData();
    const tags = await fetchTags();
    const filteredCategories = tags.results
      .filter(
        (tag: { type: string }) =>
          tag.type === "cuisine" || tag.type === "dietary"
      )
      .map((tag: { name: any; display_name: any }) => ({
        name: tag.name,
        displayName: tag.display_name,
      }));

    const session = await auth();
    let userLikes = [];
    if (session) {
      userLikes = await getUserLikes(session.user.id);
    }

    const updatedOtherSections = otherSections.map(
      (section: { items: any[] }) => {
        return {
          ...section,
          items: section.items.map((item: { id: any; liked: any }) => {
            const isLiked = userLikes.some(
              (savedRecipe: { recipe_id: any }) =>
                savedRecipe.recipe_id === item.id
            );
            item.liked = isLiked;
            return item;
          }),
        };
      }
    );

    // Define categories for the homepage
    const categories = [
      "breakfast",
      "lunch",
      "dinner",
      "dessert",
      "vegan",
      "gluten_free",
      "quick_and_easy",
    ];

    return (
      <div>
        <HomeClient
          popular={popular}
          trending={trending}
          otherSections={updatedOtherSections}
          categories={filteredCategories}
          userLikes={userLikes}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading homepage data:", error);

    return (
      <div className="bg-white text-center p-10">
        <h1 className="text-3xl font-bold text-red-500">
          Something went wrong!
        </h1>
        <p className="text-gray-700 mt-4">
          We couldn’t load the recipes. Please refresh the page or try again
          later.
        </p>
      </div>
    );
  }
}
