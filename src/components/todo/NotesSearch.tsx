import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Note } from "@/types/todo";

/**
 * ============================================
 * COMPONENT: NotesSearch
 * ============================================
 *
 * Komponen untuk mencari catatan berdasarkan:
 * 1. Tanggal (YYYY-MM-DD)
 * 2. Hari dalam seminggu (Senin, Selasa, dll)
 * 3. Konten catatan (keyword)
 *
 * Features:
 * 1. Search input dengan placeholder yang helpful
 * 2. Auto-detect jenis pencarian (tanggal/hari/keyword)
 * 3. Tombol clear untuk reset pencarian
 * 4. Tampilkan hasil pencarian
 */
interface NotesSearchProps {
  notes: Note[];
  onSelectNote?: (note: Note) => void;
}

export function NotesSearch({ notes, onSelectNote }: NotesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Helper: Format tanggal ke nama hari
   */
  const getDayName = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[date.getDay()];
  };

  /**
   * Helper: Format tanggal untuk display
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  /**
   * Filter catatan berdasarkan search query
   */
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) {
      return notes;
    }

    const query = searchQuery.toLowerCase().trim();

    return notes.filter((note) => {
      // Check by date (YYYY-MM-DD format)
      if (note.date.includes(query)) {
        return true;
      }

      // Check by day name (Senin, Selasa, dll)
      const dayName = getDayName(note.date).toLowerCase();
      if (dayName.includes(query)) {
        return true;
      }

      // Check by content (keyword)
      if (note.content.toLowerCase().includes(query)) {
        return true;
      }

      return false;
    });
  }, [notes, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Cari catatan... (tanggal, hari, atau keyword)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10"
        />
        {searchQuery && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleClearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div className="text-xs text-muted-foreground">
          {filteredNotes.length > 0 ? (
            <span>
              Ditemukan {filteredNotes.length} catatan dari {notes.length} total
            </span>
          ) : (
            <span>Tidak ada catatan yang sesuai dengan pencarian</span>
          )}
        </div>
      )}

      {/* Search Results */}
      {searchQuery && filteredNotes.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {filteredNotes.map((note) => (
            <Card
              key={note.id}
              className="cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => onSelectNote?.(note)}
            >
              <CardContent className="pt-3 pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      {formatDate(note.date)}
                    </p>
                    <p className="text-sm break-words line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                  {note.convertedToTodo && (
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full whitespace-nowrap">
                      ✅
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Messages */}
      {!searchQuery && notes.length > 0 && (
        <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <p className="font-medium mb-2">💡 Tips pencarian:</p>
          <ul className="space-y-1">
            <li>
              • Cari berdasarkan <strong>tanggal</strong>: "2025-01-18"
            </li>
            <li>
              • Cari berdasarkan <strong>hari</strong>: "Senin", "Selasa", dll
            </li>
            <li>
              • Cari berdasarkan <strong>keyword</strong>: "meeting", "rapat",
              dll
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
