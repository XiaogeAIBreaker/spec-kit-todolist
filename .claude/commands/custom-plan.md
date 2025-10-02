---
description: Execute the implementation planning workflow with automatic component list updates for src/components changes.
---

The user input to you can be provided directly by the agent or as a command argument - you **MUST** consider it before proceeding with the prompt (if not empty).

User input:

$ARGUMENTS

Given the implementation details provided as an argument, do this:

1. Run `.specify/scripts/bash/setup-plan.sh --json` from the repo root and parse JSON for FEATURE_SPEC, IMPL_PLAN, SPECS_DIR, BRANCH. All future file paths must be absolute.
   - BEFORE proceeding, inspect FEATURE_SPEC for a `## Clarifications` section with at least one `Session` subheading. If missing or clearly ambiguous areas remain (vague adjectives, unresolved critical choices), PAUSE and instruct the user to run `/clarify` first to reduce rework. Only continue if: (a) Clarifications exist OR (b) an explicit user override is provided (e.g., "proceed without clarification"). Do not attempt to fabricate clarifications yourself.

2. Read and analyze the feature specification to understand:
   - The feature requirements and user stories
   - Functional and non-functional requirements
   - Success criteria and acceptance criteria
   - Any technical constraints or dependencies mentioned

3. Read the constitution at `.specify/memory/constitution.md` to understand constitutional requirements.

4. Execute the implementation plan template:
   - Load `.specify/templates/plan-template.md` (already copied to IMPL_PLAN path)
   - Set Input path to FEATURE_SPEC
   - Run the Execution Flow (main) function steps 1-9
   - The template is self-contained and executable
   - Follow error handling and gate checks as specified
   - Let the template guide artifact generation in $SPECS_DIR:
     * Phase 0 generates research.md
     * Phase 1 generates data-model.md, contracts/, quickstart.md
     * Phase 2 generates tasks.md
   - Incorporate user-provided details from arguments into Technical Context: $ARGUMENTS
   - Update Progress Tracking as you complete each phase

5. **[组件清单更新]** After Phase 1 completes, update component documentation:
   - Run `.specify/scripts/bash/update-component-list.sh` from the repo root
   - This script will:
     * Analyze design artifacts (plan.md, data-model.md, contracts/) for component changes
     * Scan src/components/ directory for actual component files
     * Detect new, modified, or deleted components
     * Update src/components/component-list.md with changes
     * Maintain consistent documentation format
   - If the script reports component changes, review the updates to component-list.md
   - If component-list.md was updated, note this in the report

6. Verify execution completed:
   - Check Progress Tracking shows all phases complete
   - Ensure all required artifacts were generated
   - Confirm no ERROR states in execution
   - Verify component-list.md is updated if components were affected

7. Report results with branch name, file paths, and generated artifacts:
   - Include standard plan outputs (research.md, data-model.md, contracts/, quickstart.md)
   - If component-list.md was updated, mention the component changes detected

Use absolute paths with the repository root for all file operations to avoid path issues.
