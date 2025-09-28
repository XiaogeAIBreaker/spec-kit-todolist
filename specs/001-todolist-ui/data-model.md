# 数据模型: 活力TodoList

## 核心实体

### TodoItem (待办事项)
```typescript
interface TodoItem {
  id: string;          // 唯一标识符 (UUID v4)
  text: string;        // 事项内容 (无长度限制)
  completed: boolean;  // 完成状态 (不可撤销)
  createdAt: Date;     // 创建时间 (用于排序)
  completedAt?: Date;  // 完成时间 (仅在completed=true时存在)
}
```

**字段约束**:
- `id`: 必需，使用crypto.randomUUID()生成
- `text`: 必需，非空字符串，去除首尾空白后不能为空
- `completed`: 必需，默认false，一旦设为true不可逆转
- `createdAt`: 必需，ISO 8601格式
- `completedAt`: 可选，仅在completed=true时设置

### TodoList (待办清单)
```typescript
interface TodoList {
  items: TodoItem[];
  lastModified: Date;
}
```

**业务规则**:
- 列表按createdAt倒序排列 (新添加的在前)
- 已完成和未完成项目混合显示，但视觉上区分
- 删除操作立即生效，无撤销机制

## 状态管理

### TodoState (应用状态)
```typescript
interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  celebrationQueue: string[]; // 待显示庆祝动画的todo id队列
}
```

### TodoAction (操作类型)
```typescript
type TodoAction =
  | { type: 'LOAD_TODOS'; payload: TodoItem[] }
  | { type: 'ADD_TODO'; payload: { text: string } }
  | { type: 'DELETE_TODO'; payload: { id: string } }
  | { type: 'COMPLETE_TODO'; payload: { id: string } }
  | { type: 'SHOW_CELEBRATION'; payload: { id: string } }
  | { type: 'HIDE_CELEBRATION'; payload: { id: string } };
```

## 存储格式

### LocalStorage Schema
```typescript
interface StorageData {
  version: string;     // 数据格式版本 (当前: "1.0")
  todos: TodoItem[];   // 所有待办事项
  metadata: {
    lastModified: string;  // ISO 8601格式
    totalCreated: number;  // 累计创建数量
    totalCompleted: number; // 累计完成数量
  };
}
```

**存储键**: `todolist-data`

## 数据验证

### 输入验证规则
1. **添加待办事项**:
   - 文本内容trim后不能为空
   - 长度无限制但建议实际使用中<1000字符

2. **完成待办事项**:
   - ID必须存在于当前列表中
   - 该项目必须未完成状态

3. **删除待办事项**:
   - ID必须存在于当前列表中
   - 无其他限制

### 数据完整性
- 所有日期字段必须为有效的ISO 8601格式
- ID唯一性由UUID生成器保证
- completed状态一旦为true永不变更

## 迁移策略
- 版本1.0为初始版本
- 未来版本升级时需要数据迁移函数
- 向后兼容性通过版本检查实现