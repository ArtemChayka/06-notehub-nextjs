'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import Pagination from '@/components/Pagination/Pagination';
import { fetchNotes } from '@/lib/api';
import css from './Notes.module.css';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function NotesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500); 

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['notes', { page: currentPage, search: debouncedSearchQuery }],
    queryFn: () =>
      fetchNotes({ page: currentPage, search: debouncedSearchQuery }),
    placeholderData: (previousData) => previousData, 
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

  const isDataFetching = isFetching;

  return (
    <div className={css.container}>
      <div className={css.toolbar}>
        <SearchBox onSearchChange={handleSearchChange} value={searchQuery} />
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          Create note
        </button>
      </div>
      {isDataFetching && (
        <p className={css.loadingText}>Fetching new notes...</p>
      )}

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
