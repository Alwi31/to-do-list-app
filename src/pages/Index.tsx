/**
 * ============================================
 * PAGE: Index (Homepage)
 * ============================================
 * 
 * Halaman utama aplikasi To-Do List
 * 
 * Arsitektur:
 * - Menggunakan custom hook useTodos untuk state management
 * - Komposisi dari komponen-komponen kecil
 * - Separation of concerns yang jelas
 * 
 * Data Flow:
 * 1. useTodos hook mengelola semua state dan logic
 * 2. State dan actions di-pass ke child components via props
 * 3. Child components trigger actions, hook update state
 * 4. React re-render komponen yang affected
 * 
 * LocalStorage Integration:
 * - Hook useLocalStorage di dalam useTodos
 * - Otomatis sync saat state berubah
 * - Data persist meski browser refresh
 */

import { useTodos } from '@/hooks/useTodos';
import { Header } from '@/components/layout';
import { 
  TodoInput, 
  TodoList, 
  TodoFilter, 
  TodoSearch,
  TodoStats 
} from '@/components/todo';

const Index = () => {
  /**
   * Destructure hook return value
   * 
   * Clean code: Hanya ambil yang dibutuhkan
   * TypeScript: Autocomplete dan type checking
   */
  const {
    todos,
    filter,
    searchQuery,
    stats,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setSearchQuery,
  } = useTodos();

  return (
    /**
     * Layout Container
     * 
     * min-h-screen: Minimal setinggi viewport
     * py-8: Padding vertikal
     * px-4: Padding horizontal (mobile friendly)
     * 
     * max-w-2xl mx-auto: Center container dengan max width
     * Ini membuat content tidak terlalu lebar di desktop
     */
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header dengan branding Gen Z */}
        <Header />

        {/*
          Main Content Card - Glassmorphism Style
          
          glass-card: Custom class untuk efek glassmorphism
          Gen Z vibes dengan rounded corners besar
        */}
        <main className="glass-card rounded-3xl p-4 sm:p-6 space-y-6 
                         border-2 border-primary/10 animate-pop-in">
          {/* Section 1: Input todo baru */}
          <section aria-label="Tambah tugas baru">
            <TodoInput onAdd={addTodo} />
          </section>

          {/* Section 2: Filter dan Search */}
          <section 
            className="flex flex-col sm:flex-row gap-4"
            aria-label="Filter dan pencarian"
          >
            <TodoFilter 
              currentFilter={filter}
              onFilterChange={setFilter}
              counts={{
                all: stats.total,
                active: stats.active,
                completed: stats.completed,
              }}
            />
            
            <div className="flex-1 sm:max-w-xs">
              <TodoSearch 
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
          </section>

          {/* Section 3: Daftar Todo */}
          <section aria-label="Daftar tugas">
            <TodoList
              todos={todos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />
          </section>

          {/* Section 4: Statistik dan Clear Completed */}
          <section aria-label="Statistik tugas">
            <TodoStats 
              stats={stats}
              onClearCompleted={clearCompleted}
            />
          </section>
        </main>

        {/*
          Footer - Gen Z friendly
          
          Casual & fun dengan emoji
        */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            <span>💾 Data tersimpan di browser</span>
            <span>•</span>
            <span className="gradient-text font-semibold">
              TaskFlow v1.0 ⚡
            </span>
          </p>
          <p className="mt-2 text-xs opacity-70">
            Made with 💜 for Gen Z learners
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
