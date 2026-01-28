export default function CategoryLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="flex gap-2 mb-6">
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-4 bg-gray-200 rounded" />
        <div className="h-4 w-32 bg-gray-200 rounded" />
      </div>

      {/* Title skeleton */}
      <div className="mb-8">
        <div className="h-9 w-64 bg-gray-200 rounded mb-2" />
        <div className="h-5 w-24 bg-gray-200 rounded" />
      </div>

      {/* Subcategories skeleton */}
      <div className="mb-8">
        <div className="h-7 w-36 bg-gray-200 rounded mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="h-24 bg-gray-200 rounded mb-3" />
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-1/2 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Products section skeleton */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar skeleton */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="h-6 w-24 bg-gray-200 rounded mb-4" />
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border-t border-gray-100 pt-4 mt-4">
                <div className="h-5 w-32 bg-gray-200 rounded mb-3" />
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Products grid skeleton */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="h-10 w-48 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="aspect-square bg-gray-200" />
                <div className="p-4">
                  <div className="h-5 w-full bg-gray-200 rounded mb-2" />
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-3" />
                  <div className="h-6 w-1/2 bg-gray-200 rounded mb-3" />
                  <div className="h-9 w-full bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
