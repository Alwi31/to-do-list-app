import { Search, X } from 'lucide-react';

/**
 * ============================================
 * COMPONENT: TodoSearch
 * ============================================
 * 
 * Komponen untuk pencarian todos
 * 
 * Pattern: Controlled Component
 * - Value dikontrol oleh parent
 * - onChange callback untuk update
 * 
 * UX Features:
 * - Clear button saat ada input
 * - Search icon untuk visual cue
 * - Placeholder yang informatif
 */
interface TodoSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function TodoSearch({ value, onChange }: TodoSearchProps) {
  /**
   * Clear search handler
   * 
   * Extracted untuk readability
   */
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="relative">
      {/*
        Search Icon
        
        Posisi absolute di dalam input
        pointer-events-none agar tidak interfere dengan input
      */}
      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 
                   w-5 h-5 text-muted-foreground pointer-events-none" 
      />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cari tugas..."
        className="w-full pl-10 pr-10 py-2.5 rounded-lg 
                   border border-input bg-card
                   text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/30 
                   focus:border-primary transition-all duration-200"
        aria-label="Cari todo"
      />
      
      {/*
        Clear Button
        
        Conditional rendering:
        - Hanya tampil saat ada input
        - Button untuk accessibility (bisa di-click dan keyboard)
      */}
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2
                     p-1 rounded-full text-muted-foreground
                     hover:bg-muted hover:text-foreground
                     transition-colors duration-200"
          aria-label="Hapus pencarian"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
