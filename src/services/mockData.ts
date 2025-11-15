import { User, Note, Tag, Category } from '@/types';

// 模拟用户数据
export const mockUsers: User[] = [
  {
    id: '1',
    username: 'demo',
    email: 'demo@example.com',
    avatar: '',
  },
];

// 模拟标签数据
export const mockTags: Tag[] = [
  {
    id: '1',
    name: '工作',
    color: '#1890ff',
    userId: '1',
  },
  {
    id: '2',
    name: '学习',
    color: '#52c41a',
    userId: '1',
  },
  {
    id: '3',
    name: '生活',
    color: '#faad14',
    userId: '1',
  },
  {
    id: '4',
    name: '技术',
    color: '#722ed1',
    userId: '1',
  },
];

// 模拟分类数据
export const mockCategories: Category[] = [
  {
    id: '1',
    name: '工作笔记',
    color: '#1890ff',
    userId: '1',
  },
  {
    id: '2',
    name: '学习笔记',
    color: '#52c41a',
    userId: '1',
  },
  {
    id: '3',
    name: '生活记录',
    color: '#faad14',
    userId: '1',
  },
  {
    id: '4',
    name: '技术文档',
    color: '#722ed1',
    userId: '1',
  },
];

// 模拟笔记数据
export const mockNotes: Note[] = [
  {
    id: '1',
    title: '欢迎使用 Tiny Note',
    content: [
      {
        type: 'paragraph',
        children: [
          { text: '欢迎使用 ' },
          { text: 'Tiny Note', bold: true },
          { text: '！这是一个功能强大的笔记应用。' },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { text: '主要功能包括：' },
        ],
      },
      {
        type: 'bulleted-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: '富文本编辑' }],
          },
          {
            type: 'list-item',
            children: [{ text: '标签管理' }],
          },
          {
            type: 'list-item',
            children: [{ text: '分类组织' }],
          },
          {
            type: 'list-item',
            children: [{ text: '搜索功能' }],
          },
        ],
      },
    ],
    tags: ['技术', '介绍'],
    category: '1',
    isPublic: true,
    userId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Markdown 语法示例',
    content: [
      {
        type: 'heading-one',
        children: [{ text: 'Markdown 语法示例' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: '这是 ' },
          { text: '粗体文本', bold: true },
          { text: '，这是 ' },
          { text: '斜体文本', italic: true },
          { text: '。' },
        ],
      },
      {
        type: 'block-quote',
        children: [{ text: '这是一个引用块，用于突出重要信息。' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: '代码示例：' },
          { text: 'console.log("Hello World")', code: true },
        ],
      },
    ],
    tags: ['学习', 'Markdown'],
    category: '2',
    isPublic: false,
    userId: '1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    title: '项目开发计划',
    content: [
      {
        type: 'heading-two',
        children: [{ text: '项目开发计划' }],
      },
      {
        type: 'paragraph',
        children: [{ text: '以下是本月的开发计划：' }],
      },
      {
        type: 'numbered-list',
        children: [
          {
            type: 'list-item',
            children: [{ text: '完成用户认证系统' }],
          },
          {
            type: 'list-item',
            children: [{ text: '实现笔记管理功能' }],
          },
          {
            type: 'list-item',
            children: [{ text: '优化用户界面' }],
          },
          {
            type: 'list-item',
            children: [{ text: '添加搜索功能' }],
          },
        ],
      },
    ],
    tags: ['工作', '计划'],
    category: '1',
    isPublic: false,
    userId: '1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

// 模拟认证服务
export const mockAuthService = {
  login: async (email: string, password: string) => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'demo@example.com' && password === 'demo123') {
      return {
        user: mockUsers[0],
        token: 'mock-jwt-token-' + Date.now(),
      };
    }
    throw new Error('邮箱或密码错误');
  },

  register: async (username: string, email: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      email,
      avatar: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    mockUsers.push(newUser);
    
    return {
      user: newUser,
      token: 'mock-jwt-token-' + Date.now(),
    };
  },
};

// 模拟笔记服务
export const mockNoteService = {
  getNotes: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      notes: mockNotes,
      total: mockNotes.length,
    };
  },

  createNote: async (noteData: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newNote: Note = {
      id: Date.now().toString(),
      ...noteData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    mockNotes.unshift(newNote);
    return newNote;
  },

  updateNote: async (id: string, updates: any) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const noteIndex = mockNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('笔记不存在');
    }
    
    mockNotes[noteIndex] = {
      ...mockNotes[noteIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return mockNotes[noteIndex];
  },

  deleteNote: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const noteIndex = mockNotes.findIndex(note => note.id === id);
    if (noteIndex === -1) {
      throw new Error('笔记不存在');
    }
    
    mockNotes.splice(noteIndex, 1);
  },

  searchNotes: async (query: string) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return mockNotes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      JSON.stringify(note.content).toLowerCase().includes(query.toLowerCase())
    );
  },
};

// 模拟标签服务
export const mockTagService = {
  getTags: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockTags;
  },

  createTag: async (tagData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newTag: Tag = {
      id: Date.now().toString(),
      ...tagData,
      userId: '1',
    };
    
    mockTags.push(newTag);
    return newTag;
  },
};

// 模拟分类服务
export const mockCategoryService = {
  getCategories: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockCategories;
  },

  createCategory: async (categoryData: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData,
      userId: '1',
    };
    
    mockCategories.push(newCategory);
    return newCategory;
  },
};
