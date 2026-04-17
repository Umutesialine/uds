import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaFilter, 
  FaTimes, 
  FaArrowLeft, 
  FaArrowRight,
  FaSpinner,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import ProductGrid from '../components/product/ProductGrid';
import clothService from '../services/clothService';

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  // Get category from URL
  const urlCategory = searchParams.get('category') || '';
  const urlStyle = searchParams.get('style') || '';
  const urlSortBy = searchParams.get('sortBy') || 'newest';
  
  // Filter states - sync with URL params
  const [filters, setFilters] = useState({
    category: urlCategory,
    style: urlStyle,
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: urlSortBy,
  });

  // ✅ Update filters when URL changes (for navbar clicks)
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      category: urlCategory,
      style: urlStyle,
      sortBy: urlSortBy,
    }));
  }, [urlCategory, urlStyle, urlSortBy]);

  // ✅ Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (filters.category) params.category = filters.category;
        if (filters.style) params.style = filters.style;
        if (filters.minPrice) params.minPrice = filters.minPrice;
        if (filters.maxPrice) params.maxPrice = filters.maxPrice;
        if (filters.inStock) params.inStock = true;
        if (filters.sortBy) params.sortBy = filters.sortBy;
        
        const response = await clothService.getAllClothes(params);
        setProducts(response);
        setTotalCount(response.length);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters.category, filters.style, filters.minPrice, filters.maxPrice, filters.inStock, filters.sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    
    // Update URL params without page refresh
    const params = {};
    const updatedFilters = { ...filters, ...newFilters };
    
    if (updatedFilters.category) params.category = updatedFilters.category;
    if (updatedFilters.style) params.style = updatedFilters.style;
    if (updatedFilters.sortBy && updatedFilters.sortBy !== 'newest') params.sortBy = updatedFilters.sortBy;
    
    setSearchParams(params, { replace: true });
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

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '' && v !== false).length;

  // Get current category for page title
  const currentCategory = filters.category || 'All';
  const categoryTitle = currentCategory === 'All' ? 'All Products' : `${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}'s Collection`;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Banner for Category */}
      <section className="relative h-64 bg-gradient-to-r from-primary to-secondary overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="relative container-custom h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            {categoryTitle}
          </h1>
          <p className="text-gray-200">
            {totalCount} products found
          </p>
          <div className="flex items-center gap-2 mt-4">
            <Link to="/" className="text-gray-300 hover:text-gold text-sm">Home</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gold text-sm">{currentCategory === 'All' ? 'Shop' : currentCategory}</span>
          </div>
        </div>
      </section>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Button and Sort */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <button
                onClick={() => setShowFilters(true)}
                className="btn-outline flex items-center gap-2"
              >
                <FaFilter /> Filters
                {activeFilterCount > 0 && (
                  <span className="bg-gold text-primary text-xs rounded-full px-2 py-0.5">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              
              <SortDropdown 
                sortBy={filters.sortBy} 
                onSortChange={(value) => handleFilterChange({ sortBy: value })} 
              />
            </div>

            {/* Desktop Sort and Results */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{products.length}</span> of <span className="font-semibold">{totalCount}</span> products
              </p>
              <SortDropdown 
                sortBy={filters.sortBy} 
                onSortChange={(value) => handleFilterChange({ sortBy: value })} 
              />
            </div>

            {/* Active Filters Tags */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.category && (
                  <FilterTag label={`Category: ${filters.category}`} onRemove={() => handleFilterChange({ category: '' })} />
                )}
                {filters.style && (
                  <FilterTag label={`Style: ${filters.style}`} onRemove={() => handleFilterChange({ style: '' })} />
                )}
                {filters.minPrice && (
                  <FilterTag label={`Min: ${filters.minPrice}`} onRemove={() => handleFilterChange({ minPrice: '' })} />
                )}
                {filters.maxPrice && (
                  <FilterTag label={`Max: ${filters.maxPrice}`} onRemove={() => handleFilterChange({ maxPrice: '' })} />
                )}
                {filters.inStock && (
                  <FilterTag label="In Stock Only" onRemove={() => handleFilterChange({ inStock: false })} />
                )}
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gold hover:text-secondary transition"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            <ProductGrid 
              products={products} 
              loading={loading}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-85 bg-white shadow-xl p-6 overflow-y-auto animate-slideInRight">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="text-gray-500">
                <FaTimes size={24} />
              </button>
            </div>
            <FilterSidebar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFilterCount={activeFilterCount}
            />
            <button
              onClick={() => setShowFilters(false)}
              className="btn-primary w-full mt-6"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Filter Sidebar Component
const FilterSidebar = ({ filters, onFilterChange, onClearFilters, activeFilterCount }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={onClearFilters} className="text-sm text-gold hover:text-secondary">
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Category</h4>
        <div className="space-y-2">
          {['women', 'men', 'kids'].map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value={cat}
                checked={filters.category === cat}
                onChange={() => onFilterChange({ category: filters.category === cat ? '' : cat })}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <span className="capitalize text-gray-700">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Style Filter */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Style</h4>
        <div className="space-y-2">
          {['Kitenge', 'modern'].map((style) => (
            <label key={style} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="style"
                value={style}
                checked={filters.style === style}
                onChange={() => onFilterChange({ style: filters.style === style ? '' : style })}
                className="w-4 h-4 text-gold focus:ring-gold"
              />
              <span className="capitalize text-gray-700">{style}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Price Range (RWF)</h4>
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
          />
        </div>
      </div>

      {/* Stock Filter */}
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => onFilterChange({ inStock: e.target.checked })}
            className="w-4 h-4 text-gold focus:ring-gold rounded"
          />
          <span className="text-gray-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );
};

// Sort Dropdown Component
const SortDropdown = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price_asc', label: 'Price: Low to High' },
    { value: 'price_desc', label: 'Price: High to Low' },
    { value: 'name_asc', label: 'Name: A to Z' },
  ];

  return (
    <select
      value={sortBy}
      onChange={(e) => onSortChange(e.target.value)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold text-sm"
    >
      {sortOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Filter Tag Component
const FilterTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
    {label}
    <button onClick={onRemove} className="text-gray-400 hover:text-red-500">
      <FaTimes size={12} />
    </button>
  </span>
);

export default Shop;