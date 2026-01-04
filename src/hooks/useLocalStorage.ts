import { useState, useEffect, useCallback } from 'react';

/**
 * ============================================
 * CUSTOM HOOK: useLocalStorage
 * ============================================
 * 
 * Hook untuk menyinkronkan state dengan localStorage
 * 
 * Mengapa Custom Hook?
 * 1. Reusability - bisa dipakai di mana saja
 * 2. Separation of Concerns - logika storage terpisah dari UI
 * 3. Testability - mudah di-mock untuk testing
 * 4. Abstraction - komponen tidak perlu tahu detail implementasi
 * 
 * @param key - Key untuk localStorage
 * @param initialValue - Nilai default jika belum ada di storage
 * @returns [storedValue, setValue] - Mirip useState tapi persisten
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  /**
   * Lazy initialization dengan function
   * 
   * Mengapa arrow function di useState?
   * - Kode di dalam function hanya dijalankan sekali saat mount
   * - Menghindari pembacaan localStorage setiap render
   * - Ini disebut "lazy initial state"
   */
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Coba baca dari localStorage
      const item = window.localStorage.getItem(key);
      
      // Parse JSON jika ada, atau gunakan initial value
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      /**
       * Error handling untuk kasus:
       * 1. localStorage tidak tersedia (private browsing)
       * 2. JSON parse gagal (data corrupt)
       * 3. Storage quota exceeded
       */
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  /**
   * Setter function yang juga update localStorage
   * 
   * useCallback digunakan untuk:
   * - Memoize function agar referensi stabil
   * - Mencegah re-render yang tidak perlu
   * - Dependencies: key (karena digunakan dalam function body)
   */
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        /**
         * Mendukung dua cara update:
         * 1. setValue(newValue) - langsung set nilai baru
         * 2. setValue(prev => newValue) - functional update
         * 
         * Functional update penting untuk:
         * - Menghindari stale closure
         * - Update yang bergantung pada nilai sebelumnya
         */
        const valueToStore = value instanceof Function 
          ? value(storedValue) 
          : value;
        
        // Update React state
        setStoredValue(valueToStore);
        
        // Simpan ke localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  /**
   * Effect untuk sync dengan localStorage changes dari tab lain
   * 
   * Use case:
   * - User membuka app di 2 tab
   * - Update di satu tab ter-reflect di tab lain
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          console.error('Error parsing storage event');
        }
      }
    };

    // Listen untuk storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup saat unmount
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}
