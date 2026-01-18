import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/home/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid3X3, LayoutList, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";

interface ColorOption {
  name: string;
  name_ar: string;
  hex: string;
}

interface Product {
  id: string;
  name: string;
  name_ar: string;
  price: number;
  original_price: number | null;
  image_url: string;
  images: string[] | null;
  category_id: string;
  is_featured: boolean;
  sku: string | null;
  length: string | null;
  length_ar: string | null;
  material: string | null;
  material_ar: string | null;
  sizes: string[] | null;
  colors: ColorOption[] | null;
  sales_count: number | null;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  name_ar: string;
}

interface FilterOption {
  id: string;
  type: string;
  value: string;
  name: string;
  name_ar: string;
  display_order: number;
  is_active: boolean;
}

interface FilterSetting {
  id: string;
  filter_key: string;
  name: string;
  name_ar: string;
  display_order: number;
  is_active: boolean;
}

type SortOption = 'popularity' | 'newest' | 'price_asc' | 'price_desc';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableSizes, setAvailableSizes] = useState<FilterOption[]>([]);
  const [availableColors, setAvailableColors] = useState<FilterOption[]>([]);
  const [filterSettings, setFilterSettings] = useState<FilterSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { t, isRTL } = useLanguage();

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedLength, setSelectedLength] = useState<string>("all");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Extract unique lengths and materials from products
  const { lengths, materials, maxPrice } = useMemo(() => {
    const lengthsSet = new Set<string>();
    const materialsSet = new Set<string>();
    let max = 0;

    products.forEach(p => {
      if (p.length) lengthsSet.add(p.length);
      if (p.material) materialsSet.add(p.material);
      if (p.price > max) max = p.price;
    });

    return {
      lengths: Array.from(lengthsSet),
      materials: Array.from(materialsSet),
      maxPrice: Math.max(max, 1000)
    };
  }, [products]);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchFilterOptions();
    fetchFilterSettings();
    
    const categoryFromUrl = searchParams.get("category");
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name_ar');
    
    if (!error && data) {
      setCategories(data);
    }
  };

  const fetchFilterOptions = async () => {
    const { data, error } = await supabase
      .from('filter_options')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (!error && data) {
      setAvailableSizes(data.filter(f => f.type === 'size'));
      setAvailableColors(data.filter(f => f.type === 'color'));
    }
  };

  const fetchFilterSettings = async () => {
    const { data, error } = await supabase
      .from('filter_settings')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (!error && data) {
      setFilterSettings(data);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (!error && data) {
      setProducts(data as unknown as Product[]);
    }
    setLoading(false);
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(query) ||
        p.name_ar?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.length?.toLowerCase().includes(query) ||
        p.length_ar?.toLowerCase().includes(query) ||
        p.material?.toLowerCase().includes(query) ||
        p.material_ar?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category_id?.toString() === selectedCategory);
    }

    // Size filter
    if (selectedSizes.length > 0) {
      result = result.filter(p => 
        p.sizes && selectedSizes.some(size => p.sizes?.includes(size))
      );
    }

    // Color filter
    if (selectedColors.length > 0) {
      result = result.filter(p => 
        p.colors && selectedColors.some(hex => p.colors?.some(c => c.hex === hex))
      );
    }

    // Price filter
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Length filter
    if (selectedLength !== 'all') {
      result = result.filter(p => p.length === selectedLength);
    }

    // Material filter
    if (selectedMaterial !== 'all') {
      result = result.filter(p => p.material === selectedMaterial);
    }

    // Sorting
    switch (sortBy) {
      case 'popularity':
        result.sort((a, b) => (b.sales_count || 0) - (a.sales_count || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedSizes, selectedColors, priceRange, selectedLength, selectedMaterial, sortBy]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange([0, maxPrice]);
    setSelectedLength("all");
    setSelectedMaterial("all");
    setSearchParams({});
  };

  const activeFiltersCount = [
    searchQuery.trim() ? 1 : 0,
    selectedCategory !== 'all' ? 1 : 0,
    selectedSizes.length,
    selectedColors.length,
    selectedLength !== 'all' ? 1 : 0,
    selectedMaterial !== 'all' ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  // Helper to check if a filter is enabled
  const isFilterEnabled = (key: string) => filterSettings.some(f => f.filter_key === key);

  // Render filter by key
  const renderFilter = (key: string) => {
    switch (key) {
      case 'search':
        return (
          <div key={key} className="space-y-2">
            <Label>{isRTL ? 'البحث' : 'Search'}</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={isRTL ? 'ابحث بالاسم، SKU، الماركة...' : 'Search by name, SKU, brand...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        );
      case 'category':
        return (
          <div key={key} className="space-y-2">
            <Label>{t('categories')}</Label>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('allCategories')}</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {isRTL ? cat.name_ar : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      case 'size':
        if (availableSizes.length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm">{isRTL ? 'المقاسات' : 'Sizes'}</Label>
            <div className="border border-border rounded-lg bg-background">
              <div 
                className="px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  if (content) {
                    content.classList.toggle('hidden');
                  }
                }}
              >
                <span className="text-muted-foreground">
                  {selectedSizes.length > 0 
                    ? `${selectedSizes.length} ${isRTL ? 'مقاس محدد' : 'selected'}`
                    : (isRTL ? 'اختر المقاسات' : 'Select sizes')
                  }
                </span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              <div className="border-t border-border max-h-48 overflow-y-auto">
                {availableSizes.map((size) => (
                  <div
                    key={size.id}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-accent cursor-pointer"
                    onClick={() => {
                      setSelectedSizes(prev => 
                        prev.includes(size.value) ? prev.filter(s => s !== size.value) : [...prev, size.value]
                      );
                    }}
                  >
                    <Checkbox 
                      checked={selectedSizes.includes(size.value)}
                      className="pointer-events-none"
                    />
                    <span className="text-sm">{size.value}</span>
                  </div>
                ))}
                {selectedSizes.length > 0 && (
                  <div className="border-t border-border p-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-xs text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSizes([]);
                      }}
                    >
                      {isRTL ? 'مسح الكل' : 'Clear all'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'color':
        if (availableColors.length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <Label className="text-sm">{isRTL ? 'الألوان' : 'Colors'}</Label>
            <div className="flex flex-wrap gap-1.5">
              {availableColors.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  className={`w-5 h-5 rounded-full border transition-all ${
                    selectedColors.includes(color.value) 
                      ? 'border-primary ring-1 ring-primary ring-offset-1' 
                      : 'border-border'
                  }`}
                  style={{ backgroundColor: color.value }}
                  onClick={() => {
                    setSelectedColors(prev =>
                      prev.includes(color.value) ? prev.filter(c => c !== color.value) : [...prev, color.value]
                    );
                  }}
                  title={isRTL ? color.name_ar : color.name}
                />
              ))}
            </div>
          </div>
        );
      case 'price':
        return (
          <div key={key} className="space-y-2">
            <Label>{isRTL ? 'نطاق السعر' : 'Price Range'}</Label>
            <Slider
              min={0}
              max={maxPrice}
              step={10}
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              className="mt-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground mt-2">
              <span>{priceRange[0]} {t('egp')}</span>
              <span>{priceRange[1]} {t('egp')}</span>
            </div>
          </div>
        );
      case 'length':
        return (
          <div key={key} className="space-y-2">
            <Label>{isRTL ? 'الطول' : 'Length'}</Label>
            <Select value={selectedLength} onValueChange={setSelectedLength}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                <SelectItem value="short">{isRTL ? 'قصير' : 'Short'}</SelectItem>
                <SelectItem value="long">{isRTL ? 'طويل' : 'Long'}</SelectItem>
                <SelectItem value="maxi">{isRTL ? 'ماكسي' : 'Maxi'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case 'material':
        if (materials.length === 0) return null;
        return (
          <div key={key} className="space-y-2">
            <Label>{isRTL ? 'النوع' : 'Type'}</Label>
            <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{isRTL ? 'الكل' : 'All'}</SelectItem>
                {materials.map((material) => (
                  <SelectItem key={material} value={material}>
                    {material}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      default:
        return null;
    }
  };

  const FiltersContent = () => (
    <div className="space-y-6">
      {filterSettings.map((setting) => renderFilter(setting.filter_key))}

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="w-4 h-4 mr-2" />
          {isRTL ? 'مسح الفلاتر' : 'Clear Filters'} ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Page Header */}
        <div className="bg-secondary py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-foreground mb-2">
              {t('shop')}
            </h1>
            <p className="text-secondary-foreground/80">
              {isRTL ? 'اكتشف مجموعتنا الواسعة من المنتجات' : 'Discover our wide range of products'}
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Top Bar - Sort & Mobile Filter */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">
                {filteredProducts.length} {isRTL ? 'منتج' : 'products'}
              </span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary">{activeFiltersCount} {isRTL ? 'فلتر' : 'filters'}</Badge>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">{isRTL ? 'الأكثر شعبية' : 'Most Popular'}</SelectItem>
                  <SelectItem value="newest">{t('newest')}</SelectItem>
                  <SelectItem value="price_asc">{t('priceLowToHigh')}</SelectItem>
                  <SelectItem value="price_desc">{t('priceHighToLow')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="md:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    {t('filters')}
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side={isRTL ? "right" : "left"} className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>{t('filters')}</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Filters Sidebar - Sticky with custom scrollbar */}
            <aside className="hidden md:block w-56 flex-shrink-0">
              <div className="sticky top-20 bg-card rounded-lg shadow-soft max-h-[calc(100vh-6rem)] overflow-hidden flex flex-col">
                <h3 className="font-semibold text-sm p-3 pb-2 border-b border-border">{t('filters')}</h3>
                <div className="p-3 pt-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
                  <FiltersContent />
                </div>
              </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('loading')}</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('noResults')}</p>
                  {activeFiltersCount > 0 && (
                    <Button variant="link" onClick={clearFilters} className="mt-2">
                      {isRTL ? 'مسح الفلاتر' : 'Clear filters'}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={isRTL ? product.name_ar : product.name}
                      price={product.price}
                      originalPrice={product.original_price || undefined}
                      image={product.image_url}
                      images={product.images}
                      badge={product.is_featured ? (isRTL ? "مميز" : "Featured") : undefined}
                      sizes={product.sizes}
                      colors={product.colors}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Shop;