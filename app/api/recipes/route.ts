import { NextRequest, NextResponse } from "next/server";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

interface Recipe {
  id: string;
  title: string;
  image: string;
  cookingTime: number;
  prepTime: number;
  ingredients: Ingredient[];
  instructions: string;
  createdAt: string;
}

let recipes: Recipe[] = [
  {
    id: "1",
    title: "Spaghetti Carbonara",
    image: "https://loremflickr.com/400/300/carbonara",
    cookingTime: 20,
    prepTime: 10,
    ingredients: [
      { id: "1-1", name: "Spaghetti", amount: "400g" },
      { id: "1-2", name: "Eggs", amount: "4" },
      { id: "1-3", name: "Bacon", amount: "200g" },
      { id: "1-4", name: "Parmesan Cheese", amount: "100g" },
    ],
    instructions:
      "Cook spaghetti according to package directions. In a bowl, whisk together eggs and grated cheese. Fry bacon until crispy, then add hot drained pasta. Quickly stir in egg mixture off heat. Season with pepper and serve immediately.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Chocolate Chip Cookies",
    image: "https://loremflickr.com/400/300/cookies",
    cookingTime: 12,
    prepTime: 15,
    ingredients: [
      { id: "2-1", name: "Butter", amount: "225g" },
      { id: "2-2", name: "Brown Sugar", amount: "200g" },
      { id: "2-3", name: "Eggs", amount: "2" },
      { id: "2-4", name: "Flour", amount: "280g" },
      { id: "2-5", name: "Chocolate Chips", amount: "340g" },
    ],
    instructions:
      "Cream together butter and sugar. Beat in eggs and vanilla. Mix in flour and baking soda. Fold in chocolate chips. Drop spoonfuls onto baking sheet and bake at 190°C for 12 minutes until golden.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Caesar Salad",
    image: "https://loremflickr.com/400/300/salad",
    cookingTime: 0,
    prepTime: 15,
    ingredients: [
      { id: "3-1", name: "Romaine Lettuce", amount: "1 head" },
      { id: "3-2", name: "Parmesan Cheese", amount: "50g" },
      { id: "3-3", name: "Croutons", amount: "100g" },
      { id: "3-4", name: "Caesar Dressing", amount: "100ml" },
    ],
    instructions:
      "Wash and chop romaine lettuce. Toss with dressing. Top with croutons and shaved parmesan cheese. Serve immediately.",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(): Promise<NextResponse<Recipe[]>> {
  return NextResponse.json(recipes);
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<Recipe | { error: string }>> {
  try {
    const body = (await request.json()) as Partial<Recipe>;

    if (!body.title || !body.title.trim()) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    if (!body.ingredients || body.ingredients.length === 0) {
      return NextResponse.json(
        { error: "At least one ingredient is required" },
        { status: 400 }
      );
    }

    const newRecipe: Recipe = {
      id: Date.now().toString(),
      title: body.title.trim(),
      image: body.image || "https://loremflickr.com/400/300/recipe",
      cookingTime: body.cookingTime || 0,
      prepTime: body.prepTime || 0,
      ingredients: body.ingredients,
      instructions: body.instructions || "",
      createdAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);
    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest
): Promise<NextResponse<{ success: boolean } | { error: string }>> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Recipe ID is required" },
        { status: 400 }
      );
    }

    const initialLength = recipes.length;
    recipes = recipes.filter((recipe) => recipe.id !== id);

    if (recipes.length === initialLength) {
      return NextResponse.json(
        { error: "Recipe not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete recipe" },
      { status: 400 }
    );
  }
}
