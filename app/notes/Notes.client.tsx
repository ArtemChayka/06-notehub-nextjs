'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api';
import css from './Notes.module.css';

export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['notes', { page: currentPage, search: searchQuery }],
    queryFn: () => fetchNotes({ page: currentPage, search: searchQuery }),
  });

  const handlePageChange = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (error) {
    return <p>Could not fetch the list of notes. {error.message}</p>;
  }

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox onSearchChange={handleSearchChange} value={searchQuery} />
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>
      {data?.notes && data.notes.length > 0 ? (
        <>
          <NoteList notes={data.notes} />
          <Pagination
            pageCount={data.totalPages}
            onPageChange={handlePageChange}
            currentPage={currentPage}
          />
        </>
      ) : (
        <p className={css.noNotes}>No notes found.</p>
      )}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
