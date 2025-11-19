'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Form, Input, Button, Select, Switch, message, Space, Typography } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useAuthStore, useNoteStore } from '@/store';
import { noteAPI } from '@/services/api';
import { CreateNoteForm, Note } from '@/types';
import NoteEditor from '@/components/editor/NoteEditor';
import { CustomElement } from '@/components/editor/types';

type CreateNoteFormValues = Omit<CreateNoteForm, 'content'> ;

const { Title, Text } = Typography;
const { Option } = Select;

export default function NewNotePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { tags, categories, addNote } = useNoteStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<CustomElement[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const onFinish = async (values: CreateNoteFormValues) => {
    if (!user) {
      message.error('用户未登录');
      return;
    }

    try {
      setLoading(true);
      const noteData: CreateNoteForm = {
        ...values,

        content: JSON.stringify(content),
      };

      if(values.tags) {
        noteData.tags = JSON.stringify(values.tags);
      }

      const createdNote = await noteAPI.createNote(noteData);


      let parsedContent: any[] = [];
      if (createdNote.content) {
        try {
          parsedContent = JSON.parse(createdNote.content as unknown as string) as any[];
        } catch (error: any) {
          console.error('解析笔记内容失败:', error);
          parsedContent = [];
        }
      }

      let parsedTags: string[] = [];
      if(createdNote.tags) {
        try {
          parsedTags = JSON.parse(createdNote.tags as unknown as string) as string[];
        } catch (error: any) {
          console.error('解析笔记标签失败:', error);
          parsedTags = [];
        }
      }

      const newNote: Note = {
        ...createdNote,
        content: parsedContent,
        tags: parsedTags,
      };
      addNote(newNote);
      message.success('笔记创建成功！');
      router.push('/');
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建笔记失败');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={handleBack}
            >
              返回
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              新建笔记
            </Title>
          </Space>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isPublic: false,
            tags: [],
            category: '',
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入笔记标题！' }]}
          >
            <Input 
              placeholder="请输入笔记标题" 
              size="large"
              style={{ fontSize: '18px' }}
            />
          </Form.Item>

          <Form.Item
            name="category"
            label="分类"
            rules={[{ required: true, message: '请选择笔记分类！' }]}
          >
            <Select
              placeholder="选择分类"
              size="large"
              showSearch
              allowClear
            >
              {categories.map(category => (
                <Option key={category.id} value={category.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: category.color 
                      }} 
                    />
                    {category.name}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="tags"
            label="标签"
          >
            <Select
              mode="tags"
              placeholder="添加标签"
              size="large"
              allowClear
            >
              {tags.map(tag => (
                <Option key={tag.id} value={tag.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div 
                      style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: tag.color 
                      }} 
                    />
                    {tag.name}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="isPublic"
            label="公开设置"
            valuePropName="checked"
          >
            <Switch 
              checkedChildren="公开" 
              unCheckedChildren="私密"
            />
          </Form.Item>

          <Form.Item label="内容">
            <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
              <NoteEditor
                value={content}
                onChange={(val) => setContent(val as CustomElement[])}
                placeholder="开始编写您的笔记..."
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
                保存笔记
              </Button>
              <Button 
                onClick={handleBack}
                size="large"
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
