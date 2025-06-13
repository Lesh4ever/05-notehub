import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useDebounce } from "../../hooks/useDebounce";
import { keepPreviousData } from "@tanstack/react-query";
import SearchBox from "../SearchBox/SearchBox";
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import NoteModal from "../NoteModal/NoteModal";
import { fetchNotes, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";

import css from "./App.module.css";

export default function App() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  const queryClient = useQueryClient();

  const { data, isPending, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page }),
    placeholderData: keepPreviousData,
  });

  const { mutate: removeNote } = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes", debouncedSearch, page],
      });
    },
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  return (
    <div className={css.app}>
      <Toaster position="top-right" reverseOrder={false} />
      <header className={css.toolbar}>
        <SearchBox value={search} onSearch={handleSearch} />
        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page}
            onPageChange={handlePageChange}
          />
        )}
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isPending && <p>Loading...</p>}
      {isError && <p>Something went wrong. Please try again.</p>}

      {data && data.notes.length > 0 && (
        <NoteList notes={data.notes} onDelete={removeNote} />
      )}

      {isModalOpen && <NoteModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
