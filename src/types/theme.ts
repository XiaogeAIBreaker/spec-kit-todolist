/**
 * 玻璃拟态主题系统类型定义
 */

export interface ThemeColors {
  glass: {
    background: string;      // rgba格式，半透明背景
    border: string;           // rgba格式，边框颜色
    text: string;             // 文字颜色
    textSecondary: string;    // 次要文字颜色
    shadow: string;           // 阴影颜色
  };
  accent: {
    primary: string;          // 主要强调色
    hover: string;            // 悬停状态
    active: string;           // 激活状态
  };
}

export interface ThemeEffects {
  blur: string;               // backdrop-filter模糊值
  borderRadius: string;       // 圆角半径
  borderWidth: string;        // 边框宽度
  opacity: {
    glass: number;            // 玻璃效果透明度
    hover: number;            // 悬停透明度
  };
}

export interface ThemeAnimations {
  duration: {
    fast: string;             // 快速动画
    normal: string;           // 正常动画
    slow: string;             // 慢速动画
  };
  easing: {
    default: string;          // 默认缓动函数
    spring: string;           // 弹性缓动
  };
}

export interface GlassmorphismTheme {
  colors: ThemeColors;
  effects: ThemeEffects;
  animations: ThemeAnimations;
}

export interface GlassBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'solid';
  elevated?: boolean;
  interactive?: boolean;
}
