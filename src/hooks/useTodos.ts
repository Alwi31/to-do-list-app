import { useState, useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Todo, FilterType } from '@/types/todo';

/**
 * ============================================
 * CUSTOM HOOK: useTodos
 * ============================================
 * 
 * Hook utama untuk mengelola state dan logic todo
 * 
 * Prinsip yang diterapkan:
 * 1. Single Responsibility - hook ini HANYA untuk todo management
 * 2. Separation of Concerns - UI logic terpisah dari business logic
 * 3. Immutability - selalu return array/object baru, tidak mutate
 * 
 * Return value menggunakan object (bukan array) karena:
 * - Lebih dari 2 values yang di-return
 * - Lebih mudah di-destructure secara selektif
 * - Lebih readable di komponen yang menggunakan
 */
export function useTodos() {
  /**
   * State Management
   * 
   * Menggunakan useLocalStorage untuk todos agar persisten
   * Menggunakan useState biasa untuk filter & search (tidak perlu persist)
   */
  const [todos, setTodos] = useLocalStorage<Todo[]>('todos', []);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Helper: Generate unique ID
   * 
   * Menggunakan timestamp + random untuk menghindari collision
   * Di production, bisa menggunakan library seperti uuid
   */
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Add Todo
   * 
   * useCallback untuk memoize function
   * Dependency: setTodos (stabil dari custom hook)
   */
  const addTodo = useCallback((text: string): void => {
    // Validasi: tidak boleh kosong atau hanya whitespace
    const trimmedText = text.trim();
    if (!trimmedText) return;

    const now = new Date().toISOString();
    
    const newTodo: Todo = {
      id: generateId(),
      text: trimmedText,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };

    /**
     * Functional update pattern
     * 
     * Mengapa prev => [...prev, newTodo]?
     * - Menghindari stale closure (nilai lama)
     * - React menjamin prev adalah nilai terbaru
     * - Spread operator membuat array baru (immutability)
     */
    setTodos(prev => [newTodo, ...prev]);
  }, [setTodos]);

  /**
   * Toggle Todo Completion
   * 
   * Prinsip immutability: map() mengembalikan array baru
   * Spread operator {...todo} membuat object baru
   */
  const toggleTodo = useCallback((id: string): void => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id
          ? { 
              ...todo, 
              completed: !todo.completed,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, [setTodos]);

  /**
   * Delete Todo
   * 
   * filter() mengembalikan array baru tanpa item yang dihapus
   * Lebih clean daripada splice() yang mutate array
   */
  const deleteTodo = useCallback((id: string): void => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, [setTodos]);

  /**
   * Edit Todo
   * 
   * Menerima id dan text baru
   * Mengupdate updatedAt untuk tracking
   */
  const editTodo = useCallback((id: string, newText: string): void => {
    const trimmedText = newText.trim();
    if (!trimmedText) return;

    setTodos(prev =>
      prev.map(todo =>
        todo.id === id
          ? { 
              ...todo, 
              text: trimmedText,
              updatedAt: new Date().toISOString()
            }
          : todo
      )
    );
  }, [setTodos]);

  /**
   * Clear Completed Todos
   * 
   * Utility function untuk membersihkan semua todo yang sudah selesai
   */
  const clearCompleted = useCallback((): void => {
    setTodos(prev => prev.filter(todo => !todo.completed));
  }, [setTodos]);

  /**
   * Filtered Todos - Derived State
   * 
   * useMemo untuk menghindari kalkulasi ulang yang tidak perlu
   * 
   * Kapan useMemo re-calculate?
   * - Saat todos berubah
   * - Saat filter berubah  
   * - Saat searchQuery berubah
   * 
   * Jika tidak ada perubahan, React menggunakan nilai cached
   */
  const filteredTodos = useMemo(() => {
    return todos
      // Step 1: Filter berdasarkan status
      .filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true; // 'all'
      })
      // Step 2: Filter berdasarkan search query
      .filter(todo => 
        todo.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [todos, filter, searchQuery]);

  /**
   * Statistics - Derived State
   * 
   * Informasi statistik yang dihitung dari todos
   * useMemo karena perhitungan bisa expensive untuk list besar
   */
  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  /**
   * Return object dengan semua yang dibutuhkan komponen
   * 
   * Kenapa object bukan array?
   * - Lebih dari 2 items
   * - Nama property self-documenting
   * - Bisa destructure sebagian: const { todos, addTodo } = useTodos()
   */
  return {
    // State
    todos: filteredTodos,
    allTodos: todos,
    filter,
    searchQuery,
    stats,
    
    // Actions
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
    setSearchQuery,
  };
}
