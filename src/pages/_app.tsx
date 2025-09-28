/**
 * Next.js应用配置
 * 全局样式和提供器设置
 */

import React from 'react';
import type { AppProps } from 'next/app';
import { ErrorBoundary } from 'react-error-boundary';
import Head from 'next/head';

// 错误回退组件
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '2rem',
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '2rem',
        borderRadius: '1rem',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        maxWidth: '400px'
      }}>
        <h2 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>
          😵 应用出错了
        </h2>
        <p style={{ margin: '0 0 1.5rem 0', opacity: 0.9 }}>
          {error.message || '发生了意外错误'}
        </p>
        <button
          onClick={resetErrorBoundary}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.2s ease-in-out'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = '#ef4444';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          重新加载
        </button>
      </div>
    </div>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={(error, errorInfo) => {
          // 这里可以添加错误上报逻辑
          console.error('应用错误:', error, errorInfo);
        }}
        onReset={() => {
          // 重置应用状态
          window.location.reload();
        }}
      >
        <Component {...pageProps} />
      </ErrorBoundary>
    </>
  );
}

export default MyApp;