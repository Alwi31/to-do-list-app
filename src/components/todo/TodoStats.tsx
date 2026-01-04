import { Trash2 } from 'lucide-react';

/**
 * ============================================
 * COMPONENT: TodoStats
 * ============================================
 * 
 * Komponen untuk menampilkan statistik todos
 * 
 * Pattern: Presentational Component
 * - Murni untuk display, tidak ada logic
 * - Semua data dari props
 * - Reusable di context lain
 */
interface TodoStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
  onClearCompleted: () => void;
}

export function TodoStats({ stats, onClearCompleted }: TodoStatsProps) {
  /**
   * Jangan render jika tidak ada todo sama sekali
   */
  if (stats.total === 0) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between 
                    gap-3 pt-4 border-t border-border">
      {/*
        Stats summary
        
        Layout responsive:
        - Mobile: stack vertikal
        - Desktop: horizontal
      */}
      <p className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{stats.active}</span>
        {' '}tugas tersisa dari{' '}
        <span className="font-medium text-foreground">{stats.total}</span>
        {' '}total
      </p>
      
      {/*
        Clear completed button
        
        Conditional rendering:
        - Hanya tampil jika ada completed todos
        - Menggunakan destructive styling untuk warning
      */}
      {stats.completed > 0 && (
        <button
          onClick={onClearCompleted}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg
                     text-sm text-muted-foreground
                     hover:bg-destructive/10 hover:text-destructive
                     transition-colors duration-200"
          aria-label={`Hapus ${stats.completed} tugas yang selesai`}
        >
          <Trash2 className="w-4 h-4" />
          <span>Hapus selesai ({stats.completed})</span>
        </button>
      )}
    </div>
  );
}
