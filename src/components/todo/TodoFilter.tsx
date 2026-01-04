import { FilterType } from '@/types/todo';

/**
 * ============================================
 * COMPONENT: TodoFilter
 * ============================================
 * 
 * Komponen untuk filter todos berdasarkan status
 * 
 * Prinsip yang diterapkan:
 * 1. Stateless/Presentational - tidak punya internal state
 * 2. Props-driven - semua data dari parent
 * 3. Reusable - bisa dipakai di context lain
 * 
 * Pattern: Controlled Component
 * - Parent menentukan filter aktif via props
 * - Parent handle perubahan via callback
 */
interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

/**
 * Filter options configuration
 * 
 * Best Practice: Ekstrak data statis ke konstanta
 * - Mudah di-maintain
 * - Bisa di-reuse
 * - Tidak di-recreate setiap render
 */
const FILTER_OPTIONS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Selesai' },
];

export function TodoFilter({ currentFilter, onFilterChange, counts }: TodoFilterProps) {
  /**
   * Helper untuk mendapatkan count berdasarkan filter
   */
  const getCount = (filter: FilterType): number => {
    return counts[filter];
  };

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter todos">
      {FILTER_OPTIONS.map(({ value, label }) => {
        const isActive = currentFilter === value;
        const count = getCount(value);
        
        return (
          <button
            key={value}
            onClick={() => onFilterChange(value)}
            role="tab"
            aria-selected={isActive}
            aria-controls="todo-list"
            className={`
              px-4 py-2 rounded-lg text-sm font-medium
              transition-all duration-200
              flex items-center gap-2
              ${isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }
            `}
          >
            {label}
            {/*
              Badge untuk count
              
              Conditional styling:
              - Active: badge lebih subtle
              - Inactive: badge lebih prominent
            */}
            <span 
              className={`
                px-2 py-0.5 rounded-full text-xs
                ${isActive 
                  ? 'bg-primary-foreground/20 text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
                }
              `}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
