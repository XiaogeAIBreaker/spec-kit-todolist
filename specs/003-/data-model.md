# Data Model: 待办事项拖拽排序

**Feature**: 003-
**Date**: 2025-10-01
**Status**: Complete

## 核心实体

### Todo (待办事项) - 修改

**描述**: 待办事项的核心数据模型,新增sortOrder字段支持拖拽排序

**字段**:

| 字段名 | 类型 | 必填 | 描述 | 变更 |
|--------|------|------|------|------|
| id | string | 是 | 唯一标识符(UUID) | 已存在 |
| text | string | 是 | 待办事项内容,最大200字符 | 已存在 |
| completed | boolean | 是 | 完成状态 | 已存在 |
| sortOrder | number | 是 | 排序位置,同一完成状态内的序号 | **新增** |
| createdAt | Date | 是 | 创建时间戳 | 已存在 |
| completedAt | Date | 否 | 完成时间戳,仅completed=true时有值 | 已存在 |

**TypeScript定义**:
```typescript
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  sortOrder: number;        // 新增字段
  createdAt: Date;
  completedAt?: Date;
}
```

**验证规则**:
- `id`: 非空字符串,UUID格式
- `text`: 非空字符串,长度1-200字符
- `completed`: 布尔值
- `sortOrder`: 非负整数,在同一completed状态下唯一且连续
- `createdAt`: 有效的ISO 8601日期时间
- `completedAt`: 有效的ISO 8601日期时间或null

**索引**:
- 主键: `id`
- 排序索引: `[completed, sortOrder]` (组合索引用于高效排序查询)

### DragState (拖拽状态) - 新增

**描述**: 拖拽操作过程中的临时状态

**字段**:

| 字段名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| activeId | string \| null | 是 | 当前被拖拽的Todo ID,null表示无拖拽 |
| overId | string \| null | 是 | 鼠标悬停位置的Todo ID |
| isDragging | boolean | 是 | 是否正在拖拽 |

**TypeScript定义**:
```typescript
interface DragState {
  activeId: string | null;
  overId: string | null;
  isDragging: boolean;
}
```

**生命周期**:
1. 初始状态: `{ activeId: null, overId: null, isDragging: false }`
2. 拖拽开始: 设置`activeId`和`isDragging: true`
3. 拖拽移动: 更新`overId`
4. 拖拽结束: 提交排序变更,重置为初始状态

## 数据关系

```
Todo (1:N) ← sortOrder分组 → 完成状态分组
  │
  ├─ 未完成Todo: sortOrder 0, 1, 2, ...
  └─ 已完成Todo: sortOrder 0, 1, 2, ...
```

**关键约束**:
- 同一`completed`状态下的所有Todo的`sortOrder`必须连续且唯一(0, 1, 2, ...)
- 不同`completed`状态下的`sortOrder`互相独立

## 状态转换

### Todo.sortOrder变更流程

```
1. 用户拖拽Todo[i] 到位置[j]
   ↓
2. 过滤出同一completed状态的todos列表
   ↓
3. 从列表中移除Todo[i]
   ↓
4. 将Todo[i]插入到位置[j]
   ↓
5. 重新分配整个列表的sortOrder = 0, 1, 2, ...
   ↓
6. 保存到LocalStorage
   ↓
7. 触发UI重新渲染
```

### 完成状态变更时的sortOrder处理

```
1. 用户点击Todo完成按钮
   ↓
2. 切换completed状态
   ↓
3. 获取目标completed状态下现有Todo的最大sortOrder
   ↓
4. 设置新sortOrder = maxSortOrder + 1
   ↓
5. 保存并重新渲染
```

## 持久化

**存储方式**: LocalStorage

**存储键**: `"todos"`

**数据格式**: JSON数组

**示例数据**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "text": "完成项目提案",
    "completed": false,
    "sortOrder": 0,
    "createdAt": "2025-10-01T10:00:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "text": "购买办公用品",
    "completed": false,
    "sortOrder": 1,
    "createdAt": "2025-10-01T10:15:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "text": "发送会议纪要",
    "completed": true,
    "sortOrder": 0,
    "createdAt": "2025-09-30T14:00:00.000Z",
    "completedAt": "2025-09-30T16:30:00.000Z"
  }
]
```

**保存时机**:
- 拖拽结束后立即保存
- 新增/删除/完成Todo后保存
- 使用防抖(debounce)避免频繁写入

**数据迁移**:
对于现有未包含sortOrder的Todo数据:
1. 读取LocalStorage中的todos数组
2. 按completed分组
3. 每组内按createdAt排序
4. 分配连续的sortOrder: 0, 1, 2, ...
5. 回写到LocalStorage

## 数据完整性

**不变式**:
1. 所有Todo必须有非空id, text, completed, sortOrder, createdAt
2. 同一completed状态下的sortOrder必须唯一且连续(0到N-1)
3. completedAt仅在completed=true时存在
4. sortOrder必须为非负整数

**错误处理**:
- sortOrder冲突: 触发重新分配sortOrder
- 数据格式错误: 回退到默认空数组[]
- LocalStorage满: 提示用户清理数据

## 性能考虑

**查询优化**:
- 按completed + sortOrder排序: O(n log n),可接受
- 过滤已完成/未完成: O(n),轻量级

**内存占用**:
- 每个Todo约200字节
- 100个Todo约20KB,LocalStorage足够(5-10MB限制)

**更新效率**:
- 拖拽重排: 仅更新同一completed状态的todos
- LocalStorage写入: 序列化整个数组,约10ms (100项时)

## 类型定义总结

```typescript
// src/types/todo.ts

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  sortOrder: number;        // 新增
  createdAt: Date;
  completedAt?: Date;
}

export interface DragState {
  activeId: string | null;
  overId: string | null;
  isDragging: boolean;
}

export type FilterMode = 'all' | 'active' | 'completed';

// 拖拽事件回调
export type DragEndEvent = {
  active: { id: string };
  over: { id: string } | null;
};

// 排序操作结果
export interface ReorderResult {
  success: boolean;
  todos: Todo[];
  error?: string;
}
```
