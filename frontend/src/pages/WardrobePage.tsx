import { useState, useEffect, useCallback } from "react";
import { Plus, Shirt } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SearchInput } from "@/components/shared/SearchInput";
import { EmptyState } from "@/components/shared/EmptyState";
import { CategoryFilter } from "@/components/wardrobe/CategoryFilter";
import { ClothingGrid } from "@/components/wardrobe/ClothingGrid";
import { ClothingUploadDialog } from "@/components/wardrobe/ClothingUploadDialog";
import { ClothingDetailSheet } from "@/components/wardrobe/ClothingDetailSheet";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import type { ClothingItem, ClothingCategory } from "@/types/wardrobe";

export default function WardrobePage() {
  const { loadItems, setFilter, resetFilters, getFilteredItems, filters, items } = useWardrobeStore();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  useEffect(() => { loadItems(); }, [loadItems]);

  const filteredItems = getFilteredItems();

  const handleSearch = useCallback((query: string) => {
    setFilter({ searchQuery: query });
  }, [setFilter]);

  const handleCategoryChange = useCallback((category: ClothingCategory | "all") => {
    setFilter({ category });
  }, [setFilter]);

  return (
    <PageContainer>
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="kit-overline">My</p>
          <h2 className="kit-display text-3xl md:text-4xl mt-1.5">Wardrobe</h2>
          <p className="text-sm kit-muted mt-2">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        <button onClick={() => setShowUpload(true)} className="kit-btn-primary">
          <Plus className="w-4 h-4" /> Add Item
        </button>
      </div>

      <div className="space-y-4 mb-6">
        <SearchInput value={filters.searchQuery} onChange={handleSearch} placeholder="Search clothes..." />
        <CategoryFilter selected={filters.category} onChange={handleCategoryChange} />
      </div>

      {filteredItems.length > 0 ? (
        <ClothingGrid items={filteredItems} onItemClick={setSelectedItem} />
      ) : items.length > 0 ? (
        <EmptyState icon={Shirt} title="No matches" description="Try adjusting your filters or search terms" action={{ label: "Reset Filters", onClick: resetFilters }} />
      ) : (
        <EmptyState icon={Shirt} title="Your wardrobe is empty" description="Start by adding your first clothing item" action={{ label: "Add First Item", onClick: () => setShowUpload(true) }} />
      )}

      <ClothingUploadDialog open={showUpload} onClose={() => setShowUpload(false)} />
      <ClothingDetailSheet item={selectedItem} onClose={() => setSelectedItem(null)} />
    </PageContainer>
  );
}
