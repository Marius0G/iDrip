import { DollarSign } from "lucide-react";

interface BudgetSliderProps {
  budget: number;
  spent: number;
  currency: string;
  onChange: (value: number) => void;
}

export function BudgetSlider({ budget, spent, onChange }: BudgetSliderProps) {
  const remaining = budget - spent;
  const percentage = (spent / budget) * 100;

  return (
    <div className="bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] rounded-2xl p-5 shadow-lg dark:shadow-black/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm font-medium">Monthly Budget</span>
        </div>
        <span className="text-2xl font-bold">${remaining}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
        <span>${spent} spent</span>
        <span>${budget} budget</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-black/5 dark:bg-white/10 mb-4 overflow-hidden">
        <div className="h-full rounded-full bg-black dark:bg-white transition-all duration-500" style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>

      {/* Slider */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Adjust budget</label>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={budget}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none bg-black/10 dark:bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:dark:bg-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
    </div>
  );
}
