import axios from 'axios';
import { Note } from '../types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

if (!TOKEN) {
  console.error(
    'VITE_NOTEHUB_TOKEN is not defined. Please check your .env file.',
  );
}

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
});

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: Note['tag'];
}

export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await instance.get<FetchNotesResponse>('/notes', {
    params: {
      page,
      perPage,
      search,
    },
  });
  // console.log(data);

  return data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const { data } = await instance.post<Note>('/notes', note);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await instance.delete<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await instance.get<Note>(`/notes/${id}`);
  return data;
};