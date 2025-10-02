# Research: 待办事项拖拽排序

**Feature**: 003-
**Date**: 2025-10-01
**Status**: Complete

## Research Topics

### 1. React拖拽库选择

**决策**: 使用 @dnd-kit/core

**理由**:
- **性能优异**: 使用现代Web API,支持硬件加速,轻量级
- **无障碍支持**: 内置WCAG 2.1 AA级别的键盘导航和屏幕阅读器支持
- **灵活性高**: 提供低层级API,完全控制拖拽行为和样式
- **移动设备友好**: 原生支持触摸事件,手势识别优秀
- **活跃维护**: 社区活跃,文档完善,TypeScript支持完整
- **体积小**: ~25KB gzipped,比react-beautiful-dnd小50%

**备选方案**:
1. **react-beautiful-dnd**: 功能强大但体积较大(~50KB),移动端支持较弱,已停止主要更新
2. **react-dnd**: 功能全面但API复杂,学习曲线陡峭,对简单排序场景过度设计
3. **原生实现**: 完全控制但需要处理大量边界情况,无障碍支持需自行实现

### 2. 排序数据结构设计

**决策**: 使用整数sortOrder字段,完成和未完成独立序列

**理由**:
- **简单直观**: 整数序列易于理解和调试
- **高效排序**: 数组sort性能优异
- **灵活重排**: 拖拽后统一重新分配序号,避免小数或字符串复杂度
- **独立序列**: 已完成和未完成分别维护sortOrder,符合用户预期

**实现细节**:
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  sortOrder: number;  // 在同一完成状态内的排序位置
  createdAt: Date;
  completedAt?: Date;
}
```

**重排算法**:
- 拖拽后,重新分配该状态下所有Todo的sortOrder为0,1,2,3...
- 避免使用分数或字符串,保持简单性

**备选方案**:
1. **分数排序**: 使用小数在两项之间插入(如1, 1.5, 2),复杂且可能精度问题
2. **字符串排序**: 使用字典序(如"aa", "ab"),增加复杂度
3. **链表结构**: 使用prevId/nextId,查询效率低

### 3. 状态持久化策略

**决策**: LocalStorage存储Todo数组,包含sortOrder

**理由**:
- **符合现有架构**: 项目已使用LocalStorage存储Todo
- **简单可靠**: 无需额外后端支持,客户端即可完成
- **即时同步**: 每次拖拽完成后立即保存
- **数据一致性**: sortOrder作为Todo的固有属性,一同存储

**存储格式**:
```typescript
// LocalStorage key: "todos"
[
  {
    "id": "uuid-1",
    "text": "任务1",
    "completed": false,
    "sortOrder": 0,
    "createdAt": "2025-10-01T10:00:00Z"
  },
  {
    "id": "uuid-2",
    "text": "任务2",
    "completed": false,
    "sortOrder": 1,
    "createdAt": "2025-10-01T10:05:00Z"
  }
]
```

**备选方案**:
1. **IndexedDB**: 更强大但对简单场景过度设计
2. **SessionStorage**: 会话结束后丢失,不符合需求
3. **后端API**: 需要额外开发,超出当前范围

### 4. 拖拽UX最佳实践

**决策**: 采用以下UX模式

**视觉反馈**:
- **拖拽开始**: 抬起动画(transform: scale(1.05)),增加阴影
- **拖拽中**: 半透明(opacity: 0.8),跟随鼠标/触摸
- **目标位置**: 显示插入指示线或占位符
- **其他项**: 平滑过渡动画让出空间(transition: transform 200ms)

**交互细节**:
- **移动设备**: 长按500ms触发拖拽,区分滚动
- **桌面**: 鼠标按下即可拖拽
- **键盘**: Space激活,上下箭头移动,Enter确认
- **取消**: Esc键或拖出边界取消拖拽

**性能优化**:
- 使用CSS transform而非top/left(触发GPU加速)
- will-change: transform提前告知浏览器
- 使用RAF(requestAnimationFrame)更新位置
- 虚拟化长列表(如超过100项时使用react-window)

**备选方案**:
1. **极简样式**: 仅改变背景色,用户感知不明显
2. **复杂动画**: 3D翻转等特效,性能开销大且分散注意力

### 5. 边界情况处理

**决策**: 明确定义各种边界行为

**场景处理**:
1. **单项列表**: 禁用拖拽,显示提示"至少需要2项才能排序"
2. **拖出边界**: 取消拖拽,恢复原位置,显示toast提示
3. **过滤状态切换**: 拖拽时切换过滤器自动取消拖拽
4. **并发操作**: 拖拽时禁用其他操作(完成/删除按钮)
5. **网络丢失**: 纯客户端操作,不受影响
6. **空列表**: 不显示拖拽UI

### 6. 无障碍支持

**决策**: 完整实现WCAG 2.1 AA标准

**键盘操作**:
- Tab聚焦到待办项
- Space激活拖拽模式
- 上/下箭头移动位置
- Enter确认新位置
- Esc取消操作

**屏幕阅读器**:
- aria-grabbed="true"标记拖拽项
- aria-dropeffect="move"标记目标区域
- 实时播报当前位置:"已移动到第3位,共5项"
- 操作提示:"按Space开始拖拽,箭头键移动,Enter确认"

**视觉辅助**:
- 高对比度模式支持
- 焦点指示器清晰可见
- 不依赖颜色传达状态

## 技术栈总结

| 技术 | 用途 | 版本 |
|------|------|------|
| @dnd-kit/core | 拖拽核心库 | ^6.0.0 |
| @dnd-kit/sortable | 排序工具 | ^7.0.0 |
| @dnd-kit/utilities | 拖拽工具函数 | ^3.2.0 |
| TypeScript | 类型安全 | 5.0+ |
| React | UI框架 | 18+ |
| Styled Components | 样式方案 | 现有 |

## 参考资源

- [@dnd-kit官方文档](https://docs.dndkit.com/)
- [React拖拽排序最佳实践](https://web.dev/drag-and-drop/)
- [WCAG 2.1拖拽无障碍指南](https://www.w3.org/WAI/WCAG21/Understanding/dragging-movements)
- [移动端拖拽手势设计](https://material.io/design/interaction/gestures.html)

## 风险与缓解

| 风险 | 影响 | 缓解措施 |
|------|------|----------|
| @dnd-kit学习曲线 | 中 | 参考官方示例,先实现基础功能 |
| 移动端手势冲突 | 高 | 使用500ms长按延迟,测试覆盖 |
| 性能问题(大量项) | 低 | 当前场景项数少,暂不优化 |
| 浏览器兼容性 | 低 | @dnd-kit支持现代浏览器,polyfill老版本 |

## 下一步

Phase 1: 设计数据模型和快速开始文档
