import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Check, Trash2, Pencil, X } from 'lucide-react';
import type { Todo } from '@/types/todo';

/**
 * ============================================
 * COMPONENT: TodoItem
 * ============================================
 * 
 * Komponen untuk menampilkan satu item todo
 * 
 * Prinsip yang diterapkan:
 * 1. Single Responsibility - hanya render 1 todo
 * 2. Props-down, Events-up pattern
 * 3. Local state untuk UI mode (edit mode)
 * 
 * Performance:
 * - Komponen ini bisa di-wrap dengan React.memo jika list besar
 * - Karena menerima callbacks, parent harus useCallback
 */
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  /**
   * Local State untuk Edit Mode
   * 
   * Mengapa local state?
   * - Edit mode hanya relevan untuk item ini
   * - Tidak perlu di-share ke komponen lain
   */
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.text);
  
  /**
   * Ref untuk input edit
   * Digunakan untuk auto-focus saat masuk edit mode
   */
  const editInputRef = useRef<HTMLInputElement>(null);

  /**
   * Effect: Focus input saat masuk edit mode
   * 
   * Dependency: isEditing
   * Jalan saat isEditing berubah dari false ke true
   */
  useEffect(() => {
    if (isEditing) {
      editInputRef.current?.focus();
      // Select all text untuk memudahkan edit
      editInputRef.current?.select();
    }
  }, [isEditing]);

  /**
   * Handler: Mulai edit mode
   */
  const handleStartEdit = () => {
    setEditValue(todo.text);
    setIsEditing(true);
  };

  /**
   * Handler: Cancel edit
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(todo.text); // Reset ke nilai asli
  };

  /**
   * Handler: Save edit
   */
  const handleSaveEdit = () => {
    const trimmedValue = editValue.trim();
    
    if (trimmedValue && trimmedValue !== todo.text) {
      onEdit(todo.id, trimmedValue);
    }
    
    setIsEditing(false);
  };

  /**
   * Handler: Keyboard events untuk edit mode
   * - Enter: Save
   * - Escape: Cancel
   */
  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  /**
   * Render: Edit Mode
   * 
   * Terpisah untuk clarity
   * Bisa di-extract ke sub-component jika lebih complex
   */
  if (isEditing) {
    return (
      <div className="flex items-center gap-3 p-4 bg-card rounded-xl border-2 border-primary/30
                      animate-fade-in">
        <input
          ref={editInputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleEditKeyDown}
          className="flex-1 px-3 py-2 rounded-lg border border-input
                     bg-background text-foreground
                     focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="Edit todo"
        />
        
        <button
          onClick={handleSaveEdit}
          className="p-2 rounded-lg bg-success text-success-foreground
                     hover:opacity-90 transition-opacity"
          aria-label="Simpan"
        >
          <Check className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleCancelEdit}
          className="p-2 rounded-lg bg-muted text-muted-foreground
                     hover:bg-destructive hover:text-destructive-foreground
                     transition-colors"
          aria-label="Batal"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  /**
   * Render: Normal Mode
   * 
   * Layout dengan flexbox:
   * - Checkbox di kiri
   * - Text di tengah (flex-1)
   * - Action buttons di kanan
   */
  return (
    <div 
      className={`
        group flex items-center gap-3 p-4 
        bg-card rounded-xl border border-border
        shadow-card hover:shadow-card-hover
        transition-all duration-200
        animate-fade-in
        ${todo.completed ? 'opacity-75' : ''}
      `}
    >
      {/*
        Custom Checkbox
        
        Menggunakan button dengan role="checkbox" untuk:
        - Full control atas styling
        - Accessibility tetap terjaga
        - Animasi custom
      */}
      <button
        role="checkbox"
        aria-checked={todo.completed}
        onClick={() => onToggle(todo.id)}
        className={`
          w-6 h-6 rounded-full border-2 flex-shrink-0
          flex items-center justify-center
          transition-all duration-200
          ${todo.completed 
            ? 'bg-success border-success text-success-foreground' 
            : 'border-muted-foreground hover:border-primary'
          }
        `}
        aria-label={todo.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {todo.completed && (
          <Check className="w-4 h-4 animate-check-bounce" />
        )}
      </button>

      {/*
        Todo Text
        
        Conditional styling untuk completed state:
        - Line-through
        - Opacity reduced
        - Color muted
      */}
      <span 
        className={`
          flex-1 text-base leading-relaxed
          transition-all duration-200
          ${todo.completed 
            ? 'line-through text-muted-foreground' 
            : 'text-foreground'
          }
        `}
      >
        {todo.text}
      </span>

      {/*
        Action Buttons
        
        Pattern: Appear on hover (group-hover)
        - Edit button
        - Delete button
        
        Opacity transition untuk smooth appearance
      */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100
                      transition-opacity duration-200">
        <button
          onClick={handleStartEdit}
          className="p-2 rounded-lg text-muted-foreground
                     hover:bg-secondary hover:text-foreground
                     transition-colors duration-200"
          aria-label="Edit todo"
        >
          <Pencil className="w-4 h-4" />
        </button>
        
        <button
          onClick={() => onDelete(todo.id)}
          className="p-2 rounded-lg text-muted-foreground
                     hover:bg-destructive/10 hover:text-destructive
                     transition-colors duration-200"
          aria-label="Hapus todo"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
