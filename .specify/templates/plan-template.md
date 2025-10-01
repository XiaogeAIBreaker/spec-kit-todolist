
# 实施计划：[FEATURE]

**分支**：`[###-feature-name]` | **日期**：[DATE] | **规格**：[link]
**输入**：`/specs/[###-feature-name]/spec.md` 中的功能规格

## 执行流程（/plan 命令范围）
```
1. 从输入路径加载功能规格
   → 如果未找到：错误 "在 {path} 找不到功能规格"
2. 填写技术上下文（扫描 NEEDS CLARIFICATION）
   → 从文件系统结构或上下文检测项目类型（web=前端+后端，mobile=应用+API）
   → 根据项目类型设置结构决策
3. 根据宪章文档的内容填写宪章检查部分
4. 评估下面的宪章检查部分
   → 如果存在违规：记录在复杂度跟踪中
   → 如果无法提供理由：错误 "首先简化方法"
   → 更新进度跟踪：初始宪章检查
5. 执行阶段 0 → research.md
   → 如果仍有 NEEDS CLARIFICATION：错误 "解决未知问题"
6. 执行阶段 1 → contracts、data-model.md、quickstart.md、特定代理的模板文件（例如，Claude Code 的 `CLAUDE.md`、GitHub Copilot 的 `.github/copilot-instructions.md`、Gemini CLI 的 `GEMINI.md`、Qwen Code 的 `QWEN.md` 或 opencode 的 `AGENTS.md`）
7. 重新评估宪章检查部分
   → 如果有新违规：重构设计，返回阶段 1
   → 更新进度跟踪：设计后宪章检查
8. 计划阶段 2 → 描述任务生成方法（不要创建 tasks.md）
9. 停止 - 准备执行 /tasks 命令
```

**重要**：/plan 命令在步骤 7 停止。阶段 2-4 由其他命令执行：
- 阶段 2：/tasks 命令创建 tasks.md
- 阶段 3-4：实施执行（手动或通过工具）

## 摘要
[从功能规格中提取：主要需求 + 研究中的技术方法]

## 技术上下文
**语言/版本**：[例如，Python 3.11、Swift 5.9、Rust 1.75 或 NEEDS CLARIFICATION]
**主要依赖项**：[例如，FastAPI、UIKit、LLVM 或 NEEDS CLARIFICATION]
**存储**：[如果适用，例如，PostgreSQL、CoreData、文件 或 N/A]
**测试**：[例如，pytest、XCTest、cargo test 或 NEEDS CLARIFICATION]
**目标平台**：[例如，Linux 服务器、iOS 15+、WASM 或 NEEDS CLARIFICATION]
**项目类型**：[single/web/mobile - 决定源代码结构]
**性能目标**：[特定领域，例如，1000 req/s、10k lines/sec、60 fps 或 NEEDS CLARIFICATION]
**约束**：[特定领域，例如，<200ms p95、<100MB 内存、离线可用 或 NEEDS CLARIFICATION]
**规模/范围**：[特定领域，例如，10k 用户、1M LOC、50 屏幕 或 NEEDS CLARIFICATION]

## 宪章检查
*门控：必须在阶段 0 研究之前通过。在阶段 1 设计之后重新检查。*

- [ ] **组件化架构**：设计确保所有UI元素为可复用React组件，具有明确职责边界
- [ ] **用户体验优先**：所有功能以用户体验为首要考虑，界面直观响应迅速
- [ ] **静态优化**：充分利用Next.js的SSG/ISR能力，实现性能优化
- [ ] **数据一致性**：确保统一的数据源和状态管理，避免重复声明
- [ ] **类型安全**：使用TypeScript确保类型安全，避免any类型的使用

## 项目结构

### 文档（此功能）
```
specs/[###-feature]/
├── plan.md              # 本文件（/plan 命令输出）
├── research.md          # 阶段 0 输出（/plan 命令）
├── data-model.md        # 阶段 1 输出（/plan 命令）
├── quickstart.md        # 阶段 1 输出（/plan 命令）
├── contracts/           # 阶段 1 输出（/plan 命令）
└── tasks.md             # 阶段 2 输出（/tasks 命令 - 不由 /plan 创建）
```

### 源代码（仓库根目录）
<!--
  需要操作：用此功能的具体布局替换下面的占位符树。删除未使用的选项并
  用真实路径（例如，apps/admin、packages/something）扩展所选结构。
  交付的计划不得包含选项标签。
-->
```
# [如果未使用则删除] 选项 1：单项目（默认）
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [如果未使用则删除] 选项 2：Web 应用（当检测到"frontend" + "backend"时）
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [如果未使用则删除] 选项 3：移动应用 + API（当检测到"iOS/Android"时）
api/
└── [与上面的 backend 相同]

ios/ or android/
└── [平台特定结构：功能模块、UI 流程、平台测试]
```

**结构决策**：[记录所选结构并引用上面捕获的真实目录]

## 阶段 0：概述和研究
1. **从上面的技术上下文中提取未知项**：
   - 对于每个 NEEDS CLARIFICATION → 研究任务
   - 对于每个依赖项 → 最佳实践任务
   - 对于每个集成 → 模式任务

2. **生成并分派研究代理**：
   ```
   对于技术上下文中的每个未知项：
     任务："为 {功能上下文} 研究 {未知项}"
   对于每个技术选择：
     任务："在 {领域} 中查找 {技术} 的最佳实践"
   ```

3. **在 `research.md` 中整合发现**，使用格式：
   - 决策：[选择了什么]
   - 理由：[为什么选择]
   - 考虑的替代方案：[还评估了什么]

**输出**：research.md，所有 NEEDS CLARIFICATION 已解决

## 阶段 1：设计和合约
*前置条件：research.md 完成*

1. **从功能规格中提取实体** → `data-model.md`：
   - 实体名称、字段、关系
   - 需求中的验证规则
   - 状态转换（如果适用）

2. **从功能需求生成 API 合约**：
   - 对于每个用户操作 → 端点
   - 使用标准 REST/GraphQL 模式
   - 将 OpenAPI/GraphQL schema 输出到 `/contracts/`

3. **从合约生成合约测试**：
   - 每个端点一个测试文件
   - 断言请求/响应模式
   - 测试必须失败（尚无实现）

4. **从用户故事中提取测试场景**：
   - 每个故事 → 集成测试场景
   - 快速开始测试 = 故事验证步骤

5. **增量更新代理文件**（O(1) 操作）：
   - 运行 `.specify/scripts/bash/update-agent-context.sh claude`
     **重要**：完全按照上面指定的方式执行它。不要添加或删除任何参数。
   - 如果存在：仅添加当前计划中的新技术
   - 保留标记之间的手动添加
   - 更新最近的更改（保留最后 3 个）
   - 保持在 150 行以下以提高令牌效率
   - 输出到仓库根目录

**输出**：data-model.md、/contracts/*、失败的测试、quickstart.md、特定代理的文件

## 阶段 2：任务规划方法
*本节描述 /tasks 命令将执行的操作 - 在 /plan 期间不要执行*

**任务生成策略**：
- 加载 `.specify/templates/tasks-template.md` 作为基础
- 从阶段 1 设计文档（合约、数据模型、快速开始）生成任务
- 每个合约 → 合约测试任务 [P]
- 每个实体 → 模型创建任务 [P]
- 每个用户故事 → 集成测试任务
- 使测试通过的实现任务

**排序策略**：
- TDD 顺序：测试先于实现
- 依赖顺序：模型先于服务先于 UI
- 为并行执行标记 [P]（独立文件）

**预估输出**：tasks.md 中的 25-30 个编号、有序的任务

**重要**：此阶段由 /tasks 命令执行，而不是由 /plan 执行

## 阶段 3+：未来实施
*这些阶段超出了 /plan 命令的范围*

**阶段 3**：任务执行（/tasks 命令创建 tasks.md）
**阶段 4**：实施（遵循宪章原则执行 tasks.md）
**阶段 5**：验证（运行测试、执行 quickstart.md、性能验证）

## 复杂度跟踪
*仅在宪章检查有必须证明的违规时填写*

| 违规 | 为什么需要 | 被拒绝的更简单替代方案因为 |
|------|-----------|---------------------------|
| [例如，第4个项目] | [当前需求] | [为什么3个项目不够] |
| [例如，Repository 模式] | [具体问题] | [为什么直接数据库访问不够] |


## 进度跟踪
*此检查清单在执行流程期间更新*

**阶段状态**：
- [ ] 阶段 0：研究完成（/plan 命令）
- [ ] 阶段 1：设计完成（/plan 命令）
- [ ] 阶段 2：任务规划完成（/plan 命令 - 仅描述方法）
- [ ] 阶段 3：任务已生成（/tasks 命令）
- [ ] 阶段 4：实施完成
- [ ] 阶段 5：验证通过

**门控状态**：
- [ ] 初始宪章检查：通过
- [ ] 设计后宪章检查：通过
- [ ] 所有 NEEDS CLARIFICATION 已解决
- [ ] 复杂度偏差已记录

---
*基于宪章 v1.0.0 - 参见 `/memory/constitution.md`*
