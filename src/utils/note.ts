import { CustomElement } from '@/components/editor/types';

export const DEFAULT_NOTE_CONTENT: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export const parseNoteContent = (content: unknown): CustomElement[] => {
  if (Array.isArray(content)) {
    return content as CustomElement[];
  }
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content) as CustomElement[];
      return parsed.length ? parsed : DEFAULT_NOTE_CONTENT;
    } catch {
      return DEFAULT_NOTE_CONTENT;
    }
  }
  return DEFAULT_NOTE_CONTENT;
};

export const parseNoteTags = (tags: unknown): string[] => {
  if (Array.isArray(tags)) {
    return tags as string[];
  }
  if (typeof tags === 'string') {
    try {
      const parsed = JSON.parse(tags) as string[];
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      return tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
    }
  }
  return [];
};

