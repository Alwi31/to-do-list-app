import { Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * ============================================
 * COMPONENT: PaginationLoadMore
 * ============================================
 *
 * Tombol "Load More" dan "Show Less" untuk pagination
 *
 * Fitur:
 * 1. Load More button - untuk load items berikutnya
 * 2. Show Less button - untuk collapse kembali ke items awal
 * 3. Loading state saat data sedang fetch
 * 4. Disable saat tidak ada item tersisa / sudah di page 1
 * 5. Accessible dengan proper ARIA attributes
 *
 * Best practice:
 * - Gunakan button instead of div untuk accessibility
 * - Tambahkan loading state untuk UX feedback
 * - Show remaining count untuk user awareness
 * - Dual button: load more & show less untuk full control
 */
interface PaginationLoadMoreProps {
  /**
   * Callback saat "Load More" tombol di-klik
   *
   * Dipanggil dari parent (Index):
   * onClick={() => loadMoreTodos()}
   */
  onLoadMore: () => void;

  /**
   * Callback saat "Show Less" tombol di-klik
   *
   * Dipanggil dari parent (Index):
   * onClick={() => showLess()}
   */
  onShowLess: () => void;

  /**
   * Berapa item yang siap di-load
   *
   * Tampilkan di tombol: "Load 5 More"
   *
   * Contoh:
   * - remainingItems = 3 → "Load 3 More"
   * - remainingItems = 10 → "Load More (10)"
   */
  remainingItems: number;

  /**
   * Apakah user sudah di page > 1?
   *
   * Gunakan untuk determine: tampilkan "Show Less" button?
   * - canShowLess = true (page > 1) → tampilkan
   * - canShowLess = false (page = 1) → sembunyikan
   */
  canShowLess: boolean;

  /**
   * Apakah tombol disabled?
   *
   * Load More disabled ketika:
   * - remainingItems = 0 (sudah semua)
   * - isLoading = true (sedang loading)
   *
   * Show Less disabled ketika:
   * - canShowLess = false (sudah di page 1)
   */
  disabled?: boolean;

  /**
   * Apakah sedang loading data?
   *
   * Tampilkan loading spinner saat true
   */
  isLoading?: boolean;
}

export function PaginationLoadMore({
  onLoadMore,
  onShowLess,
  remainingItems,
  canShowLess,
  disabled = false,
  isLoading = false,
}: PaginationLoadMoreProps) {
  /**
   * Calculate label untuk tombol Load More
   *
   * Logic:
   * - Jika ada item tersisa: "Load 5 More" atau "Load More (5)"
   * - Jika tidak ada: "✅ Semua Catatan Sudah Dimuat"
   *
   * User-friendly: Show jumlah item yang bisa di-load
   */
  const getLoadMoreLabel = () => {
    if (remainingItems === 0) {
      return "✅ Semua Dimuat";
    }
    if (remainingItems <= 5) {
      return `Load ${remainingItems} More`;
    }
    return `Load More (${remainingItems})`;
  };

  return (
    <div className="flex justify-center gap-3 py-4 flex-wrap">
      {/**
       * Show Less Button
       *
       * Tampilkan jika:
       * - canShowLess = true (user sudah load items)
       * - remainingItems > 0 (ada items yang di-hide)
       *
       * Gunanya:
       * - Collapse items kembali
       * - Kembali lihat items pertama
       * - Clean UI saat sudah lihat banyak items
       */}
      {canShowLess && (
        <Button
          onClick={onShowLess}
          variant="secondary"
          size="lg"
          className="gap-2 min-w-fit"
          aria-label="Show less todos"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Show Less</span>
        </Button>
      )}

      {/**
       * Load More Button
       *
       * Tampilkan selalu (kecuali semua items sudah dimuat)
       *
       * Features:
       * - Show spinner icon saat loading
       * - Disable saat tidak ada items tersisa
       * - Dynamic label based on remainingItems
       */}
      <Button
        onClick={onLoadMore}
        disabled={disabled || remainingItems === 0}
        variant="outline"
        size="lg"
        className="gap-2 min-w-fit"
        aria-label={`Load more todos (${remainingItems} remaining)`}
        aria-busy={isLoading}
      >
        {/**
         * Show spinner icon saat loading
         *
         * Loader2 dari lucide-react dengan animate-spin
         * Memberikan visual feedback bahwa data sedang di-fetch
         */}
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

        {!isLoading && <ChevronDown className="w-4 h-4" />}

        {/**
         * Tombol label
         *
         * Dynamic: Berubah berdasarkan remainingItems dan isLoading
         */}
        <span>{isLoading ? "Loading..." : getLoadMoreLabel()}</span>
      </Button>
    </div>
  );
}
