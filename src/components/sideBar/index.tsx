'use client';

import React, { useState, useEffect } from 'react';
import {
  AppstoreOutlined,
  PlusOutlined,
  SearchOutlined,
  TagOutlined,
  FolderOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Button, Input, Avatar, Dropdown, Space, Typography } from "antd";
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useNoteStore, useUIStore } from '@/store';
import { tagAPI, categoryAPI } from '@/services/api';

const { Text } = Typography;

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const { tags, categories, setTags, setCategories } = useNoteStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // 加载标签和分类
    const loadData = async () => {
      try {
        const [tagsData, categoriesData] = await Promise.all([
          tagAPI.getTags(),
          categoryAPI.getCategories()
        ]);
        setTags(tagsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load tags and categories:', error);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, setTags, setCategories]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
      onClick: () => router.push('/profile'),
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
      onClick: () => router.push('/settings'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  const mainMenuItems = [
    {
      key: '/',
      icon: <AppstoreOutlined />,
      label: '所有笔记',
      onClick: () => router.push('/'),
    },
    {
      key: '/note/new',
      icon: <PlusOutlined />,
      label: '新建笔记',
      onClick: handleCreateNote,
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: (
        <Input
          placeholder="搜索笔记..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={(e) => handleSearch((e.target as HTMLInputElement).value)}
          style={{ marginTop: 8 }}
        />
      ),
    },
  ];

  const tagMenuItems = tags.map(tag => ({
    key: `tag-${tag.id}`,
    icon: <TagOutlined style={{ color: tag.color }} />,
    label: tag.name,
    onClick: () => router.push(`/?tag=${tag.id}`),
  }));

  const categoryMenuItems = categories.map(category => ({
    key: `category-${category.id}`,
    icon: <FolderOutlined style={{ color: category.color }} />,
    label: category.name,
    onClick: () => router.push(`/?category=${category.id}`),
  }));

  const allMenuItems = [
    ...mainMenuItems,
    {
      key: 'tags',
      icon: <TagOutlined />,
      label: '标签',
      children: tagMenuItems.length > 0 ? tagMenuItems : [{ key: 'no-tags', label: '暂无标签' }],
    },
    {
      key: 'categories',
      icon: <FolderOutlined />,
      label: '分类',
      children: categoryMenuItems.length > 0 ? categoryMenuItems : [{ key: 'no-categories', label: '暂无分类' }],
    },
  ];

  if (!user) {
    // return null;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 头部 */}
      <div style={{ 
        padding: '16px', 
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar 
            size="small" 
            icon={<UserOutlined />} 
            src={user?.avatar}
            style={{ backgroundColor: '#1890ff' }}
          />
          <div>
            <Text strong style={{ fontSize: 12 }}>{user?.username || '用户'}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 10 }}>{user?.email || '无邮箱'}</Text>
          </div>
        </div>
        <Button
          type="text"
          icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggleSidebar}
          size="small"
        />
      </div>

      {/* 菜单 */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Menu
          mode="inline"
          style={{ borderRight: 'none' }}
          items={allMenuItems}
          selectedKeys={[pathname]}
          inlineCollapsed={sidebarCollapsed}
        />
      </div>

      {/* 底部用户菜单 */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid #f0f0f0',
        textAlign: 'center'
      }}>
        <Dropdown
          menu={{ items: userMenuItems }}
          placement="topRight"
          trigger={['click']}
        >
          <Button type="text" style={{ width: '100%' }}>
            <Space>
              <Avatar 
                size="small" 
                icon={<UserOutlined />} 
                src={user?.avatar || undefined}
              />
              {!sidebarCollapsed && <Text>{user?.username || '用户'}</Text>}
            </Space>
          </Button>
        </Dropdown>
      </div>
    </div>
  );
}
