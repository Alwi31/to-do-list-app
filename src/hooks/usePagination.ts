import { useState, useMemo, useCallback } from "react";

/**
 * ============================================
 * CUSTOM HOOK: usePagination
 * ============================================
 *
 * Hook untuk mengelola pagination data dengan Load More pattern
 *
 * Mengapa hook ini berguna?
 * - Separasi logic pagination dari UI component
 * - Reusable untuk berbagai list data (TODO, notes, dll)
 * - Mudah di-test dan di-maintain
 *
 * Konsep:
 * - ITEMS_PER_PAGE: Berapa item yang ditampilkan per halaman
 * - currentPage: Halaman berapa yang sedang ditampilkan
 * - displayedItems: Items yang sudah di-render
 * - remainingItems: Items yang belum di-render (untuk cek tombol Load More)
 *
 * @template T - Tipe data dari item yang di-paginate
 */
interface UsePaginationOptions {
  /**
   * Berapa banyak item yang ditampilkan per halaman/batch
   *
   * Contoh: 5 berarti setiap load more, tampilkan 5 item baru
   * Disesuaikan dengan case:
   * - Small items (no image): 10-20
   * - Medium items (with avatar): 5-10
   * - Large items (with images): 3-5
   */
  itemsPerPage?: number;
}

interface UsePaginationReturn<T> {
  /**
   * Items yang sedang ditampilkan di UI saat ini
   *
   * Contoh: jika total 15 items, itemsPerPage 5, currentPage 1
   * displayedItems akan return items 0-4 (5 items)
   */
  displayedItems: T[];

  /**
   * Total jumlah halaman berdasarkan total items
   *
   * Rumus: Math.ceil(totalItems / itemsPerPage)
   * Contoh: 15 items ÷ 5 per page = 3 pages
   */
  totalPages: number;

  /**
   * Halaman aktif yang sedang ditampilkan (1-indexed)
   *
   * Contoh: 1 = halaman pertama, 2 = halaman kedua
   * Dimulai dari 1, bukan 0 (user-friendly)
   */
  currentPage: number;

  /**
   * Apakah ada halaman berikutnya?
   *
   * Gunakan untuk determine: apakah tombol "Load More" harus ditampilkan?
   *
   * Contoh:
   * - Page 1 of 3: hasNextPage = true (ada page 2)
   * - Page 3 of 3: hasNextPage = false (sudah paling akhir)
   */
  hasNextPage: boolean;

  /**
   * Berapa banyak item yang belum ditampilkan?
   *
   * Berguna untuk info: "10 more to load" atau "Loading 5 more..."
   *
   * Rumus: totalItems - displayedItems.length
   */
  remainingItems: number;

  /**
   * Function untuk pindah ke halaman berikutnya
   *
   * Dipanggil saat user klik "Load More" button
   * Increment currentPage by 1
   */
  loadMore: () => void;

  /**
   * Function untuk kembali ke halaman sebelumnya (Show Less)
   *
   * Dipanggil saat user klik "Show Less" button
   * Decrement currentPage by 1
   *
   * Berguna untuk:
   * - Collapse view (hide items yang sudah di-load)
   * - Lebih clean saat user ingin lihat items awal lagi
   */
  showLess: () => void;

  /**
   * Function untuk reset pagination ke halaman 1
   *
   * Dipanggil saat:
   * - Filter/search berubah
   * - Data di-refresh
   * - Component unmount
   */
  reset: () => void;
}

export function usePagination<T>(
  allItems: T[],
  options: UsePaginationOptions = {},
): UsePaginationReturn<T> {
  /**
   * Default: 5 items per page
   *
   * Bisa di-customize via options
   * Contoh: usePagination(items, { itemsPerPage: 10 })
   */
  const ITEMS_PER_PAGE = options.itemsPerPage ?? 5;

  /**
   * State: Halaman mana yang sedang dilihat user
   *
   * Start dari page 1 (bukan 0) karena lebih user-friendly
   * Page 1 = items 0-4
   * Page 2 = items 5-9
   * Page 3 = items 10-14
   */
  const [currentPage, setCurrentPage] = useState(1);

  /**
   * Calculate: Berapa total halaman?
   *
   * Contoh:
   * - 15 items, 5 per page = 3 halaman
   * - 16 items, 5 per page = 4 halaman (1 item di page terakhir)
   *
   * Math.ceil: Round up, jadi 16/5 = 3.2 → 4 halaman
   */
  const totalPages = useMemo(() => {
    return Math.ceil(allItems.length / ITEMS_PER_PAGE);
  }, [allItems.length, ITEMS_PER_PAGE]);

  /**
   * Calculate: Items yang sudah ditampilkan sampai halaman saat ini
   *
   * Cara kerja:
   * 1. Hitung end index: currentPage * ITEMS_PER_PAGE
   *    - Page 1: 1 * 5 = 5 (items 0-4)
   *    - Page 2: 2 * 5 = 10 (items 0-9)
   *    - Page 3: 3 * 5 = 15 (items 0-14)
   *
   * 2. Slice dari start sampai end
   *    - slice(0, 5) = items pertama 5 buah
   *    - slice(0, 10) = items pertama 10 buah
   *
   * useMemo untuk memoization:
   * - Jika allItems dan ITEMS_PER_PAGE tidak berubah, return value yang sama
   * - Prevent unnecessary re-calculation
   */
  const displayedItems = useMemo(() => {
    const endIndex = currentPage * ITEMS_PER_PAGE;
    return allItems.slice(0, endIndex);
  }, [allItems, currentPage, ITEMS_PER_PAGE]);

  /**
   * Calculate: Ada berapa item yang belum ditampilkan?
   *
   * Rumus: Total items - Items yang sudah ditampilkan
   *
   * Contoh:
   * - Total 15, displayed 5 = remaining 10
   * - Total 15, displayed 10 = remaining 5
   * - Total 15, displayed 15 = remaining 0 (sudah semua)
   */
  const remainingItems = useMemo(() => {
    return allItems.length - displayedItems.length;
  }, [allItems.length, displayedItems.length]);

  /**
   * Calculate: Apakah masih ada halaman berikutnya?
   *
   * Gunakan untuk determine: apakah tombol "Load More" ditampilkan
   *
   * hasNextPage = true jika:
   * - currentPage < totalPages
   *
   * Contoh:
   * - Page 1 of 3: 1 < 3 = true → tampilkan Load More
   * - Page 3 of 3: 3 < 3 = false → jangan tampilkan Load More
   */
  const hasNextPage = currentPage < totalPages;

  /**
   * Action: Load halaman berikutnya
   *
   * useCallback untuk memoization:
   * - Prevent function recreate di setiap render
   * - Prevent unnecessary re-render di child components
   *
   * Logic: Hanya increment page jika masih ada next page
   */
  const loadMore = useCallback(() => {
    setCurrentPage((prev) => {
      // Safety check: jangan exceed total pages
      const nextPage = prev + 1;
      return nextPage <= totalPages ? nextPage : prev;
    });
  }, [totalPages]);

  /**
   * Action: Kembali ke halaman sebelumnya (Show Less)
   *
   * useCallback untuk memoization:
   * - Prevent function recreate di setiap render
   * - Prevent unnecessary re-render di child components
   *
   * Logic: Hanya decrement page jika masih > 1
   * Contoh:
   * - Page 3 → Page 2 (hide 5 items terakhir)
   * - Page 2 → Page 1 (hide 5 items tengah)
   * - Page 1 → Page 1 (tidak bisa less dari page 1)
   */
  const showLess = useCallback(() => {
    setCurrentPage((prev) => {
      // Safety check: jangan kurang dari page 1
      const prevPage = prev - 1;
      return prevPage >= 1 ? prevPage : 1;
    });
  }, []);

  /**
   * Action: Reset pagination ke page 1
   *
   * Gunakan saat:
   * - Filter/search berubah → hasil data berubah
   * - Refresh data → data dari API berubah
   * - Component unmount → cleanup
   *
   * useCallback prevent function recreate
   */
  const reset = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    displayedItems,
    totalPages,
    currentPage,
    hasNextPage,
    remainingItems,
    loadMore,
    showLess,
    reset,
  };
}
