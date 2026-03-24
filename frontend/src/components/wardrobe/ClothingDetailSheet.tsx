import { X, Trash2 } from "lucide-react";
import { useWardrobeStore } from "@/stores/useWardrobeStore";
import type { ClothingItem } from "@/types/wardrobe";

interface ClothingDetailSheetProps {
  item: ClothingItem | null;
  onClose: () => void;
}

export function ClothingDetailSheet({ item, onClose }: ClothingDetailSheetProps) {
  const deleteItem = useWardrobeStore((s) => s.deleteItem);

  if (!item) return null;

  const handleDelete = () => {
    deleteItem(item.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center md:justify-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:w-96 md:h-full max-h-[85vh] md:max-h-full overflow-y-auto bg-white/95 dark:bg-gray-950/95 backdrop-blur-2xl border-t md:border-l border-white/20 dark:border-white/10 rounded-t-3xl md:rounded-none shadow-2xl">
        <div className="sticky top-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl z-10 p-4 flex items-center justify-between border-b border-white/10">
          <h2 className="text-lg font-bold">Item Details</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="rounded-2xl overflow-hidden">
            <img src={item.imageUrl} alt={item.name} className="w-full aspect-[3/4] object-cover" />
          </div>

          <div>
            <h3 className="text-xl font-bold">{item.name}</h3>
            {item.brand && <p className="text-sm text-muted-foreground mt-1">{item.brand}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
              <span className="text-xs text-muted-foreground">Category</span>
              <p className="text-sm font-medium capitalize">{item.category}</p>
            </div>
            <div className="p-3 rounded-xl bg-black/[0.03] dark:bg-white/[0.03]">
              <span className="text-xs text-muted-foreground">Color</span>
              <p className="text-sm font-medium capitalize">{item.color}</p>
            </div>
          </div>

          <div>
            <span className="text-xs text-muted-foreground">Seasons</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.season.map((s) => (
                <span key={s} className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-medium capitalize">{s}</span>
              ))}
            </div>
          </div>

          {item.tags.length > 0 && (
            <div>
              <span className="text-xs text-muted-foreground">Tags</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {item.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-lg bg-black/5 dark:bg-white/10 text-xs font-medium capitalize">{tag}</span>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleDelete} className="w-full py-3 rounded-2xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-medium flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
            <Trash2 className="w-4 h-4" /> Remove from Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
}
