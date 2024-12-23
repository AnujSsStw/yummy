const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // Replace with your domain

export const getUserLikes = async (userId: string) => {
  try {
    const response = await fetch(
      BASE_URL + `/api/get-saved-recipes?userId=${userId}`
    );

    if (response.ok) {
      return await response.json();
    } else {
      const errorData = await response.json().catch(() => null);
      console.error(
        "Failed to fetch user likes:",
        errorData || response.statusText
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching user likes:", error);
    return [];
  }
};
