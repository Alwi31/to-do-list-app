import { useState, useMemo, useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";
import type { Note } from "@/types/todo";

/**
 * ============================================
 * CUSTOM HOOK: useNotes
 * ============================================
 *
 * Hook untuk mengelola catatan harian
 *
 * Fitur:
 * 1. Tambah, edit, hapus catatan
 * 2. Filter catatan berdasarkan tanggal
 * 3. Konversi catatan ke todo
 * 4. Persist data di localStorage
 */
export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);

  /**
   * Helper: Generate unique ID
   */
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Helper: Get today's date string (YYYY-MM-DD)
   */
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  /**
   * Add Note
   *
   * Membuat catatan baru untuk hari ini
   */
  const addNote = useCallback(
    (content: string): Note => {
      const trimmedContent = content.trim();
      if (!trimmedContent) throw new Error("Konten catatan tidak boleh kosong");

      const now = new Date().toISOString();
      const newNote: Note = {
        id: generateId(),
        content: trimmedContent,
        date: getTodayDate(),
        createdAt: now,
        updatedAt: now,
        convertedToTodo: false,
      };

      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    },
    [setNotes],
  );

  /**
   * Update Note
   *
   * Mengubah konten catatan yang sudah ada
   */
  const updateNote = useCallback(
    (id: string, content: string): void => {
      const trimmedContent = content.trim();
      if (!trimmedContent) throw new Error("Konten catatan tidak boleh kosong");

      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                content: trimmedContent,
                updatedAt: new Date().toISOString(),
              }
            : note,
        ),
      );
    },
    [setNotes],
  );

  /**
   * Delete Note
   */
  const deleteNote = useCallback(
    (id: string): void => {
      setNotes((prev) => prev.filter((note) => note.id !== id));
    },
    [setNotes],
  );

  /**
   * Mark Note as Converted to Todo
   *
   * Menandai bahwa catatan sudah dikonversi menjadi todo
   */
  const markAsConverted = useCallback(
    (id: string): void => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                convertedToTodo: true,
                updatedAt: new Date().toISOString(),
              }
            : note,
        ),
      );
    },
    [setNotes],
  );

  /**
   * Get Notes for Today
   *
   * Mengambil semua catatan untuk hari ini
   */
  const getTodayNotes = useCallback((): Note[] => {
    const today = getTodayDate();
    return notes.filter((note) => note.date === today);
  }, [notes]);

  /**
   * Get Notes for Specific Date
   */
  const getNotesByDate = useCallback(
    (date: string): Note[] => {
      return notes.filter((note) => note.date === date);
    },
    [notes],
  );

  /**
   * Get All Notes (memoized untuk performa)
   */
  const allNotes = useMemo(() => {
    return notes.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [notes]);

  /**
   * Stats untuk notes
   */
  const stats = useMemo(() => {
    const today = getTodayDate();
    const todayNotes = notes.filter((note) => note.date === today);

    return {
      total: notes.length,
      today: todayNotes.length,
      notConverted: todayNotes.filter((note) => !note.convertedToTodo).length,
    };
  }, [notes]);

  return {
    notes: allNotes,
    todayNotes: getTodayNotes(),
    addNote,
    updateNote,
    deleteNote,
    markAsConverted,
    getNotesByDate,
    getTodayDate,
    stats,
  };
}
