'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useUIStore } from '@/store';
import SideBar from "@/components/sideBar";
import './index.scss';
import styles from "./index.module.scss";

export default function Container({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { sidebarCollapsed } = useUIStore();

  // 不需要认证的页面
  const publicPages = ['/login', '/register'];

  useEffect(() => {
    // 检查认证状态
    if (!isAuthenticated && !publicPages.includes(pathname)) {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  // 如果是公开页面，不显示侧边栏
  if (publicPages.includes(pathname)) {
    return <>{children}</>;
  }

  // 如果未认证，显示加载状态
  if (!isAuthenticated) {
    return null;
  }

  return (
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
