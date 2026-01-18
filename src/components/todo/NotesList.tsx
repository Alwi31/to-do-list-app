import { Trash2, Copy, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Note } from "@/types/todo";

/**
 * ============================================
 * COMPONENT: NotesList
 * ============================================
 *
 * Menampilkan daftar catatan untuk hari ini
 *
 * Features:
 * 1. Tampilkan catatan dengan waktu dibuat
 * 2. Tombol edit catatan
 * 3. Tombol hapus catatan
 * 4. Tombol convert catatan ke todo
 * 5. Visual indikator untuk catatan yang sudah jadi todo
 */
interface NotesListProps {
  notes: Note[];
  onDeleteNote: (id: string) => void;
  onEditNote: (note: { id: string; content: string }) => void;
  onConvertToTodo: (content: string) => void;
}

export function NotesList({
  notes,
  onDeleteNote,
  onEditNote,
  onConvertToTodo,
}: NotesListProps) {
  if (notes.length === 0) {
    return (
      <Card className="border-dashed border-2">
        <CardContent className="pt-6 text-center">
          <div className="text-4xl mb-2">📝</div>
          <p className="text-muted-foreground">
            Belum ada catatan untuk hari ini
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Klik tombol "📝 Tambah Catatan" untuk memulai
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-muted-foreground">
          📝 Catatan Hari Ini ({notes.length})
        </h3>
      </div>

      {notes.map((note) => (
        <Card
          key={note.id}
          className={`transition-all ${
            note.convertedToTodo
              ? "opacity-60 border-success/30"
              : "hover:border-primary/50"
          }`}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardDescription className="text-xs">
                  {new Date(note.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </CardDescription>
              </div>
              {note.convertedToTodo && (
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded-full">
                  ✅ Sudah jadi TODO
                </span>
              )}
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-sm break-words whitespace-pre-wrap">
              {note.content}
            </p>
          </CardContent>

          <div className="flex gap-2 px-6 pb-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEditNote({ id: note.id, content: note.content })}
              className="gap-2"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>

            {!note.convertedToTodo && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onConvertToTodo(note.content)}
                className="gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Jadikan TODO
              </Button>
            )}

            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDeleteNote(note.id)}
              className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
