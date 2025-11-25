'use client';

import React, { useEffect, useState } from 'react';
import {
  App,
  Card,
  Form,
  Input,
  Button,
  Select,
  Switch,
  Space,
  Typography,
  Spin,
} from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore, useNoteStore } from '@/store';
import { noteAPI } from '@/services/api';
import { CreateNoteForm, Note } from '@/types';
import NoteEditor from '@/components/editor/NoteEditor';
import { CustomElement } from '@/components/editor/types';
import { DEFAULT_NOTE_CONTENT, parseNoteContent, parseNoteTags } from '@/utils/note';

const { Title } = Typography;
const { Option } = Select;

type EditNoteFormValues = Omit<CreateNoteForm, 'content' | 'tags'> & {
  tags?: string[];
};

export default function EditNotePage() {
  const params = useParams<{ id: string }>();
  const noteId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const router = useRouter();
  const { user } = useAuthStore();
  const { tags, categories, updateNote: updateNoteInStore } = useNoteStore();
  const [form] = Form.useForm<EditNoteFormValues>();
  const [content, setContent] = useState<CustomElement[]>(DEFAULT_NOTE_CONTENT);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { message } = App.useApp();

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;
      try {
        setInitialLoading(true);
        const note = await noteAPI.getNote(noteId);
        const normalizedContent = parseNoteContent(note.content);
        const normalizedTags = parseNoteTags(note.tags);

        setContent(normalizedContent);
        form.setFieldsValue({
          title: note.title,
          category: note.category,
          tags: normalizedTags,
          isPublic: note.isPublic ?? false,
        });
      } catch (error) {
        console.error('Failed to load note:', error);
        message.error('加载笔记详情失败');
        router.back();
      } finally {
        setInitialLoading(false);
      }
    };

    fetchNote();
  }, [form, noteId, router]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmit = async (values: EditNoteFormValues) => {
    if (!noteId) return;
    if (!user) {
      message.error('用户未登录');
      return;
    }

    try {
      setLoading(true);
      const { title, category, isPublic, tags: tagValues } = values;
      const payload: Partial<CreateNoteForm> = {
        title,
        category,
        isPublic,
        content: JSON.stringify(content),
      };

      if (tagValues) {
        payload.tags = JSON.stringify(tagValues);
      }

      const updatedNote = await noteAPI.updateNote(noteId, payload);
      const normalizedNote: Note = {
        ...updatedNote,
        content: parseNoteContent(updatedNote.content),
        tags: parseNoteTags(updatedNote.tags),
      };
      updateNoteInStore(noteId, normalizedNote);
      message.success('笔记更新成功！');
      router.push(`/note/${noteId}/detail`);
    } catch (error: any) {
      console.error('Failed to update note:', error);
      message.error(error.response?.data?.message || '更新笔记失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              编辑笔记
            </Title>
          </Space>
        </div>

        {initialLoading ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Spin size="large" />
          </div>
        ) : (
          <Form<EditNoteFormValues>
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              isPublic: false,
              tags: [],
            }}
          >
            <Form.Item
              name="title"
              label="标题"
              rules={[{ required: true, message: '请输入笔记标题！' }]}
            >
              <Input placeholder="请输入笔记标题" size="large" style={{ fontSize: '18px' }} />
            </Form.Item>

            <Form.Item
              name="category"
              label="分类"
              rules={[{ required: true, message: '请选择笔记分类！' }]}
            >
              <Select placeholder="选择分类" size="large" showSearch allowClear>
                {categories.map((category) => (
                  <Option key={category.id} value={category.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: category.color,
                        }}
                      />
                      {category.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="tags" label="标签">
              <Select mode="tags" placeholder="添加标签" size="large" allowClear>
                {tags.map((tag) => (
                  <Option key={tag.id} value={tag.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: tag.color,
                        }}
                      />
                      {tag.name}
                    </div>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="isPublic" label="公开设置" valuePropName="checked">
              <Switch checkedChildren="公开" unCheckedChildren="私密" />
            </Form.Item>

            <Form.Item label="内容">
              <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
                <NoteEditor
                  value={content}
                  onChange={(val) => setContent(val as CustomElement[])}
                  placeholder="开始编辑内容..."
                />
              </div>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<SaveOutlined />}
                  size="large"
                >
                  保存修改
                </Button>
                <Button onClick={handleBack} size="large">
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
}

