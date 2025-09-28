<!--
Sync Impact Report:
- Version change: [new file] → 1.0.0
- Added sections: 5个核心原则 (组件化架构, 用户体验优先, 静态优化, 数据一致性, 类型安全)
- Modified principles: N/A (initial creation)
- Templates requiring updates:
  * ✅ .specify/templates/plan-template.md (Constitution Check section updated, version reference updated)
  * ✅ Command files validated (no updates needed)
  * ✅ Other template files validated (no updates needed)
- Follow-up TODOs: None
-->

# TodoList Kit 宪章

## 核心原则

### I. 组件化架构
所有UI元素必须构建为可复用的React组件；组件必须具有明确的职责边界，支持props传递和状态管理；禁止创建单一用途的组织性组件。

**理由**: 组件化架构确保代码的可维护性和可扩展性，降低重复开发成本，提高开发效率。

### II. 用户体验优先 (不可协商)
所有功能的实现必须以用户体验为第一优先级；界面必须直观易用，响应迅速；所有交互必须提供明确的反馈机制；必须支持键盘导航和无障碍访问。

**理由**: 优秀的用户体验是产品成功的关键，确保用户能够高效地管理待办事项。

### III. 静态优化
充分利用Next.js的静态站点生成(SSG)和增量静态再生(ISR)能力；所有页面必须针对性能进行优化；必须实现代码分割和懒加载；图片和资源必须进行优化处理。

**理由**: 静态优化确保最快的加载速度和最佳的SEO表现，提供卓越的用户体验。

### IV. 数据一致性
确保应用中的数据源统一，避免在不同位置重复声明相同变量或状态；使用统一的状态管理模式；所有数据变更必须通过统一的接口进行。

**理由**: 数据一致性避免状态冲突，减少bug的产生，提高代码的可维护性。

### V. 类型安全
使用TypeScript确保所有代码的类型安全；所有组件的props必须明确定义类型；API接口必须具有类型定义；禁止使用any类型，除非有明确的技术理由。

**理由**: 类型安全可以在开发阶段发现潜在错误，提高代码质量和开发效率。

## 技术约束

**框架要求**: 必须使用Next.js作为主要框架，充分利用其SSG/SSR能力
**样式规范**: 使用CSS Modules或Styled Components确保样式的模块化
**状态管理**: 对于复杂状态使用Context API或Zustand，避免过度工程化
**测试要求**: 所有组件必须有单元测试，关键用户流程必须有集成测试

## 开发流程

**代码评审**: 所有代码变更必须经过同行评审
**渐进式开发**: 功能必须按照MVP原则逐步实现
**性能监控**: 必须监控Core Web Vitals指标
**可访问性**: 所有功能必须满足WCAG 2.1 AA标准

## 治理

本宪章优先于所有其他开发实践；宪章修订需要文档化说明、技术评估和迁移计划；所有代码评审必须验证是否符合宪章要求；复杂性增加必须有充分的技术理由。

**版本**: 1.0.0 | **批准日期**: 2025-09-28 | **最后修订**: 2025-09-28