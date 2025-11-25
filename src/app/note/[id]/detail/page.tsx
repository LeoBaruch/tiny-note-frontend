'use client';

import React, { useEffect, useState } from 'react';
import {
  Card,
  Button,
  Space,
  Typography,
  Spin,
  Tag,
  message,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CalendarOutlined,
  TagOutlined,
  FolderOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { useParams, useRouter } from 'next/navigation';
import { useAuthStore, useNoteStore } from '@/store';
import { noteAPI } from '@/services/api';
import { Note } from '@/types';
import NoteEditor from '@/components/editor/NoteEditor';
import { parseNoteContent, parseNoteTags } from '@/utils/note';

const { Title, Text } = Typography;

export default function NoteDetailPage() {
  const params = useParams<{ id: string }>();
  const noteId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const router = useRouter();
  const { user } = useAuthStore();
  const { categories, tags: allTags } = useNoteStore();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any[]>([]);

  useEffect(() => {
    const fetchNote = async () => {
      if (!noteId) return;
      try {
        setLoading(true);
        const noteData = await noteAPI.getNote(noteId);
        const normalizedContent = parseNoteContent(noteData.content);
        const normalizedTags = parseNoteTags(noteData.tags);

        setNote({
          ...noteData,
          content: normalizedContent,
          tags: normalizedTags,
        });
        setContent(normalizedContent);
      } catch (error) {
        console.error('Failed to load note:', error);
        message.error('加载笔记详情失败');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [noteId, router]);

  const handleEdit = () => {
    if (noteId) {
      router.push(`/note/${noteId}/edit`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '未知时间';
    }
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || '#1890ff';
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">加载中...</Text>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!note) {
    return (
      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Card>
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Text type="secondary">笔记不存在</Text>
            <div style={{ marginTop: 16 }}>
              <Button onClick={handleBack}>返回</Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Card>
        {/* 头部操作栏 */}
        <div style={{ marginBottom: '24px' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            {user && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑
              </Button>
            )}
          </Space>
        </div>

        <Divider />

        {/* 笔记标题 */}
        <div style={{ marginBottom: '24px' }}>
          <Title level={2} style={{ margin: 0 }}>
            {note.title}
          </Title>
          <Space style={{ marginTop: '12px' }} size="middle">
            {note.isPublic ? (
              <Tag color="green" icon={<EyeOutlined />}>
                公开
              </Tag>
            ) : (
              <Tag color="default" icon={<LockOutlined />}>
                私密
              </Tag>
            )}
          </Space>
        </div>

        {/* 笔记元信息 */}
        <div
          style={{
            marginBottom: '24px',
            padding: '16px',
            backgroundColor: '#f5f5f5',
            borderRadius: '6px',
          }}
        >
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {note.category && (
              <Space>
                <FolderOutlined />
                <Text strong>分类：</Text>
                <Tag color={getCategoryColor(note.category)}>
                  {getCategoryName(note.category)}
                </Tag>
              </Space>
            )}

            {note.tags && note.tags.length > 0 && (
              <Space wrap>
                <TagOutlined />
                <Text strong>标签：</Text>
                {note.tags.map((tag) => {
                  const tagInfo = allTags.find((t) => t.id === tag || t.name === tag);
                  return (
                    <Tag
                      key={tag}
                      color={tagInfo?.color || 'blue'}
                    >
                      {tagInfo?.name || tag}
                    </Tag>
                  );
                })}
              </Space>
            )}

            <Space>
              <CalendarOutlined />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                创建时间：{formatDate(note.created_at || (note as any).createdAt)}
              </Text>
            </Space>

            <Space>
              <CalendarOutlined />
              <Text type="secondary" style={{ fontSize: '14px' }}>
                更新时间：{formatDate(note.updated_at || (note as any).updatedAt)}
              </Text>
            </Space>
          </Space>
        </div>

        <Divider />

        {/* 笔记内容 */}
        <div style={{ marginBottom: '24px' }}>
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '6px',
              padding: '16px',
              minHeight: '400px',
            }}
          >
            <NoteEditor
              value={content}
              onChange={() => {}}
              placeholder="暂无内容"
              readOnly={true}
            />
          </div>
        </div>

        {/* 底部操作栏 */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Space>
            <Button onClick={handleBack}>返回列表</Button>
            {user && (
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                编辑笔记
              </Button>
            )}
          </Space>
        </div>
      </Card>
    </div>
  );
}

