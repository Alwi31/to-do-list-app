/**
 * ============================================
 * TYPE DEFINITIONS - To-Do App
 * ============================================
 * 
 * Best Practice: Definisikan types di file terpisah
 * 
 * Keuntungan:
 * 1. Single source of truth untuk struktur data
 * 2. Mudah di-import di berbagai komponen
 * 3. TypeScript dapat melakukan type checking
 * 4. IDE dapat memberikan autocomplete yang akurat
 */

/**
 * Interface untuk satu item Todo
 * 
 * Interface vs Type:
 * - Interface lebih cocok untuk object shapes
 * - Dapat di-extend dengan mudah
 * - Lebih readable untuk struktur data
 */
export interface Todo {
  /** Unique identifier - menggunakan timestamp untuk simplicity */
  id: string;
  
  /** Teks tugas yang harus dilakukan */
  text: string;
  
  /** Status apakah tugas sudah selesai */
  completed: boolean;
  
  /** Timestamp saat todo dibuat (ISO string) */
  createdAt: string;
  
  /** Timestamp saat todo terakhir diupdate (ISO string) */
  updatedAt: string;
}

/**
 * Type untuk filter yang tersedia
 * 
 * Menggunakan Union Type:
 * - Membatasi nilai yang valid
 * - TypeScript akan error jika nilai tidak valid
 * - Memudahkan autocomplete di IDE
 */
export type FilterType = 'all' | 'active' | 'completed';

/**
 * Interface untuk state context
 * Mendefinisikan shape dari state management kita
 */
export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  searchQuery: string;
}

/**
 * Type untuk action pada reducer (jika menggunakan useReducer)
 * Discriminated Union untuk type-safe actions
 */
export type TodoAction =
  | { type: 'ADD_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string } }
  | { type: 'SET_FILTER'; payload: FilterType }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'LOAD_TODOS'; payload: Todo[] };
