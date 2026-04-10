import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductGrid from '../components/product/ProductGrid';
import FilterSidebar from '../components/shop/FilterSidebar';
import useCloth from '../hooks/useCloth';
import { FaFilter, FaSpinner } from 'react-icons/fa';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    style: searchParams.get('style') || '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: 'newest',
  });

  const { loading, products, total, fetchClothes } = useCloth();

  useEffect(() => {
    fetchClothes(filters);
  }, [filters, fetchClothes]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update URL params
    const params = {};
    if (newFilters.category) params.category = newFilters.category;
    if (newFilters.style) params.style = newFilters.style;
    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setFilters({
      category: '',
      style: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div className="container-custom py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block lg:w-80">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(true)}
              className="btn-outline w-full flex items-center justify-center gap-2"
            >
              <FaFilter /> Filter Products
            </button>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Found ${total} products`}
            </p>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <FaSpinner className="animate-spin text-gold text-4xl" />
            </div>
          ) : (
            <ProductGrid products={products} loading={loading} />
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto animate-slideInRight">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500">
                ✕
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full mt-4"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;