import { 
  LoginForm, 
  RegisterForm, 
  User, 
  Note, 
  CreateNoteForm, 
  UpdateNoteForm,
  Tag,
  Category,
  SearchParams 
} from '@/types';
import { backendBasePath, AUTH_STORAGE_KEY } from '@/constant';

// 导入模拟数据服务
import { 
  mockAuthService, 
  mockNoteService, 
  mockTagService, 
  mockCategoryService,
  mockUsers
} from './mockData';

// 使用真实后端API：axios
import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: backendBasePath,
  timeout: 10000,
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem(AUTH_STORAGE_KEY) 
      ? JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)!).state.token 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // 兼容 basePath '/tiny-note'
      window.location.href = '/tiny-note/login';
    }
    return Promise.reject(error);
  }
);

// 用户认证API
export const authAPI = {
  login: async (data: LoginForm): Promise<{ user_info: User; token: string }> => {
    const res = await api.post('/auth/login', {
      email: data.email,
      password: data.password,
    });
    return res.data;
  },

  register: async (data: RegisterForm): Promise<any> => {
    // 调用真实后端注册接口
    const res = await api.post('/auth/register', {
      username: data.username,
      email: data.email,
      password: data.password,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    // 模拟登出
    await new Promise(resolve => setTimeout(resolve, 300));
  },

  getProfile: async (): Promise<User> => {
    // 模拟获取用户信息
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockUsers[0];
  },
};

// 笔记API
export const noteAPI = {
  getNotes: async (params?: SearchParams): Promise<{ notes: Note[]; total: number }> => {
    return await mockNoteService.getNotes();
  },

  getNote: async (id: string): Promise<Note> => {
    const notes = await mockNoteService.getNotes();
    const note = notes.notes.find(n => n.id === id);
    if (!note) {
      throw new Error('笔记不存在');
    }
    return note;
  },

  createNote: async (data: CreateNoteForm): Promise<Note> => {
    return await mockNoteService.createNote(data);
  },

  updateNote: async (id: string, data: Partial<CreateNoteForm>): Promise<Note> => {
    return await mockNoteService.updateNote(id, data);
  },

  deleteNote: async (id: string): Promise<void> => {
    await mockNoteService.deleteNote(id);
  },

  searchNotes: async (query: string): Promise<Note[]> => {
    return await mockNoteService.searchNotes(query);
  },
};

// 标签API
export const tagAPI = {
  getTags: async (): Promise<Tag[]> => {
    return await mockTagService.getTags();
  },

  createTag: async (data: { name: string; color: string }): Promise<Tag> => {
    return await mockTagService.createTag(data);
  },

  updateTag: async (id: string, data: Partial<Tag>): Promise<Tag> => {
    // 模拟更新标签
    await new Promise(resolve => setTimeout(resolve, 500));
    const tags = await mockTagService.getTags();
    const tag = tags.find(t => t.id === id);
    if (!tag) {
      throw new Error('标签不存在');
    }
    return { ...tag, ...data };
  },

  deleteTag: async (id: string): Promise<void> => {
    // 模拟删除标签
    await new Promise(resolve => setTimeout(resolve, 400));
  },
};

// 分类API
export const categoryAPI = {
  getCategories: async (): Promise<Category[]> => {
    return await mockCategoryService.getCategories();
  },

  createCategory: async (data: { name: string; color: string }): Promise<Category> => {
    return await mockCategoryService.createCategory(data);
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    // 模拟更新分类
    await new Promise(resolve => setTimeout(resolve, 500));
    const categories = await mockCategoryService.getCategories();
    const category = categories.find(c => c.id === id);
    if (!category) {
      throw new Error('分类不存在');
    }
    return { ...category, ...data };
  },

  deleteCategory: async (id: string): Promise<void> => {
    // 模拟删除分类
    await new Promise(resolve => setTimeout(resolve, 400));
  },
};

// 当有真实后端API时，可以导出api实例
// export default api;
