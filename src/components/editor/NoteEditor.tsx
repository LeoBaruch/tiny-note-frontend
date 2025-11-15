import React, { useCallback, useMemo } from 'react';
import { css } from '@emotion/css';
import isHotkey from 'is-hotkey';
import {
  Editor,
  Element as SlateElement,
  Transforms,
  createEditor,
  BaseElement,
} from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, useSlate, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { Button, Icon, Toolbar } from './components';
import {
  HotKeyDict,
  CustomEditor,
  CustomElement,
  CustomText,
  TextAlignType,
  HOTKEYS,
  TEXT_ALIGN_TYPES,
  ListType,
  LIST_TYPES,
} from './types';

import 'material-icons/iconfont/material-icons.css';

interface NoteEditorProps {
  value: unknown[];
  onChange: (value: unknown[]) => void;
  placeholder?: string;
  readOnly?: boolean;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ 
  value = [], 
  onChange, 
  placeholder = "开始编写...",
  readOnly = false 
}) => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: RenderLeafProps) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <Slate editor={editor} initialValue={value} onChange={onChange}>
      {!readOnly && (
        <Toolbar
          className={css`
            position: sticky;
            top: 0;
            background: white;
            border-bottom: 1px solid #d9d9d9;
            padding: 8px;
            z-index: 10;
          `}
        >
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <MarkButton format="code" icon="code" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="heading-three" icon="looks_3" />
          <BlockButton format="paragraph" icon="text_fields" />
          <BlockButton format="block-quote" icon="format_quote" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
          <BlockButton format="left" icon="format_align_left" />
          <BlockButton format="center" icon="format_align_center" />
          <BlockButton format="right" icon="format_align_right" />
          <BlockButton format="justify" icon="format_align_justify" />
        </Toolbar>
      )}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        spellCheck
        autoFocus={!readOnly}
        readOnly={readOnly}
        className={css`
          flex: 1;
          min-height: 400px;
          padding: 16px;
          overflow-y: auto;
          font-size: 16px;
          line-height: 1.6;
          
          &:focus {
            outline: none;
          }
          
          &[data-slate-editor="true"] {
            outline: none;
          }
        `}
        onKeyDown={event => {
          if (readOnly) return;
          
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault();
              const mark = HOTKEYS[hotkey as keyof HotKeyDict];
              toggleMark(editor, mark);
            }
          }
        }}
      />
    </Slate>
  );
};

const toggleBlock = (editor: CustomEditor, format: string) => {
  const isActive = isBlockActive(
    editor,
    format,
    isAlignType(format) ? 'align' : 'type'
  );
  const isList = isListType(format);
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      isListType(n.type) &&
      !isAlignType(format),
    split: true,
  });
  let newProperties: Partial<CustomElement>;
  if (isAlignType(format)) {
    newProperties = {
      align: isActive ? undefined : format as TextAlignType,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes<CustomElement>(editor, newProperties);
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: CustomEditor, format: string) => {
  const isActive = isMarkActive(editor, format as keyof Omit<CustomText, 'text'>);
  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: CustomEditor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;
  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n => {
        if (!Editor.isEditor(n) && SlateElement.isElement(n)) {
          if (blockType === 'align' && isAlignElement(n)) {
            return n.align === format;
          }
          return n.type === format;
        }
        return false;
      },
    })
  );
  return !!match;
};

const isMarkActive = (editor: CustomEditor, format: keyof Omit<CustomText, 'text'>) => {
  const marks = Editor.marks(editor) as Partial<CustomText> | null;
  return marks ? marks[format] === true : false;
};

interface ElementProps {
  attributes: React.HTMLAttributes<HTMLElement>;
  children: React.ReactNode;
  element: CustomElement;
}

interface LeafProps {
  attributes: RenderLeafProps['attributes'];
  children: React.ReactNode;
  leaf: Omit<CustomText, 'text'>;
}

const Element = ({ attributes, children, element }: ElementProps) => {
  const style: React.CSSProperties = {};
  if (isAlignElement(element)) {
    style.textAlign = element.align;
  }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'heading-three':
      return (
        <h3 style={style} {...attributes}>
          {children}
        </h3>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    case 'paragraph':
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      );
  }
};

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.code) {
    children = <code>{children}</code>;
  }
  if (leaf.italic) {
    children = <em>{children}</em>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  return <span {...attributes}>{children}</span>;
};

interface ButtonProps {
  format: string;
  icon: string;
}

const BlockButton = ({ format, icon }: ButtonProps) => {
  const editor = useSlate() as CustomEditor;
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        isAlignType(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const MarkButton = ({ format, icon }: ButtonProps) => {
  const editor = useSlate() as CustomEditor;
  return (
    <Button
      active={isMarkActive(editor, format as keyof Omit<CustomText, 'text'>)}
      onMouseDown={event => {
        event.preventDefault();
        toggleMark(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  );
};

const isAlignType = (format: string): format is TextAlignType => {
  return TEXT_ALIGN_TYPES.includes(format as TextAlignType);
};

const isListType = (format: string): format is ListType => {
  return LIST_TYPES.includes(format as ListType);
};

const isAlignElement = (element: BaseElement & { align?: string }): element is BaseElement & { align: TextAlignType } => {
  return 'align' in element;
};

export default NoteEditor;
