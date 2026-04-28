"use client";

export function LoadingSpinner(): React.ReactElement {
  return (
    <div className="inline-flex items-center gap-2">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
      <span className="text-gray-600">Loading recipes...</span>
    </div>
  );
}
