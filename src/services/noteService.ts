import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api/notes";
const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN;
console.log("TOKEN:", TOKEN);

const config = {
  headers: {
    Authorization: `Bearer ${TOKEN}`,
  },
};

interface FetchNotesParams {
  search: string;
  page: number;
  perPage?: number;
}

interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  search,
  page,
  perPage = 12,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response = await axios.get(BASE_URL, {
    params: {
      search,
      page,
      perPage,
    },
    ...config,
  });

  return {
    results: response.data.results,
    totalPages: response.data.totalPages,
  };
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await axios.delete(`${BASE_URL}/${id}`, config);
  return response.data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}): Promise<Note> => {
  const response = await axios.post(BASE_URL, noteData, config);
  return response.data;
};
