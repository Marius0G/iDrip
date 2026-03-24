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
            className="flex items-center gap-4 p-4 rounded-2xl bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-lg dark:shadow-black/20 hover:shadow-xl hover:scale-[1.02] hover:border-black/10 dark:hover:border-white/15 dark:hover:bg-white/[0.09] transition-all duration-300 text-left">
            <div className="w-12 h-12 rounded-2xl bg-black text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0">
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
