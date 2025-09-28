/**
 * 主页面 - TodoList应用
 */

import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import TodoApp from '@/components/TodoApp';

const HomePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>待办清单 - 让每一天都充满成就感</title>
        <meta name="description" content="一个现代化的待办事项管理应用，帮助你高效管理日常任务" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="待办清单 - 让每一天都充满成就感" />
        <meta property="og:description" content="一个现代化的待办事项管理应用，帮助你高效管理日常任务" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="待办清单 - 让每一天都充满成就感" />
        <meta property="twitter:description" content="一个现代化的待办事项管理应用，帮助你高效管理日常任务" />

        {/* PWA相关 */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="待办清单" />

        {/* 图标 */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* 预加载关键资源 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <TodoApp />
    </>
  );
};

export default HomePage;