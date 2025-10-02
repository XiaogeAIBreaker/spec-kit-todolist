
# Implementation Plan: 待办事项拖拽排序

**Branch**: `003-` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → If not found: ERROR "No feature spec at {path}"
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from file system structure or context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file (e.g., `CLAUDE.md` for Claude Code, `.github/copilot-instructions.md` for GitHub Copilot, `GEMINI.md` for Gemini CLI, `QWEN.md` for Qwen Code or `AGENTS.md` for opencode).
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
实现待办事项的拖拽排序功能,允许用户通过拖拽方式重新排列待办事项顺序。所有待办事项(包括已完成和未完成)都支持拖拽,但仅限于当前过滤视图内排序,不改变完成状态。提供流畅的视觉反馈和动画效果,支持键盘操作和无障碍访问,排序结果持久化保存。

**用户需求**: 用户希望快速调整待办事项的优先级和顺序,无需删除重建
**技术方案**: 使用拖拽库(react-beautiful-dnd或@dnd-kit)实现拖拽交互,在Todo数据模型中增加sortOrder字段,LocalStorage持久化排序状态
**关键约束**: TDD部分直接略过,专注于功能实现

## Technical Context
**Language/Version**: TypeScript 5.0+, JavaScript ES2022
**Primary Dependencies**: React 18+, Next.js 14+, @dnd-kit/core (拖拽库), Styled Components
**Storage**: LocalStorage (客户端持久化排序顺序)
**Testing**: Jest, React Testing Library (注: 根据用户要求,TDD部分直接略过)
**Target Platform**: Web浏览器 (Chrome, Firefox, Safari, Edge), 支持桌面和移动设备
**Project Type**: web (单页应用)
**Performance Goals**: 拖拽响应<100ms, 动画60fps, 流畅体验无特定数量限制
**Constraints**: 仅在同一过滤视图内拖拽, 不跨状态拖拽, 已完成和未完成项目独立排序
**Scale/Scope**: 待办事项应用功能增强, 新增1个拖拽Hook, 修改TodoList和TodoItem组件

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **组件化架构**: 设计复用现有TodoList和TodoItem组件,新增useDragSort Hook封装拖拽逻辑,职责清晰
- [x] **用户体验优先**: 拖拽提供<100ms响应,60fps动画,明确视觉反馈,支持键盘操作和无障碍
- [x] **静态优化**: 客户端功能无需SSG/ISR,使用CSS硬件加速优化动画性能
- [x] **数据一致性**: sortOrder统一存储在Todo模型中,通过useTodos Hook统一管理,LocalStorage持久化
- [x] **类型安全**: 所有拖拽相关接口和状态使用TypeScript严格类型定义

## Project Structure

### Documentation (this feature)
```
specs/[###-feature]/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── components/
│   ├── TodoList/          # 修改: 集成拖拽容器
│   │   └── index.tsx
│   ├── TodoItem/          # 修改: 支持拖拽项
│   │   └── index.tsx
│   └── TodoApp/           # 修改: 集成拖拽状态管理
│       └── index.tsx
├── hooks/
│   ├── useTodos.ts        # 修改: 新增sortOrder支持
│   └── useDragSort.ts     # 新增: 拖拽排序Hook
├── types/
│   └── todo.ts            # 修改: Todo类型新增sortOrder字段
└── utils/
    └── storage.ts         # 修改: LocalStorage存储sortOrder

tests/                     # 注: 根据用户要求,TDD部分略过
└── (跳过测试文件创建)
```

**Structure Decision**: Web单页应用结构,主要修改现有组件以支持拖拽功能,新增useDragSort Hook封装拖拽逻辑。不涉及后端API,所有状态在客户端管理并持久化到LocalStorage。

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - For each NEEDS CLARIFICATION → research task
   - For each dependency → best practices task
   - For each integration → patterns task

2. **Generate and dispatch research agents**:
   ```
   For each unknown in Technical Context:
     Task: "Research {unknown} for {feature context}"
   For each technology choice:
     Task: "Find best practices for {tech} in {domain}"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all NEEDS CLARIFICATION resolved

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Entity name, fields, relationships
   - Validation rules from requirements
   - State transitions if applicable

2. **Generate API contracts** from functional requirements:
   - For each user action → endpoint
   - Use standard REST/GraphQL patterns
   - Output OpenAPI/GraphQL schema to `/contracts/`

3. **Generate contract tests** from contracts:
   - One test file per endpoint
   - Assert request/response schemas
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each story → integration test scenario
   - Quickstart test = story validation steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude`
     **IMPORTANT**: Execute it exactly as specified above. Do not add or remove any arguments.
   - If exists: Add only NEW tech from current plan
   - Preserve manual additions between markers
   - Update recent changes (keep last 3)
   - Keep under 150 lines for token efficiency
   - Output to repository root

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, agent-specific file

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**用户要求**: TDD部分直接略过,专注于功能实现

**Task Generation Strategy**:
- 直接从功能需求和数据模型生成实现任务
- **跳过**: Contract测试、单元测试文件创建
- **包含**: 功能实现、集成、文档更新

**任务分类**:
1. **依赖安装**: 安装@dnd-kit相关包
2. **类型定义**: 更新Todo接口,新增DragState类型
3. **数据层**: 修改useTodos Hook支持sortOrder
4. **拖拽Hook**: 创建useDragSort自定义Hook
5. **组件修改**:
   - TodoList: 集成DndContext
   - TodoItem: 支持拖拽
   - TodoApp: 集成拖拽状态
6. **存储更新**: LocalStorage持久化sortOrder
7. **样式优化**: 拖拽视觉反馈和动画
8. **无障碍**: 键盘操作和ARIA属性
9. **文档**: 更新README和组件文档

**Ordering Strategy**:
- 依赖安装 → 类型定义 → 数据层 → Hook → 组件 → 样式 → 无障碍 → 文档
- 可并行: 样式和无障碍可同时进行

**Estimated Output**: 约15-20个实现任务 (无测试任务)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |


## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) - research.md生成
- [x] Phase 1: Design complete (/plan command) - data-model.md, quickstart.md生成 (跳过contracts和测试)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved (通过/clarify命令)
- [x] Complexity deviations documented (无偏离,符合宪章要求)

---
*Based on Constitution v1.0.0 - See `/memory/constitution.md`*
