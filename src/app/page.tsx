'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { 
  App,
  Card, 
  List, 
  Button, 
  Input, 
  Tag, 
  Space, 
  Typography, 
  Empty, 
  Spin,
  Popconfirm,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  EyeOutlined,
  CalendarOutlined,
  TagOutlined
} from '@ant-design/icons';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, useNoteStore } from '@/store';
import { noteAPI } from '@/services/api';
import { Note } from '@/types';
import styles from './page.module.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token } = useAuthStore();
  const { notes, setNotes, deleteNote } = useNoteStore();
  const { message } = App.useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [pageLoading, setPageLoading] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      setPageLoading(true);
      const notesData = await noteAPI.getNotes();
      
      // 处理 tags：如果是字符串，解析为数组
      const processedNotes = Array.isArray(notesData) ? notesData.map((note: Note) => {
        let tags: string[] = [];
        if (note.tags) {
          if (typeof note.tags === 'string') {
            try {
              tags = JSON.parse(note.tags);
            } catch {
              tags = [];
            }
          } else if (Array.isArray(note.tags)) {
            tags = note.tags;
          }
        }
        return {
          ...note,
          tags,
        };
      }) : [];
      
      setNotes(processedNotes);
      setFilteredNotes(processedNotes);
    } catch (error: unknown) {
      message.error('加载笔记失败');
      console.error('Failed to load notes:', error);
    } finally {
      setPageLoading(false);
    }
  }, [setNotes]);


  useEffect(() => {
    if (!token) return;

    loadNotes();
  }, [token, loadNotes]);


  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      router.push(`/?search=${encodeURIComponent(value)}`);
    } else {
      router.push('/');
    }
  };

  const handleCreateNote = () => {
    router.push('/note/new');
  };

  const handleEditNote = (note: Note) => {
    router.push(`/note/${note.id}/edit`);
  };

  const handleViewNote = (note: Note) => {
    router.push(`/note/${note.id}/detail`);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await noteAPI.deleteNote(noteId);
      deleteNote(noteId);
      message.success('笔记删除成功');
      loadNotes();
    } catch {
      message.error('删除笔记失败');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) {
      return '未知时间';
    }
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderNoteContent = (content: unknown[]) => {
    if (!content || content.length === 0) return '暂无内容';
    
    // 提取纯文本内容
    const extractText = (nodes: unknown[]): string => {
      return Array.isArray(nodes) ? nodes.map((node: unknown) => {
        if (typeof node === 'object' && node !== null && 'text' in node) {
          return (node as { text: string }).text;
        }
        if (typeof node === 'object' && node !== null && 'children' in node) {
          return extractText((node as { children: unknown[] }).children);
        }
        return '';
      }).join(' ').trim() : '';
    };

    const text = extractText(content);
    return text.length > 100 ? `${text.substring(0, 100)}...` : text;
  };

  if (!token) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            我的笔记
          </Title>
          <Text type="secondary">
            共 {filteredNotes?.length ?? 0} 篇笔记
          </Text>
        </div>
        <Space>
          <Search
            placeholder="搜索笔记..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateNote}
            size="large"
          >
            新建笔记
          </Button>
        </Space>
      </div>

      {pageLoading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
        </div>
      ) : (filteredNotes?.length) === 0 ? (
        <Empty
          description="暂无笔记"
          style={{ marginTop: '100px' }}
        >
          <Button type="primary" onClick={handleCreateNote}>
            创建第一篇笔记
          </Button>
        </Empty>
      ) : (
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 2, xl: 3, xxl: 4 }}
          dataSource={filteredNotes ?? []}
          renderItem={(note) => (
            <List.Item>
              <Card
                hoverable
                className={styles.noteCard}
                actions={[
                  <Tooltip key="view" title="查看">
                    <Button 
                      type="text" 
                      icon={<EyeOutlined />} 
                      onClick={() => handleViewNote(note)}
                    />
                  </Tooltip>,
                  <Tooltip key="edit" title="编辑">
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => handleEditNote(note)}
                    />
                  </Tooltip>,
                  <Tooltip key="delete" title="删除">
                    <Popconfirm
                      title="确定要删除这篇笔记吗？"
                      onConfirm={() => handleDeleteNote(note.id)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button 
                        type="text" 
                        danger 
                        icon={<DeleteOutlined />} 
                      />
                    </Popconfirm>
                  </Tooltip>,
                ]}
              >
                <Card.Meta
                  title={
                    <div className={styles.noteTitle}>
                      <Text strong ellipsis={{ tooltip: note.title }}>
                        {note.title}
                      </Text>
                      {note.isPublic && (
                        <Tag color="green">公开</Tag>
                      )}
                    </div>
                  }
                  description={
                    <div className={styles.noteContent}>
                      <Paragraph ellipsis={{ rows: 3 }}>
                        {renderNoteContent(note.content)}
                      </Paragraph>
                      
                      <div className={styles.noteMeta}>
                        <Space size="small">
                          <CalendarOutlined />
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {formatDate(note.updated_at || (note as any).updatedAt)}
                          </Text>
                        </Space>
                        
                      {(note.tags?.length ?? 0) > 0 && (
                          <Space size="small">
                            <TagOutlined />
                            <Space size={4}>
                            {(note.tags ?? []).slice(0, 3).map(tag => (
                                <Tag key={tag} color="blue">
                                  {tag}
                                </Tag>
                              ))}
                            {(note.tags?.length ?? 0) > 3 && (
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                +{(note.tags?.length ?? 0) - 3}
                                </Text>
                              )}
                            </Space>
                          </Space>
                        )}
                      </div>
                    </div>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      )}
    </div>
  );
}
