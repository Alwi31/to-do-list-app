import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

/**
 * ============================================
 * COMPONENT: TodoInput
 * ============================================
 * 
 * Komponen untuk menambahkan todo baru
 * 
 * Prinsip yang diterapkan:
 * 1. Controlled Component - value dikelola oleh React state
 * 2. Single Responsibility - hanya handle input
 * 3. Props-down - menerima onAdd dari parent
 * 
 * Props Interface:
 * @param onAdd - Callback function saat todo ditambahkan
 */
interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  /**
   * Local State
   * 
   * Menggunakan local state karena:
   * - Value input hanya relevan untuk komponen ini
   * - Tidak perlu di-share ke komponen lain
   * - Parent hanya perlu tahu saat submit (via onAdd)
   */
  const [value, setValue] = useState('');
  
  /**
   * useRef untuk akses DOM element
   * 
   * Use case:
   * - Auto-focus input saat mount
   * - Bisa juga untuk focus setelah submit
   */
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-focus input saat komponen mount
   * 
   * Empty dependency array [] = hanya jalan sekali saat mount
   */
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /**
   * Handle form submission
   * 
   * Kenapa tidak inline di JSX?
   * - Logic lebih dari 1 baris
   * - Lebih readable
   * - Mudah di-test
   */
  const handleSubmit = () => {
    const trimmedValue = value.trim();
    
    if (trimmedValue) {
      onAdd(trimmedValue);
      setValue(''); // Reset input setelah submit
      inputRef.current?.focus(); // Focus kembali ke input
    }
  };

  /**
   * Handle keyboard events
   * 
   * Enter key untuk submit (common UX pattern)
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex gap-3">
      {/*
        Input Field
        
        Styling notes:
        - flex-1 untuk mengisi sisa ruang
        - transition untuk smooth hover/focus effect
        - focus:ring untuk accessibility (visual focus indicator)
      */}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Apa yang ingin kamu kerjakan hari ini?"
        className="flex-1 px-4 py-3 rounded-lg border border-input 
                   bg-card text-foreground placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/30 
                   focus:border-primary transition-all duration-200
                   text-base"
        aria-label="Input todo baru"
      />
      
      {/*
        Submit Button
        
        Accessibility:
        - aria-label untuk screen readers
        - disabled state saat input kosong
      */}
      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="px-4 py-3 rounded-lg bg-primary text-primary-foreground
                   font-medium flex items-center gap-2
                   hover:opacity-90 active:scale-95
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200"
        aria-label="Tambah todo"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Tambah</span>
      </button>
    </div>
  );
}
