import { useNavigate } from "react-router-dom";
import { Plus, Wand2, ShoppingBag } from "lucide-react";

interface QuickActionsProps {
  onUploadClick: () => void;
}

export function QuickActions({ onUploadClick }: QuickActionsProps) {
  const navigate = useNavigate();

  const actions = [
    { icon: Plus, label: "Upload Clothing", description: "Add to your wardrobe", onClick: onUploadClick },
    { icon: Wand2, label: "Generate Outfit", description: "AI-powered styling", onClick: () => navigate("/generator") },
    { icon: ShoppingBag, label: "Browse Recs", description: "Smart shopping", onClick: () => navigate("/shopping") },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {actions.map((action) => (
          <button key={action.label} onClick={action.onClick}
            className="flex items-center gap-4 p-4 rounded-2xl bg-[hsl(var(--frost)/0.7)] backdrop-blur-xl border border-[hsl(var(--border)/0.4)] shadow-[0_4px_24px_-2px_hsl(210_80%_60%/0.12)] hover:shadow-[0_8px_32px_-4px_hsl(210_90%_40%/0.15)] hover:scale-[1.02] transition-all duration-300 text-left">
            <div className="w-12 h-12 rounded-2xl bg-[hsl(var(--glacier))] text-white flex items-center justify-center flex-shrink-0">
              <action.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{action.label}</p>
              <p className="text-xs text-muted-foreground">{action.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
