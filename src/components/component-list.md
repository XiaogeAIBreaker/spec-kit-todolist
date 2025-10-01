# TodoList 组件清单

本文档记录了 TodoList 项目中所有的组件及其功能说明。

## 组件列表

### 1. TodoApp
**文件路径**: `/src/components/TodoApp/index.tsx`

**描述**: 主应用组件，整合所有子组件的主容器

**主要功能**:
- 整合所有子组件（AddTodoForm、TodoList、CompletionCelebration）
- 管理全局状态（通过 useTodos hook）
- 处理待办事项的添加、完成、删除操作
- 管理庆祝动画队列
- 错误边界处理
- 全局样式定义
- 加载状态管理

**关键特性**:
- 响应式布局设计
- 渐变背景和动画效果
- 错误处理和重试机制
- 键盘快捷键支持（Ctrl/Cmd+R 刷新）

---

### 2. AddTodoForm
**文件路径**: `/src/components/AddTodoForm/index.tsx`

**描述**: 添加新待办事项的表单组件

**主要功能**:
- 输入新的待办事项文本
- 实时输入验证
- 字符计数显示
- 错误提示
- 提交待办事项

**关键特性**:
- 输入字符限制（最大200字符）
- 实时验证和错误提示动画
- Enter 键提交，Esc 键清空
- 焦点管理和无障碍支持
- 加载状态显示
- 字符数接近限制时的警告提示

**Props**:
- `onSubmit`: 提交处理函数
- `isDisabled`: 是否禁用表单
- `placeholder`: 输入框占位文本

---

### 3. TodoList
**文件路径**: `/src/components/TodoList/index.tsx`

**描述**: 待办事项列表的容器组件

**主要功能**:
- 显示待办事项列表
- 过滤待办事项（全部/待完成/已完成）
- 统计信息显示（总计、已完成、待完成）
- 完成进度条
- 空状态展示
- 加载骨架屏

**关键特性**:
- 三种过滤模式（全部、待完成、已完成）
- 进度条动画
- 列表项的交错动画效果
- 键盘导航（上下箭头）
- 空状态处理
- 响应式设计

**Props**:
- `todos`: 待办事项数组
- `onAddTodo`: 添加处理函数
- `onCompleteTodo`: 完成处理函数
- `onDeleteTodo`: 删除处理函数
- `isLoading`: 加载状态

---

### 4. TodoItem
**文件路径**: `/src/components/TodoItem/index.tsx`

**描述**: 单个待办事项的展示和操作组件

**主要功能**:
- 显示待办事项内容
- 完成待办事项
- 删除待办事项
- 显示状态标签（已完成/待完成）
- 显示创建和完成时间

**关键特性**:
- 完成动画效果
- 删除动画效果
- 相对时间显示（刚刚、X分钟前、X小时前等）
- 键盘操作支持（Enter 完成，Delete/Backspace 删除）
- 已完成项目的样式差异化
- 无障碍标签

**Props**:
- `todo`: 待办事项对象
- `onComplete`: 完成处理函数
- `onDelete`: 删除处理函数
- `isAnimating`: 是否正在播放动画

---

### 5. EmptyState
**文件路径**: `/src/components/EmptyState/index.tsx`

**描述**: 空状态提示组件

**主要功能**:
- 显示空列表提示
- 引导用户添加第一个待办事项
- 根据不同场景显示不同的提示内容
- 提供操作提示和键盘快捷键说明

**关键特性**:
- 多种空状态场景（无待办、无待完成、无已完成）
- 动画图标（浮动、弹跳、脉冲）
- 操作提示列表
- 键盘快捷键提示
- 渐变动画和光晕效果

**Props**:
- `onAddFirst`: 添加第一个待办事项的处理函数
- `message`: 自定义提示消息

**场景支持**:
- 默认场景：开始添加待办事项
- 全部完成场景：庆祝动画和鼓励文案
- 无已完成场景：鼓励开始完成任务

---

### 6. CompletionCelebration
**文件路径**: `/src/components/CompletionCelebration/index.tsx`

**描述**: 完成待办事项的庆祝动画组件

**主要功能**:
- 显示庆祝动画和消息
- 展示完成的待办事项内容
- 自动倒计时关闭
- 彩纸动画效果

**关键特性**:
- 全屏遮罩层
- 弹跳和脉冲动画
- 彩纸飘落效果（50个随机彩纸）
- 进度条倒计时（默认20秒）
- 手动关闭按钮
- 键盘快捷键关闭（Esc/Enter）
- 防止点击穿透

**Props**:
- `$show`: 是否显示庆祝动画
- `todoText`: 完成的待办事项文本
- `onAnimationEnd`: 动画结束回调
- `duration`: 自动关闭时长（毫秒，默认20000）

---

## 组件关系图

```
TodoApp (主容器)
├── AddTodoForm (添加表单)
├── TodoList (列表容器)
│   ├── TodoItem (列表项) × N
│   └── EmptyState (空状态)
└── CompletionCelebration (庆祝动画)
```

## 数据流

1. **添加流程**: AddTodoForm → TodoApp → useTodos → 更新状态 → TodoList → 显示新项
2. **完成流程**: TodoItem → TodoList → TodoApp → useTodos → 触发庆祝 → CompletionCelebration
3. **删除流程**: TodoItem → TodoList → TodoApp → useTodos → 更新状态 → 重新渲染

## 技术栈

- **React 18+**: 组件库
- **TypeScript 5.0+**: 类型系统
- **Styled Components**: CSS-in-JS 样式方案
- **自定义 Hooks**: useTodos（状态管理）

## 样式系统

所有组件使用统一的主题系统 (`defaultTheme`)，包括：
- 颜色配置（主色、次色、成功、警告、错误等）
- 间距系统（xs, sm, md, lg, xl）
- 圆角半径（sm, md, lg）
- 阴影效果（sm, md, lg）

## 无障碍支持

所有组件都实现了 WCAG 2.1 标准的无障碍功能：
- 语义化 HTML 和 ARIA 标签
- 键盘导航支持
- 焦点管理
- 屏幕阅读器友好
- 动画偏好设置支持（prefers-reduced-motion）

## 响应式设计

- 移动端优先设计
- 断点：640px、768px、480px
- 自适应布局和字体大小
