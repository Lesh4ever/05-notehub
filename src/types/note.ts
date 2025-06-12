export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
}
