/**
 * Next.js文档配置
 * 自定义HTML文档结构和SEO优化
 */

import React from 'react';
import { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import Document, { DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="zh-CN">
        <Head>
          {/* 性能和安全相关的meta标签 */}
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="msapplication-tap-highlight" content="no" />

          {/* DNS预解析 */}
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />

          {/* 预加载关键字体 */}
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
            as="style"
            onLoad={(e: any) => {
              if (e.target) {
                e.target.onload = null;
                e.target.rel = 'stylesheet';
              }
            }}
          />
          <noscript>
            <link
              href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
              rel="stylesheet"
            />
          </noscript>

          {/* PWA清单文件 */}
          <link rel="manifest" href="/manifest.json" />

          {/* 各种尺寸的图标 */}
          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
          <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#6366f1" />

          {/* Windows磁贴 */}
          <meta name="msapplication-TileColor" content="#6366f1" />
          <meta name="msapplication-config" content="/browserconfig.xml" />

          {/* 结构化数据 */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "待办清单",
                "description": "一个现代化的待办事项管理应用，帮助你高效管理日常任务",
                "url": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
                "applicationCategory": "ProductivityApplication",
                "operatingSystem": "Web",
                "browserRequirements": "Requires JavaScript. Requires HTML5.",
                "permissions": "localStorage",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "CNY"
                }
              })
            }}
          />

          {/* 内联关键CSS以提升首屏性能 */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
                /* 关键CSS - 防止FOUC */
                * {
                  box-sizing: border-box;
                }

                html {
                  -webkit-text-size-adjust: 100%;
                  -ms-text-size-adjust: 100%;
                  text-size-adjust: 100%;
                }

                body {
                  margin: 0;
                  padding: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
                    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
                    sans-serif;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  min-height: 100vh;
                  color: #1f2937;
                  line-height: 1.6;
                }

                /* 加载指示器 */
                .loading-indicator {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  color: white;
                  font-size: 1.125rem;
                  text-align: center;
                  z-index: 9999;
                }

                .loading-spinner {
                  width: 40px;
                  height: 40px;
                  border: 4px solid rgba(255, 255, 255, 0.3);
                  border-top: 4px solid white;
                  border-radius: 50%;
                  animation: spin 1s linear infinite;
                  margin: 0 auto 1rem;
                }

                @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }

                /* 无JavaScript降级样式 */
                .no-js {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  text-align: center;
                  color: white;
                  padding: 2rem;
                }

                .no-js-content {
                  background: rgba(255, 255, 255, 0.1);
                  padding: 2rem;
                  border-radius: 1rem;
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  max-width: 400px;
                }

                /* 减少动画偏好 */
                @media (prefers-reduced-motion: reduce) {
                  *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                  }
                }

                /* 深色主题偏好 */
                @media (prefers-color-scheme: dark) {
                  body {
                    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
                  }
                }
              `
            }}
          />
        </Head>
        <body>
          {/* 无JavaScript降级内容 */}
          <noscript>
            <div className="no-js">
              <div className="no-js-content">
                <h1>😅 需要JavaScript</h1>
                <p>此应用需要JavaScript才能正常运行。请启用JavaScript后重新加载页面。</p>
              </div>
            </div>
          </noscript>

          {/* 加载指示器 */}
          <div id="loading-indicator" className="loading-indicator">
            <div className="loading-spinner"></div>
            <div>正在加载待办清单...</div>
          </div>

          <Main />
          <NextScript />

          {/* 移除加载指示器的脚本 */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.addEventListener('DOMContentLoaded', function() {
                  var loader = document.getElementById('loading-indicator');
                  if (loader) {
                    loader.style.display = 'none';
                  }
                });
              `
            }}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;