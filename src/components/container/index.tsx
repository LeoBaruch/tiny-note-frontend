'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { App as AntdApp, ConfigProvider } from 'antd';
import { useAuthStore, useUIStore } from '@/store';
import SideBar from "@/components/sideBar";
import './index.scss';
import styles from "./index.module.scss";

export default function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();
  const [isHydrated, setIsHydrated] = useState(false);

  const publicPages = ['/login', '/register'];

  // 等待 Zustand persist 水合完成
  useEffect(() => {
    // 立即检查一次
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    // 如果还没水合，使用轮询检查（最多等待 1 秒）
    let attempts = 0;
    const maxAttempts = 200; // 200 * 10ms = 2秒
    
    const checkHydration = () => {
      attempts++;
      if (useAuthStore.persist.hasHydrated()) {
        setIsHydrated(true);
      } else if (attempts < maxAttempts) {
        setTimeout(checkHydration, 10);
      } else {
        // 超时后也设置为已水合，避免无限等待
        setIsHydrated(true);
      }
    };

    checkHydration();
  }, []);

  // 水合完成后，检查认证状态
  useEffect(() => {
    if (!isHydrated) return;

    if (!token && !publicPages.includes(pathname)) {
      router.push('/login');
    }
  }, [isHydrated, token, pathname, router]);

  const isPublicPage = publicPages.includes(pathname);
  let content: React.ReactNode = null;

  if (isPublicPage) {
    content = children;
  } else if (isHydrated && token) {
    content = (
      <div id="root" className={styles.container}>
        <div className={`${styles.lefts} ${sidebarCollapsed ? styles.collapsed : ''}`}>
          <SideBar />
        </div>
        <div className={`${styles.main} ${sidebarCollapsed ? styles.expanded : ''}`}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <ConfigProvider>
      <AntdApp>{content}</AntdApp>
    </ConfigProvider>
  );
}
