import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Note } from '../../types/note';
import { deleteNote } from '../../lib/api';
import css from './NoteList.module.css';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('Error deleting note:', error);
    },
  });

  const handleNoteDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <div className={css.actions}>
              <Link href={`/notes/${note.id}`} className={css.linkButton}>
                View details
              </Link>
              <button
                className={css.button}
                onClick={() => handleNoteDelete(note.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </button>
            </div>
          </div>
          {deleteMutation.isError && (
            <div className={css.error}>
              Error deleting note: {deleteMutation.error?.message}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
