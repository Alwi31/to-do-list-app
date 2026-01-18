/**
 * ============================================
 * BARREL EXPORT - Todo Components
 * ============================================
 *
 * Pattern: Barrel Export
 *
 * Keuntungan:
 * 1. Import lebih bersih di parent component
 *    Sebelum: import { TodoInput } from './todo/TodoInput'
 *    Sesudah: import { TodoInput } from './todo'
 *
 * 2. Encapsulation - internal structure tersembunyi
 * 3. Refactoring lebih mudah - path internal bisa berubah
 * 4. Tree-shaking tetap bekerja dengan named exports
 */

export { TodoInput } from "./TodoInput";
export { TodoItem } from "./TodoItem";
export { TodoList } from "./TodoList";
export { TodoFilter } from "./TodoFilter";
export { TodoSearch } from "./TodoSearch";
export { TodoStats } from "./TodoStats";
export { NoteForm } from "./NoteForm";
export { NotesList } from "./NotesList";
export { NotesSearch } from "./NotesSearch";
export { PaginationLoadMore } from "./PaginationLoadMore";
