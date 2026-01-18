# 📝 To-Do List App with Notepad

Aplikasi produktivitas modern yang menggabungkan fitur **To-Do List** dan **Daily Notepad** dengan desain Gen Z yang menarik. Dibangun dengan React 18, TypeScript, dan Tailwind CSS untuk memberikan pengalaman pengguna yang optimal.

![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite)

---

## ✨ Fitur Utama

### 📓 Notepad Harian

- **Buat Catatan**: Tulis catatan harian dengan mudah melalui modal form
- **Edit Catatan**: Ubah isi catatan kapan saja
- **Hapus Catatan**: Buang catatan yang tidak perlu
- **Konversi ke TODO**: Ubah catatan menjadi item to-do dengan sekali klik
- **Pencarian Cerdas**: Cari catatan berdasarkan:
  - Tanggal (format: YYYY-MM-DD)
  - Nama hari (Senin, Selasa, dll)
  - Keyword/Kata kunci dalam isi catatan

### ✅ To-Do List

- **Manajemen Task**: Buat, edit, dan hapus to-do items
- **Tandai Selesai**: Centang item yang sudah dikerjakan
- **Filter Cerdas**:
  - Semua (All) - tampilkan semua item
  - Aktif (Active) - belum dikerjakan
  - Selesai (Completed) - sudah dikerjakan
- **Pencarian**: Cari to-do berdasarkan teks
- **Statistik Real-time**: Lihat progress dengan counter
  - Total tasks
  - Tasks aktif
  - Tasks selesai

### 📊 Pagination

- **Load More**: Tampilkan 5 item per halaman dengan tombol "Load More"
- **Show Less**: Collapse kembali ke halaman pertama dengan "Show Less"
- **Smart Display**: Otomatis sembunyikan button saat semua item sudah ditampilkan
- **Remaining Counter**: Lihat berapa item yang belum ditampilkan

### 💾 Persistence

- **LocalStorage**: Semua data otomatis tersimpan di browser
- **Offline Ready**: Akses data offline tanpa internet
- **Auto Sync**: Data sinkron otomatis saat aplikasi dibuka

---

## 🚀 Instalasi

### Prerequisites

- **Node.js** >= 16.0.0 atau **Bun** >= 1.0.0
- npm, yarn, atau bun sebagai package manager

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd to-do-list-app
```

### Step 2: Install Dependencies

**Menggunakan npm:**

```bash
npm install
```

**Atau menggunakan bun:**

```bash
bun install
```

**Atau menggunakan yarn:**

```bash
yarn install
```

### Step 3: Run Development Server

```bash
npm run dev
# atau
bun dev
```

Aplikasi akan berjalan di `http://localhost:8080`

### Step 4: Build untuk Production

```bash
npm run build
# atau
bun run build
```

---

## 📁 Struktur Folder

```
to-do-list-app/
├── public/                      # Static assets
│   └── robots.txt
│
├── src/
│   ├── components/              # React components
│   │   ├── layout/
│   │   │   └── Header.tsx       # Header aplikasi
│   │   │
│   │   ├── todo/                # TODO-related components
│   │   │   ├── TodoList.tsx     # Daftar item todo
│   │   │   ├── TodoItem.tsx     # Single todo item
│   │   │   ├── TodoFilter.tsx   # Filter buttons
│   │   │   ├── TodoSearch.tsx   # Search bar for todos
│   │   │   ├── TodoStats.tsx    # Statistics display
│   │   │   ├── NoteForm.tsx     # Modal form for notes
│   │   │   ├── NotesList.tsx    # Display notes
│   │   │   ├── NotesSearch.tsx  # Search notes
│   │   │   ├── PaginationLoadMore.tsx # Load more button
│   │   │   └── index.ts         # Barrel export
│   │   │
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   └── ... (30+ UI components)
│   │   │
│   │   └── NavLink.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTodos.ts          # TODO state management
│   │   ├── useNotes.ts          # Notes state management
│   │   ├── usePagination.ts     # Pagination logic
│   │   ├── useLocalStorage.ts   # LocalStorage wrapper
│   │   └── use-mobile.tsx       # Mobile detection
│   │
│   ├── lib/
│   │   └── utils.ts             # Utility functions
│   │
│   ├── pages/                   # Page components
│   │   ├── Index.tsx            # Homepage
│   │   └── NotFound.tsx         # 404 page
│   │
│   ├── types/
│   │   └── todo.ts              # TypeScript interfaces
│   │
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # Entry point
│   ├── App.css                  # Global styles
│   └── index.css                # Tailwind directives
│
├── .eslintrc.cjs                # ESLint config
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── vite.config.ts               # Vite config
├── package.json
└── README.md
```

---

## 🏗️ Arsitektur & Data Flow

### Component Hierarchy

```
App
└── Index (Homepage)
    ├── Header
    ├── Section 0: Notepad
    │   ├── Add Note Button
    │   ├── NotesList
    │   ├── Divider
    │   └── NotesSearch
    │
    ├── Section 1: Todo Filter & Search
    │   ├── TodoFilter (All/Active/Completed)
    │   └── TodoSearch (Input)
    │
    ├── Section 2: Todo List dengan Pagination
    │   ├── TodoList
    │   │   └── TodoItem[] (5 items per page)
    │   └── PaginationLoadMore
    │       ├── Show Less Button (conditionally)
    │       └── Load More Button
    │
    ├── Section 3: Statistics
    │   └── TodoStats
    │
    └── NoteForm Modal
```

### State Management Flow

```
┌─────────────────────────────────────────┐
│         Custom Hooks (State)             │
├─────────────────────────────────────────┤
│                                         │
│  useTodos()                             │
│  ├── todos[], filter, searchQuery       │
│  ├── addTodo, toggleTodo, deleteTodo    │
│  └── editTodo, clearCompleted           │
│                                         │
│  useNotes()                             │
│  ├── notes[], todayNotes[]              │
│  ├── addNote, updateNote, deleteNote    │
│  └── convertNoteToTodo                  │
│                                         │
│  usePagination()                        │
│  ├── displayedItems, currentPage        │
│  ├── loadMore, showLess                 │
│  └── remainingItems                     │
│                                         │
│  useLocalStorage()                      │
│  └── Persist data ke browser storage    │
│                                         │
└─────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────┐
│      Components (Props)                  │
├─────────────────────────────────────────┤
│  - Receive state dari hooks              │
│  - Render UI berdasarkan state           │
│  - Trigger actions via callbacks         │
└─────────────────────────────────────────┘
```

---

## 🔌 Custom Hooks Reference

### `useTodos()`

Mengelola semua logika to-do list.

**Return Value:**

```typescript
{
  todos: Todo[];                           // Array of all todos
  filter: FilterType;                      // Current filter (all/active/completed)
  searchQuery: string;                     // Current search text
  stats: { total: number; active: number; completed: number };
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
}
```

**Contoh Penggunaan:**

```typescript
const { todos, addTodo, toggleTodo } = useTodos();

const handleAddTodo = () => {
  addTodo("Belajar React"); // Langsung ditambah ke state
};
```

### `useNotes()`

Mengelola catatan harian dengan pencarian dan konversi.

**Return Value:**

```typescript
{
  notes: Note[];                           // Semua catatan
  todayNotes: Note[];                      // Catatan hari ini
  addNote: (content: string) => Note;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
}
```

**Contoh Penggunaan:**

```typescript
const { todayNotes, addNote, updateNote } = useNotes();

// Tambah catatan
const newNote = addNote("Catatan penting hari ini");

// Edit catatan
updateNote(newNote.id, "Catatan yang sudah diubah");
```

### `usePagination<T>(items: T[], options?: PaginationOptions)`

Custom hook untuk pagination dengan Load More pattern.

**Parameters:**

```typescript
// Items yang ingin di-paginate (sudah di-filter/search)
const items = filteredTodos;

// Options (optional)
const options = {
  itemsPerPage: 5, // Default: 5 items per page
};
```

**Return Value:**

```typescript
{
  displayedItems: T[];                     // Items untuk page saat ini
  currentPage: number;                     // Page number (1-indexed)
  totalPages: number;                      // Total pages
  hasNextPage: boolean;                    // Ada next page?
  remainingItems: number;                  // Berapa items belum ditampilkan
  loadMore: () => void;                    // Go to next page
  showLess: () => void;                    // Go back to page 1
  reset: () => void;                       // Reset ke page 1
}
```

**Contoh Penggunaan:**

```typescript
const filteredTodos = todos.filter(/* ... */);

const {
  displayedItems: paginatedTodos,
  currentPage,
  loadMore,
  showLess,
  remainingItems,
} = usePagination(filteredTodos, { itemsPerPage: 5 });

// Load more
const handleLoadMore = () => loadMore();

// Collapse
const handleShowLess = () => showLess();
```

### `useLocalStorage<T>(key: string, initialValue: T)`

Wrapper untuk localStorage dengan type safety.

**Contoh Penggunaan:**

```typescript
const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);

// Otomatis persist ke localStorage
setTodos([...todos, newTodo]);
```

---

## 🎨 Desain & Styling

### Teknologi

- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Unstyled, accessible component library
- **Lucide React**: Icon library dengan 400+ icons

### Design System

- **Color Palette**: Primary, secondary, destructive, muted colors
- **Spacing**: 0.25rem (1px) increments
- **Typography**: Responsive font sizes
- **Animations**: Smooth transitions dan pop-in effects

### Custom Styles

```css
/* Glassmorphism effect */
.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Gradient text */
.gradient-text {
  background: linear-gradient(to right, var(--primary), var(--secondary));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Pop-in animation */
@keyframes pop-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

---

## 🔑 TypeScript Interfaces

### Todo

```typescript
interface Todo {
  id: string; // Unique identifier
  text: string; // Task description
  completed: boolean; // Completion status
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
```

### Note

```typescript
interface Note {
  id: string; // Unique identifier
  content: string; // Note content
  date: string; // Date (YYYY-MM-DD format)
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  convertedToTodo: boolean; // Sudah dikonversi?
}
```

### FilterType

```typescript
type FilterType = "all" | "active" | "completed";
```

---

## 🚀 API & Functions

### Todo Functions

```typescript
// Add new todo
addTodo(text: string) => void

// Toggle completion status
toggleTodo(id: string) => void

// Delete todo
deleteTodo(id: string) => void

// Edit todo text
editTodo(id: string, text: string) => void

// Clear all completed todos
clearCompleted() => void

// Set filter
setFilter(filter: FilterType) => void

// Set search query
setSearchQuery(query: string) => void
```

### Note Functions

```typescript
// Add new note for today
addNote(content: string) => Note

// Update existing note
updateNote(id: string, content: string) => void

// Delete note
deleteNote(id: string) => void

// Get today's notes
getTodayNotes() => Note[]

// Search notes
searchNotes(query: string) => Note[]
```

### Pagination Functions

```typescript
// Load next page
loadMore() => void

// Go back to page 1
showLess() => void

// Reset to page 1
reset() => void

// Get displayed items for current page
displayedItems => T[]

// Get remaining items count
remainingItems => number
```

---

## 📋 Development Scripts

```bash
# Start development server
npm run dev

# Build untuk production
npm run build

# Build dengan mode development
npm run build:dev

# Lint dengan ESLint
npm run lint

# Preview build hasil
npm run preview
```

---

## 🔍 Best Practices yang Diimplementasikan

### 1. **Separation of Concerns**

- Logic terpisah di custom hooks
- UI components fokus ke rendering
- Type definitions di file terpisah

### 2. **Type Safety**

- Full TypeScript coverage
- Strict mode enabled
- Interface untuk semua data structures

### 3. **Performance Optimization**

- `useCallback` untuk memoized functions
- `useMemo` untuk expensive computations
- Pagination untuk handle large datasets
- Lazy loading patterns

### 4. **Code Organization**

- Barrel exports (`index.ts`) untuk clean imports
- Consistent file structure
- Detailed JSDoc comments
- Meaningful variable names

### 5. **Accessibility**

- Semantic HTML
- ARIA attributes untuk screen readers
- Keyboard navigation support
- Proper button labeling

### 6. **User Experience**

- Instant visual feedback
- Loading states
- Success/error messages
- Responsive design (mobile-first)
- Dark mode support ready

---

## 🐛 Troubleshooting

### Aplikasi Blank White Screen

**Solusi:**

1. Buka Developer Tools (F12)
2. Cek Console tab untuk error messages
3. Pastikan `export default Index` ada di `src/pages/Index.tsx`
4. Hard refresh dengan Ctrl+Shift+R

### CSS Tidak Muncul

**Penyebab:** @import statement sebelum @tailwind directives

**Solusi:** Di `src/index.css`, pastikan urutan:

```css
@import url("..."); /* Import harus paling atas */
@tailwind base; /* Kemudian tailwind directives */
@tailwind components;
@tailwind utilities;
```

### Data Tidak Tersimpan

**Solusi:**

1. Cek localStorage di DevTools > Application > Local Storage
2. Pastikan `useLocalStorage` hook bekerja dengan benar
3. Clear localStorage jika ada data corrupt: `localStorage.clear()`

### Pagination Tidak Bekerja

**Solusi:**

- Pastikan `usePagination` menerima array yang sudah di-filter
- Check `itemsPerPage` value di pagination options
- Verify `currentPage` state di hook

---

## 📚 Pembelajaran & Resources

### Konsep yang Digunakan

- React Hooks (useState, useEffect, useCallback, useMemo)
- Custom Hooks Pattern
- TypeScript Interfaces & Types
- Local Storage API
- Array Methods (filter, map, slice)
- Array Pagination Logic

### Recommended Reading

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 📄 License

Project ini dibuat untuk pembelajaran dan pengembangan skill React/TypeScript.

---

## 👨‍💻 Author

Dibuat untuk Gen Z learners yang ingin belajar React dengan cara yang fun dan modern. 💜

**Made with 💜 for learners everywhere**

---

## 🔗 Quick Links

- 📖 [Dokumentasi Lengkap](#)
- 🐛 [Report Issues](#)
- 💡 [Suggest Features](#)
- 🌟 [Star Repository](#)

---

**Happy Coding! ⚡**
