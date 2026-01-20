export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

// simple loading card
export function LoadingCard() {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
    </div>
  );
}

// loading for table rows
export function LoadingTable() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="border rounded p-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
