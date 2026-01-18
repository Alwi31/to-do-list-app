import { useState, KeyboardEvent, useEffect } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * ============================================
 * COMPONENT: NoteForm
 * ============================================
 *
 * Form untuk menambahkan dan mengedit catatan harian
 * Ditampilkan dalam modal dialog
 *
 * Features:
 * 1. Input textarea untuk catatan
 * 2. Support mode create dan edit
 * 3. Tombol submit dan convert to todo
 * 4. Keyboard shortcuts (Ctrl+Enter to submit)
 */
interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote: (content: string) => void;
  onEditNote?: (id: string, content: string) => void;
  onConvertToTodo: (content: string) => void;
  editingNote?: { id: string; content: string } | null;
}

export function NoteForm({
  isOpen,
  onClose,
  onAddNote,
  onEditNote,
  onConvertToTodo,
  editingNote,
}: NoteFormProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = !!editingNote;

  useEffect(() => {
    if (editingNote) {
      setContent(editingNote.content);
    } else {
      setContent("");
    }
  }, [editingNote, isOpen]);

  const handleAddNote = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      onAddNote(content);
      setContent("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = async () => {
    if (!content.trim() || !editingNote) return;

    setIsSubmitting(true);
    try {
      onEditNote?.(editingNote.id, content);
      setContent("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConvertToTodo = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      onConvertToTodo(content);
      setContent("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+Enter atau Cmd+Enter untuk submit langsung sebagai todo
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleConvertToTodo();
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setContent("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>
              {isEditMode ? "✏️ Edit Catatan" : "📝 Tambah Catatan Baru"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Textarea
            placeholder="Tuliskan catatan, insight, atau kejadian penting..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={6}
            className="resize-none"
          />

          <div className="text-xs text-muted-foreground">
            💡 Tip: Gunakan Ctrl+Enter untuk langsung jadikan TODO
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Batalkan
          </Button>

          {isEditMode ? (
            <Button
              onClick={handleEditNote}
              disabled={isSubmitting || !content.trim()}
              className="gap-2"
            >
              <span>💾 Simpan Perubahan</span>
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={handleAddNote}
                disabled={isSubmitting || !content.trim()}
                className="gap-2"
              >
                <span>💾 Simpan Catatan</span>
              </Button>

              <Button
                onClick={handleConvertToTodo}
                disabled={isSubmitting || !content.trim()}
                className="gap-2"
              >
                <Copy className="w-4 h-4" />
                <span>Jadikan TODO</span>
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
