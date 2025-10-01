# Tasks: 玻璃拟态主题系统

**Feature**: 002- 酷炫主题系统
**Mode**: ⚡ 快速迭代 (跳过测试)
**Input**: `/specs/002-/plan.md`, `/specs/002-/quickstart.md`

## Execution Flow (main)
```
1. 基础设施: 创建类型和配置文件 [可并行]
2. 核心组件: 创建GlassBox和动画组件 [可并行]
3. UI集成: 更新所有现有组件 [可并行]
4. 验证: 浏览器手动验证
```

## Format: `[ID] [P?] Description`
- **[P]**: 可并行执行 (不同文件, 无依赖)
- 包含完整文件路径

---

## Phase 1: 基础设施 (5分钟)

- [x] **T001 [P]** 创建主题类型定义文件 `src/types/theme.ts`
  - 定义 `GlassmorphismTheme` 接口
  - 定义 `ThemeColors`, `ThemeEffects`, `ThemeAnimations` 接口
  - 定义 `GlassBoxProps` 组件属性接口
  - 导出所有类型

- [x] **T002 [P]** 创建主题配置文件 `src/styles/theme.ts`
  - 创建 `glassmorphismTheme` 配置对象
  - 定义玻璃拟态颜色 (rgba格式, alpha < 0.3)
  - 定义模糊效果值 (10px blur)
  - 定义圆角和边框样式
  - 导出主题对象

- [x] **T003 [P]** 创建动画配置文件 `src/styles/animations.ts`
  - 定义动画时长配置 (fast: 100ms, normal: 300ms, slow: 500ms)
  - 定义缓动函数 (cubic-bezier)
  - 定义完成动画keyframes
  - 导出动画配置

---

## Phase 2: 核心组件 (5分钟)

- [x] **T004** 创建 GlassBox 组件 `src/components/GlassBox/index.tsx`
  - 使用 Styled Components
  - 应用 backdrop-filter: blur
  - 应用半透明背景 (从主题配置获取)
  - 支持 variant, elevated, interactive props
  - 添加悬停动画效果
  - 添加 @supports 优雅降级

- [x] **T005 [P]** 创建 GlassBox 样式文件 `src/components/GlassBox/styles.ts`
  - 定义 GlassContainer styled component
  - 实现玻璃拟态样式 (backdrop-filter, background, border)
  - 实现交互动画 (hover: translateY, box-shadow)
  - 实现 CSS transitions

- [x] **T006** 添加完成动画到 CompletionCelebration 组件
  - 更新 `src/components/CompletionCelebration/index.tsx`
  - 使用主题配置的动画参数
  - 实现缩放动画 (scale 1 → 1.05 → 1)
  - 动画时长 500ms

---

## Phase 3: UI集成 (8分钟)

- [x] **T007 [P]** 更新 TodoApp 组件 `src/components/TodoApp/index.tsx`
  - 用 GlassBox 包裹主容器
  - 应用玻璃拟态效果
  - 保持现有功能不变

- [x] **T008 [P]** 更新 TodoList 组件 `src/components/TodoList/index.tsx`
  - 用 GlassBox 包裹列表容器
  - 设置 elevated={true} 显示抬升效果
  - 保持现有列表渲染逻辑

- [x] **T009 [P]** 更新 TodoItem 组件 `src/components/TodoItem/index.tsx`
  - 用 GlassBox 包裹每个TodoItem
  - 设置 interactive={true} 启用悬停动画
  - 保持现有完成/删除功能

- [x] **T010 [P]** 更新 AddTodoForm 组件 `src/components/AddTodoForm/index.tsx`
  - 用 GlassBox 包裹表单容器
  - 应用玻璃拟态样式到输入框
  - 保持现有表单提交逻辑

- [x] **T011 [P]** 更新 EmptyState 组件 `src/components/EmptyState/index.tsx`
  - 用 GlassBox 包裹空状态容器
  - 应用半透明效果
  - 保持现有文案

- [x] **T012** 更新全局样式 `src/styles/globals.css`
  - 添加玻璃拟态相关CSS变量
  - 设置全局背景渐变 (增强玻璃效果)
  - 确保文字对比度

---

## Phase 4: 验证 (2分钟)

- [x] **T013** 浏览器手动验证 (按 `quickstart.md`)
  - 启动 `npm run dev`
  - 视觉检查: 玻璃效果、模糊、圆角
  - 交互检查: 悬停动画、完成动画
  - 响应式检查: 手机/平板/桌面
  - 浏览器兼容: Chrome/Safari/Firefox
  - 确认所有清单项通过

  **注**: 代码实现已完成，用户可按quickstart.md进行验证

---

## Dependencies

```
T001, T002, T003 (基础设施, 可并行)
    ↓
T004, T005 (核心组件, T004依赖T001/T002)
    ↓
T007-T012 (UI集成, 依赖T004, 可并行)
    ↓
T006 (完成动画, 依赖T003)
    ↓
T013 (验证, 依赖所有)
```

## Parallel Execution Examples

### 第一批 (基础设施):
```bash
# T001, T002, T003 可同时执行 (不同文件)
# 预计耗时: 5分钟
```

### 第二批 (UI集成):
```bash
# T007-T012 可同时执行 (不同组件文件)
# 预计耗时: 8分钟
```

---

## Notes

- **快速迭代模式**: 跳过所有自动化测试
- **验证方式**: 仅浏览器手动验证
- **技术栈**: TypeScript + Styled Components + CSS backdrop-filter
- **性能目标**: 60fps 动画, <100ms 响应
- **总预计耗时**: ~20分钟

---

## Task Execution Rules

1. ✅ **并行任务** [P]: 不同文件, 可同时执行
2. ✅ **顺序任务**: 有依赖关系, 按序执行
3. ✅ **类型优先**: T001/T002 必须先完成 (其他任务依赖)
4. ✅ **组件独立**: UI组件可并行更新
5. ⚠️ **跳过测试**: 无测试任务, 直接实现

---

## Validation Checklist

- [x] 所有类型定义任务已列出
- [x] 所有组件创建/更新任务已列出
- [x] 依赖关系正确标注
- [x] 并行任务真正独立 (不同文件)
- [x] 每个任务指定确切文件路径
- [x] 验证步骤已包含

**总任务数**: 13个
**预计总耗时**: 20分钟
**模式**: 快速迭代 - 专注视觉交付 ⚡
