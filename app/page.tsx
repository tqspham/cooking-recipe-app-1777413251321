import { Suspense } from "react";
import { RecipeList } from "@/components/RecipeList";
import { RecipeHeader } from "@/components/RecipeHeader";
import { RecipeListSkeleton } from "@/components/RecipeListSkeleton";

export default function Home(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gray-50">
      <RecipeHeader />
      <Suspense fallback={<RecipeListSkeleton />}>
        <RecipeList />
      </Suspense>
    </div>
  );
}
