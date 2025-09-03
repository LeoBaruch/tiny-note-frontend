
import { BaseEditor, BaseElement } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type HotKeyDict = {
  'mod+b': string
  'mod+i': string
  'mod+u': string
  'mod+`': string
}

export const HOTKEYS: HotKeyDict = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}
export const LIST_TYPES = ['numbered-list', 'bulleted-list'] as const
export const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify'] as const

export type TextAlignType = typeof TEXT_ALIGN_TYPES[number]
export type ListType = typeof LIST_TYPES[number]


export type CustomElement = BaseElement & {
  type?: string
  align?: TextAlignType
  children: CustomText[]
}

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  code?: boolean
  underline?: boolean
}

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}