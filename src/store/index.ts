import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Note, Tag, Category } from '@/types';
import { AUTH_STORAGE_KEY } from '@/constant';

interface AuthState {
  user: User | null;
  token: string | null;
  login: ( token: string) => void;
  logout: () => void;
  setUser: (user?: User) => void;
}

interface NoteState {
  notes: Note[];
  currentNote: Note | null;
  tags: Tag[];
  categories: Category[];
  isLoading: boolean;
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  setCurrentNote: (note: Note | null) => void;
  setTags: (tags: Tag[]) => void;
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
}

interface UIState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: ( token: string) =>
        set({  token }),
      logout: () =>
        set({ user: null, token: null }),
      
      setUser: (user: User | undefined) =>
        set({ user: user || null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export const useNoteStore = create<NoteState>((set) => ({
  notes: [],
  currentNote: null,
  tags: [],
  categories: [],
  isLoading: false,
  setNotes: (notes) => set({ notes }),
  addNote: (note) =>
    set((state) => ({ notes: [note, ...state.notes] })),
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
      currentNote:
        state.currentNote?.id === id
          ? { ...state.currentNote, ...updates }
          : state.currentNote,
    })),
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      currentNote:
        state.currentNote?.id === id ? null : state.currentNote,
    })),
  setCurrentNote: (note) => set({ currentNote: note }),
  setTags: (tags) => set({ tags }),
  setCategories: (categories) => set({ categories }),
  setLoading: (loading) => set({ isLoading: loading }),
}));

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: 'light',
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'ui-storage',
    }
  )
);
