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

import { useState, useEffect } from "react";
import { useTodos } from "@/hooks/useTodos";
import { useNotes } from "@/hooks/useNotes";
import { usePagination } from "@/hooks/usePagination";
import { Header } from "@/components/layout";
import {
  TodoList,
  TodoFilter,
  TodoSearch,
  TodoStats,
  NoteForm,
  NotesList,
  NotesSearch,
  PaginationLoadMore,
} from "@/components/todo";
import { Button } from "@/components/ui/button";
import type { Note } from "@/types/todo";

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

  /**
   * Hook untuk manajemen catatan (notes)
   */
  const {
    notes: allNotes,
    todayNotes,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  /**
   * ============================================
   * PAGINATION LOGIC
   * ============================================
   *
   * Menggunakan custom hook usePagination untuk manage pagination
   * Configuration:
   * - itemsPerPage: 5 (tampilkan 5 TODO per batch)
   * - allItems: filtered todos berdasarkan search & filter
   *
   * Mengapa filter todos terlebih dahulu?
   * - Pagination harus based on filtered results
   * - Jika user search, pagination reset otomatis
   * - Contoh: 20 todos, filter "Active" → 8 todos, pagination dari 8
   */
  const filteredTodos = todos
    .filter((todo) => {
      // Filter berdasarkan current filter (all/active/completed)
      if (filter === "active") {
        return !todo.completed;
      }
      if (filter === "completed") {
        return todo.completed;
      }
      return true; // "all" - return semua
    })
    .filter((todo) => {
      // Filter berdasarkan search query (case-insensitive)
      if (!searchQuery.trim()) return true;
      return todo.text.toLowerCase().includes(searchQuery.toLowerCase());
    });

  /**
   * usePagination hook
   *
   * Input: filteredTodos (todos yang sudah di-filter & di-search)
   * Output: {
   *   displayedItems: Todos yang ditampilkan halaman ini
   *   totalPages: Total halaman
   *   currentPage: Halaman berapa sekarang
   *   hasNextPage: Ada page berikutnya?
   *   remainingItems: Berapa item belum ditampilkan
   *   loadMore: Function untuk next page
   *   showLess: Function untuk collapse kembali ke page 1
   *   reset: Function untuk reset ke page 1
   * }
   */
  const {
    displayedItems: paginatedTodos,
    hasNextPage,
    remainingItems,
    currentPage,
    loadMore: loadMoreTodos,
    showLess: showLessTodos,
  } = usePagination(filteredTodos, { itemsPerPage: 5 });

  /**
   * Effect: Reset pagination saat filter atau search berubah
   *
   * Mengapa penting?
   * - Jika user search/filter, hasil berbeda tapi page tetap 2
   * - Solusi: Reset ke page 1 otomatis
   * - User tidak perlu manual click back
   *
   * Dependencies:
   * - filter: jika user ubah filter (all/active/completed)
   * - searchQuery: jika user type di search
   */
  // useEffect(() => {
  //   paginationReset();
  // }, [filter, searchQuery, paginationReset]);

  /**
   * State untuk membuka/menutup modal form catatan
   */
  const [isNoteFormOpen, setIsNoteFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Pick<
    Note,
    "id" | "content"
  > | null>(null);

  /**
   * Handler untuk tambah catatan baru
   */
  const handleAddNote = (content: string) => {
    addNote(content);
  };

  /**
   * Handler untuk edit catatan
   */
  const handleEditNote = (note: { id: string; content: string } | Note) => {
    setEditingNote(note);
    setIsNoteFormOpen(true);
  };

  /**
   * Handler untuk simpan edit catatan
   */
  const handleSaveEditNote = (id: string, content: string) => {
    updateNote(id, content);
    setEditingNote(null);
  };

  /**
   * Handler untuk convert catatan ke todo
   * Sekaligus menandai note sebagai sudah di-convert
   */
  const handleConvertNoteToTodo = (content: string) => {
    // Tambahkan ke todo list
    addTodo(content);
    // Tidak bisa mark converted karena kita tidak punya note id di sini
    // Kita bisa improve ini dengan mengembalikan Note dari addNote
  };

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
    <div className="min-h-screen flex flex-col py-8 px-4">
      <div className="max-w-2xl mx-auto flex flex-col flex-1">
        {/* Header dengan branding Gen Z */}
        <Header />

        {/*
          Main Content Card - Glassmorphism Style
          
          glass-card: Custom class untuk efek glassmorphism
          Gen Z vibes dengan rounded corners besar
        */}
        <main
          className="flex-1 glass-card rounded-3xl p-4 sm:p-6 space-y-6 
                         border-2 border-primary/10 animate-pop-in"
        >
          {/* Section 0: Catatan Harian & Search */}
          <section aria-label="Catatan harian">
            <div className="space-y-4">
              {/* Tombol untuk membuka form catatan */}
              <Button
                onClick={() => {
                  setEditingNote(null);
                  setIsNoteFormOpen(true);
                }}
                className="w-full gap-2"
                size="lg"
              >
                <span>📝 Tambah Catatan Baru</span>
              </Button>

              {/* Tampilkan catatan untuk hari ini */}
              <NotesList
                notes={todayNotes}
                onDeleteNote={deleteNote}
                onEditNote={handleEditNote}
                onConvertToTodo={handleConvertNoteToTodo}
              />

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent mt-6" />

              {/* Search Catatan */}
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-muted-foreground mb-4">
                  🔍 Cari Catatan
                </h3>
                <NotesSearch notes={allNotes} onSelectNote={handleEditNote} />
              </div>
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Section 1: Filter dan Search TODO */}
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
              <TodoSearch value={searchQuery} onChange={setSearchQuery} />
            </div>
          </section>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

          {/* Section 2: Daftar Todo dengan Pagination */}
          <section aria-label="Daftar tugas">
            {/**
             * Render TodoList dengan paginatedTodos
             *
             * Paginasi sudah di-handle oleh usePagination hook
             * Tampilkan hanya items yang sesuai halaman saat ini
             *
             * Data flow:
             * filteredTodos (search + filter) → paginatedTodos → TodoList → UI
             */}
            <TodoList
              todos={paginatedTodos}
              onToggle={toggleTodo}
              onDelete={deleteTodo}
              onEdit={editTodo}
            />

            {/**
             * Render Load More & Show Less Buttons
             *
             * Conditional render:
             * - Load More button: Untuk load items berikutnya (selalu tampilkan)
             * - Show Less button: Untuk collapse items (tampilkan jika currentPage > 1)
             * - Sembunyikan dua-duanya jika paginatedTodos kosong
             *
             * UX: User clear melihat kapan mereka sudah di-load semua
             */}
            {paginatedTodos.length > 0 && (
              <PaginationLoadMore
                onLoadMore={loadMoreTodos}
                onShowLess={showLessTodos}
                remainingItems={remainingItems}
                canShowLess={currentPage > 1}
                disabled={!hasNextPage}
                isLoading={false}
              />
            )}
          </section>

          {/* Section 3: Statistik dan Clear Completed */}
          <section aria-label="Statistik tugas">
            <TodoStats stats={stats} onClearCompleted={clearCompleted} />
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
              To-Do-List Awing ⚡
            </span>
          </p>
          <p className="mt-2 text-xs opacity-70">
            Made with Awingg 💜 for Gen Z learners
          </p>
        </footer>
      </div>
      {/* Modal Form Catatan */}
      <NoteForm
        isOpen={isNoteFormOpen}
        onClose={() => {
          setIsNoteFormOpen(false);
          setEditingNote(null);
        }}
        onAddNote={handleAddNote}
        onEditNote={handleSaveEditNote}
        onConvertToTodo={handleConvertNoteToTodo}
        editingNote={editingNote}
      />
    </div>
  );
};
export default Index;
