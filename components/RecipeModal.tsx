"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

interface RecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RecipeModal({ isOpen, onClose }: RecipeModalProps): React.ReactElement {
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: "0", name: "", amount: "" },
  ]);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return <></>;;

  const addIngredient = (): void => {
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: "", amount: "" },
    ]);
  };

  const removeIngredient = (id: string): void => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
  };

  const updateIngredient = (
    id: string,
    field: "name" | "amount",
    value: string
  ): void => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    const validIngredients = ingredients.filter(
      (ing) => ing.name.trim() || ing.amount.trim()
    );

    if (validIngredients.length === 0) {
      setError("At least one ingredient is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          prepTime: prepTime ? parseInt(prepTime, 10) : 0,
          cookingTime: cookingTime ? parseInt(cookingTime, 10) : 0,
          ingredients: validIngredients,
          instructions: instructions.trim(),
        }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Failed to create recipe");
      }

      setTitle("");
      setPrepTime("");
      setCookingTime("");
      setIngredients([{ id: "0", name: "", amount: "" }]);
      setInstructions("");
      onClose();

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create recipe");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white">
        <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
          <h2 className="text-2xl font-bold text-gray-900">Add Recipe</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-900">
              Recipe Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g., Spaghetti Carbonara"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="prepTime" className="block text-sm font-medium text-gray-900">
                Prep Time (minutes)
              </label>
              <input
                id="prepTime"
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="10"
              />
            </div>
            <div>
              <label htmlFor="cookingTime" className="block text-sm font-medium text-gray-900">
                Cooking Time (minutes)
              </label>
              <input
                id="cookingTime"
                type="number"
                min="0"
                value={cookingTime}
                onChange={(e) => setCookingTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="20"
              />
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-900">
                Ingredients *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1"
              >
                + Add Ingredient
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient) => (
                <div key={ingredient.id} className="flex gap-3">
                  <div className="flex-1">
                    <label
                      htmlFor={`ingredient-amount-${ingredient.id}`}
                      className="sr-only"
                    >
                      Amount
                    </label>
                    <input
                      id={`ingredient-amount-${ingredient.id}`}
                      type="text"
                      value={ingredient.amount}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "amount", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="1 cup"
                    />
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor={`ingredient-name-${ingredient.id}`}
                      className="sr-only"
                    >
                      Ingredient name
                    </label>
                    <input
                      id={`ingredient-name-${ingredient.id}`}
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "name", e.target.value)
                      }
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                      placeholder="Flour"
                    />
                  </div>
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="rounded-lg bg-red-50 px-3 py-2 text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      aria-label={`Remove ${ingredient.name || "ingredient"}`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-sm font-medium text-gray-900">
              Instructions
            </label>
            <textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Step-by-step instructions..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Recipe"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
