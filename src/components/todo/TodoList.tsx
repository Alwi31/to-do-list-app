import { ClipboardList } from 'lucide-react';
import type { Todo } from '@/types/todo';
import { TodoItem } from './TodoItem';

/**
 * ============================================
 * COMPONENT: TodoList
 * ============================================
 * 
 * Komponen untuk menampilkan daftar todos
 * 
 * Prinsip yang diterapkan:
 * 1. Composition - menggunakan TodoItem untuk render item
 * 2. Conditional rendering - empty state saat tidak ada todos
 * 3. Key prop - untuk React reconciliation yang optimal
 * 
 * Performance consideration:
 * - Menggunakan key yang unik dan stabil (todo.id)
 * - Callbacks di-pass dari parent (harus memoized dengan useCallback)
 */
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  /**
   * Empty State
   * 
   * UX Best Practice:
   * - Berikan visual feedback saat list kosong
   * - Tambahkan icon untuk visual interest
   * - Message yang helpful
   */
  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <ClipboardList className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">
          Tidak ada tugas
        </h3>
        <p className="text-muted-foreground max-w-xs">
          Mulai tambahkan tugas baru untuk mengelola pekerjaan harianmu
        </p>
      </div>
    );
  }

  /**
   * Render list
   * 
   * Menggunakan div dengan space-y untuk gap antar item
   * role="list" untuk accessibility
   */
  return (
    <div 
      className="space-y-3"
      role="list"
      id="todo-list"
      aria-label="Daftar todo"
    >
      {todos.map((todo, index) => (
        /**
         * Key Prop Best Practice:
         * 
         * Menggunakan todo.id sebagai key karena:
         * 1. Unique - tidak ada duplikat
         * 2. Stable - tidak berubah selama todo ada
         * 
         * JANGAN gunakan index sebagai key karena:
         * - Berubah saat item di-reorder
         * - Menyebabkan bug pada komponen dengan state
         * 
         * style untuk staggered animation (optional enhancement)
         */
        <div 
          key={todo.id}
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <TodoItem
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        </div>
      ))}
    </div>
  );
}
