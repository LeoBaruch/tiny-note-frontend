export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  created_at?: string;
  updated_at?: string;
}

export interface Note {
  id: string;
  title: string;
  content: any[]; // Slate.js content, 传给后端需要转换为json字符串
  category: string;
  tags?: string[];
  isPublic?: boolean;
  created_at?: string;
  updated_at?: string;
}


export interface Tag {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  userId: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateNoteForm {
  title: string;
  content: string;
  category: string;
  tags?: string;
  isPublic?: boolean;
}

export interface UpdateNoteForm extends Partial<CreateNoteForm> {
  id: string;
}

export interface SearchParams {
  query?: string;
  tags?: string[];
  category?: string;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}
