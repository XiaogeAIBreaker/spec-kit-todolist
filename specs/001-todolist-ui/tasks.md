# Tasks: 活力TodoList待办事项管理

**Input**: Design documents from `/Users/bytedance/Desktop/spec-kit-todolist/specs/001-todolist-ui/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ Found: tech stack (Next.js 14+, React 18+, TypeScript 5.0+)
   → ✅ Extract: LocalStorage, CSS-in-JS, Jest/RTL/Playwright
2. Load optional design documents:
   → ✅ data-model.md: TodoItem, TodoList entities → model tasks
   → ✅ contracts/: storage-interface.ts, component-interfaces.ts → contract test tasks
   → ✅ research.md: LocalStorage, CSS animations, Context API decisions
3. Generate tasks by category:
   → ✅ Setup: Next.js project, dependencies, TypeScript config
   → ✅ Tests: contract tests, integration tests from quickstart.md
   → ✅ Core: types, components, hooks, storage utilities
   → ✅ Integration: localStorage integration, animations
   → ✅ Polish: unit tests, performance optimizations, accessibility
4. Apply task rules:
   → ✅ Different files = marked [P] for parallel execution
   → ✅ Same file = sequential (no [P] marking)
   → ✅ Tests before implementation (TDD enforced)
5. ✅ Number tasks sequentially (T001-T028)
6. ✅ Generate dependency graph and parallel execution examples
7. ✅ Validate task completeness: all contracts tested, entities modeled
8. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Web application**: `src/` for source code, `tests/` for test files
- Next.js specific paths: `src/pages/`, `src/components/`, `src/hooks/`

## Phase 3.1: Setup
- [ ] T001 Create Next.js project structure with TypeScript configuration
- [ ] T002 Install dependencies: Next.js 14+, React 18+, styled-components, Jest, RTL, Playwright
- [ ] T003 [P] Configure ESLint with TypeScript strict rules and accessibility plugins
- [ ] T004 [P] Configure Jest testing environment with React Testing Library setup
- [ ] T005 [P] Configure Playwright for end-to-end testing with browser targets

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests
- [ ] T006 [P] Contract test for StorageInterface in tests/contracts/storage-interface.test.ts
- [ ] T007 [P] Contract test for component props in tests/contracts/component-interfaces.test.ts

### Integration Tests
- [ ] T008 [P] Integration test for first-time user experience in tests/integration/first-use.test.ts
- [ ] T009 [P] Integration test for basic CRUD operations in tests/integration/crud-operations.test.ts
- [ ] T010 [P] Integration test for data persistence in tests/integration/persistence.test.ts
- [ ] T011 [P] Integration test for edge cases handling in tests/integration/edge-cases.test.ts
- [ ] T012 [P] Integration test for accessibility features in tests/integration/accessibility.test.ts

### End-to-End Tests
- [ ] T013 [P] E2E test for complete user journey in tests/e2e/user-journey.spec.ts
- [ ] T014 [P] E2E test for performance benchmarks in tests/e2e/performance.spec.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Type Definitions
- [ ] T015 [P] TodoItem interface and validation types in src/types/todo.ts
- [ ] T016 [P] Storage types and error classes in src/types/storage.ts
- [ ] T017 [P] Component prop types and theme config in src/types/components.ts

### Storage Layer
- [ ] T018 LocalStorage implementation with TodoItem persistence in src/utils/storage.ts
- [ ] T019 Storage error handling and data migration logic in src/utils/storage.ts

### Custom Hooks
- [ ] T020 [P] useTodos hook with Context API and useReducer in src/hooks/useTodos.ts
- [ ] T021 [P] useLocalStorage hook for persistence abstraction in src/hooks/useLocalStorage.ts

### Core Components
- [ ] T022 [P] TodoItem component with completion and delete actions in src/components/TodoItem/index.tsx
- [ ] T023 [P] AddTodoForm component with validation and submission in src/components/AddTodoForm/index.tsx
- [ ] T024 [P] TodoList component with item rendering and empty state in src/components/TodoList/index.tsx
- [ ] T025 CompletionCelebration component with 20-second animation in src/components/CompletionCelebration/index.tsx
- [ ] T026 [P] EmptyState component with first-todo guidance in src/components/EmptyState/index.tsx

## Phase 3.4: Integration
- [ ] T027 Main application integration with all components in src/pages/index.tsx
- [ ] T028 Global styles and CSS animation definitions in src/styles/globals.css

## Phase 3.5: Polish
- [ ] T029 [P] Unit tests for useTodos hook in tests/unit/useTodos.test.ts
- [ ] T030 [P] Unit tests for storage utilities in tests/unit/storage.test.ts
- [ ] T031 [P] Component unit tests for TodoItem in tests/unit/TodoItem.test.tsx
- [ ] T032 [P] Component unit tests for AddTodoForm in tests/unit/AddTodoForm.test.tsx
- [ ] T033 [P] Performance optimizations and memo implementation
- [ ] T034 [P] Accessibility enhancements and ARIA labels
- [ ] T035 Manual testing execution following quickstart.md scenarios

## Dependencies
**Setup Phase**: T001 → T002 → {T003, T004, T005} (parallel)
**Test Phase**: All Setup complete → {T006-T014} (all parallel)
**Core Phase**: All Tests complete → {T015-T017} (parallel) → T018-T019 (sequential) → {T020-T021} (parallel) → {T022-T026} (mostly parallel except T025 depends on T022)
**Integration Phase**: Core complete → T027 → T028
**Polish Phase**: Integration complete → {T029-T034} (parallel) → T035

## Parallel Execution Examples

### Setup Phase (After T002)
```bash
# Launch T003-T005 together:
Task: "Configure ESLint with TypeScript strict rules in eslint.config.js"
Task: "Configure Jest testing environment in jest.config.js and setupTests.ts"
Task: "Configure Playwright for E2E testing in playwright.config.ts"
```

### Test Phase (After Setup Complete)
```bash
# Launch T006-T014 together:
Task: "Contract test for StorageInterface in tests/contracts/storage-interface.test.ts"
Task: "Contract test for component props in tests/contracts/component-interfaces.test.ts"
Task: "Integration test for first-time user experience in tests/integration/first-use.test.ts"
Task: "Integration test for basic CRUD operations in tests/integration/crud-operations.test.ts"
Task: "Integration test for data persistence in tests/integration/persistence.test.ts"
Task: "Integration test for edge cases handling in tests/integration/edge-cases.test.ts"
Task: "Integration test for accessibility features in tests/integration/accessibility.test.ts"
Task: "E2E test for complete user journey in tests/e2e/user-journey.spec.ts"
Task: "E2E test for performance benchmarks in tests/e2e/performance.spec.ts"
```

### Core Implementation Phase
```bash
# Launch T015-T017 together (Type definitions):
Task: "TodoItem interface and validation types in src/types/todo.ts"
Task: "Storage types and error classes in src/types/storage.ts"
Task: "Component prop types and theme config in src/types/components.ts"

# After T019, launch T020-T021 together:
Task: "useTodos hook with Context API and useReducer in src/hooks/useTodos.ts"
Task: "useLocalStorage hook for persistence abstraction in src/hooks/useLocalStorage.ts"

# Launch T022-T024, T026 together (T025 depends on T022):
Task: "TodoItem component with completion and delete actions in src/components/TodoItem/index.tsx"
Task: "AddTodoForm component with validation and submission in src/components/AddTodoForm/index.tsx"
Task: "TodoList component with item rendering and empty state in src/components/TodoList/index.tsx"
Task: "EmptyState component with first-todo guidance in src/components/EmptyState/index.tsx"
```

### Polish Phase
```bash
# Launch T029-T034 together:
Task: "Unit tests for useTodos hook in tests/unit/useTodos.test.ts"
Task: "Unit tests for storage utilities in tests/unit/storage.test.ts"
Task: "Component unit tests for TodoItem in tests/unit/TodoItem.test.tsx"
Task: "Component unit tests for AddTodoForm in tests/unit/AddTodoForm.test.tsx"
Task: "Performance optimizations and memo implementation"
Task: "Accessibility enhancements and ARIA labels"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task completion
- Follow TDD: Red → Green → Refactor cycle
- Ensure TypeScript strict mode compliance
- Maintain 60fps animation performance
- Support keyboard navigation and screen readers

## Task Generation Rules Applied
1. **From Contracts**:
   - storage-interface.ts → T006 contract test
   - component-interfaces.ts → T007 contract test

2. **From Data Model**:
   - TodoItem entity → T015 type definition, T018 storage implementation
   - TodoList entity → T020 useTodos hook implementation

3. **From User Stories** (quickstart.md):
   - First-time experience → T008 integration test
   - CRUD operations → T009 integration test
   - Data persistence → T010 integration test
   - Edge cases → T011 integration test
   - Accessibility → T012 integration test

4. **Ordering Applied**:
   - Setup → Tests → Types → Storage → Hooks → Components → Integration → Polish
   - Dependencies enforced through sequential numbering and explicit dependency graph

## Validation Checklist
- [x] All contracts have corresponding tests (T006-T007)
- [x] All entities have model tasks (T015 for TodoItem, T020 for TodoList)
- [x] All tests come before implementation (T006-T014 before T015+)
- [x] Parallel tasks truly independent (different files, no shared state)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task (verified)