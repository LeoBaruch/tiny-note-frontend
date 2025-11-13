'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import { authAPI } from '@/services/api';
import { LoginForm } from '@/types';

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, setUser } = useAuthStore();

  const onFinish = async (values: LoginForm) => {
    try {
      setLoading(true);
      const {  token, user_info } = await authAPI.login(values);
      debugger
      login( token);
      setUser(user_info);
      message.success('登录成功！');
      router.push('/');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查邮箱和密码';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 16,
          maxHeight: '90vh',
          overflow: 'auto'
        }}
        styles={{ body: { padding: 40 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            Tiny Note
          </Title>
          <Text type="secondary">欢迎回来，请登录您的账户</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱地址！' },
              { type: 'email', message: '请输入有效的邮箱地址！' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="邮箱地址" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="密码" 
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', height: 48, borderRadius: 8 }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <Divider>
          <Text type="secondary">还没有账户？</Text>
        </Divider>

        <div style={{ textAlign: 'center' }}>
          <Link href="/register">
            <Button type="link" size="large">
              立即注册
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
