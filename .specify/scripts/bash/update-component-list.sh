#!/usr/bin/env bash

# Update component list documentation based on plan changes
#
# This script maintains the src/components/component-list.md file by:
# 1. Analyzing design artifacts (plan.md, data-model.md, contracts/)
# 2. Scanning src/components/ directory for component files
# 3. Detecting component changes (new, modified, deleted)
# 4. Updating component-list.md with changes:
#    - New components: Add complete section with template
#    - Modified components: Add change note to 关键特性 section
#    - Updates timestamp
#
# Change extraction:
# - Parses plan.md Source Code structure for component comments
# - Example: "├── TodoList/  # 修改: 集成拖拽容器"
# - Adds: "- **[branch-name]** 集成拖拽容器" to 关键特性
#
# Usage: ./update-component-list.sh

set -e
set -u
set -o pipefail

#==============================================================================
# Configuration and Global Variables
#==============================================================================

# Get script directory and load common functions
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/common.sh"

# Get all paths and variables from common functions
eval $(get_feature_paths)

COMPONENT_LIST="$REPO_ROOT/src/components/component-list.md"
COMPONENTS_DIR="$REPO_ROOT/src/components"

#==============================================================================
# Utility Functions
#==============================================================================

log_info() {
    echo "INFO: $1"
}

log_success() {
    echo "✓ $1"
}

log_error() {
    echo "ERROR: $1" >&2
}

log_warning() {
    echo "WARNING: $1" >&2
}

#==============================================================================
# Validation Functions
#==============================================================================

validate_environment() {
    # Check if components directory exists
    if [[ ! -d "$COMPONENTS_DIR" ]]; then
        log_warning "Components directory not found at $COMPONENTS_DIR"
        log_info "No component updates needed"
        exit 0
    fi

    # Check if we have a current feature
    if [[ -z "$CURRENT_BRANCH" ]]; then
        log_error "Unable to determine current feature"
        exit 1
    fi

    # Check if plan.md exists
    if [[ ! -f "$IMPL_PLAN" ]]; then
        log_warning "No plan.md found at $IMPL_PLAN"
        log_info "Cannot analyze component changes without plan"
        exit 0
    fi
}

#==============================================================================
# Component Detection Functions
#==============================================================================

detect_component_files() {
    # Find all component index.tsx files
    if [[ -d "$COMPONENTS_DIR" ]]; then
        find "$COMPONENTS_DIR" -type f -name "index.tsx" | sort
    fi
}

extract_component_name() {
    local component_path="$1"
    # Extract component name from path like /path/to/ComponentName/index.tsx
    basename "$(dirname "$component_path")"
}

check_component_in_plan() {
    local component_name="$1"
    local plan_file="$IMPL_PLAN"

    # Check if component is mentioned in plan or related docs
    if [[ -f "$plan_file" ]]; then
        if grep -qi "$component_name" "$plan_file" 2>/dev/null; then
            return 0
        fi
    fi

    # Check data-model.md if it exists
    local data_model="$FEATURE_DIR/data-model.md"
    if [[ -f "$data_model" ]]; then
        if grep -qi "$component_name" "$data_model" 2>/dev/null; then
            return 0
        fi
    fi

    return 1
}

extract_component_changes() {
    local component_name="$1"
    local plan_file="$IMPL_PLAN"
    local changes=""

    # Extract changes from plan.md Source Code structure comments
    if [[ -f "$plan_file" ]]; then
        changes=$(grep -A 1 "├── ${component_name}/" "$plan_file" 2>/dev/null | \
                  grep "# " | \
                  sed 's/.*# //' | \
                  head -1)
    fi

    echo "$changes"
}

#==============================================================================
# Component List Update Functions
#==============================================================================

component_exists_in_list() {
    local component_name="$1"

    if [[ ! -f "$COMPONENT_LIST" ]]; then
        return 1
    fi

    # Check if component section exists in the list
    grep -q "^### [0-9]*\. $component_name$" "$COMPONENT_LIST" 2>/dev/null
}

add_component_to_list() {
    local component_name="$1"
    local component_path="$2"
    local current_date="$(date +%Y-%m-%d)"

    log_info "Adding new component: $component_name"

    # If component-list.md doesn't exist, create it with header
    if [[ ! -f "$COMPONENT_LIST" ]]; then
        cat > "$COMPONENT_LIST" << 'EOF'
# TodoList 组件清单

本文档记录了 TodoList 项目中所有的组件及其功能说明。

## 组件列表

EOF
    fi

    # Get the next component number
    local next_num=1
    if grep -q "^### [0-9]*\." "$COMPONENT_LIST"; then
        next_num=$(grep "^### [0-9]*\." "$COMPONENT_LIST" | \
                   sed 's/^### \([0-9]*\)\..*/\1/' | \
                   sort -n | tail -1)
        next_num=$((next_num + 1))
    fi

    # Get relative path for documentation
    local rel_path="${component_path#$REPO_ROOT}"

    # Create component entry
    local temp_file
    temp_file=$(mktemp)

    # Insert new component before the component relationship section or at the end
    if grep -q "^## 组件关系图$" "$COMPONENT_LIST"; then
        # Insert before relationship section
        awk -v num="$next_num" -v name="$component_name" -v path="$rel_path" '
        /^## 组件关系图$/ {
            print "---"
            print ""
            print "### " num ". " name
            print "**文件路径**: `" path "`"
            print ""
            print "**描述**: [待补充]"
            print ""
            print "**主要功能**:"
            print "- [待补充]"
            print ""
            print "**关键特性**:"
            print "- [待补充]"
            print ""
            print "**Props**:"
            print "- [待补充]"
            print ""
        }
        { print }
        ' "$COMPONENT_LIST" > "$temp_file"
    else
        # Append at the end
        cp "$COMPONENT_LIST" "$temp_file"
        cat >> "$temp_file" << EOF

---

### $next_num. $component_name
**文件路径**: \`$rel_path\`

**描述**: [待补充]

**主要功能**:
- [待补充]

**关键特性**:
- [待补充]

**Props**:
- [待补充]

EOF
    fi

    mv "$temp_file" "$COMPONENT_LIST"
    log_success "Added component $component_name to list"
}

update_existing_component() {
    local component_name="$1"
    local changes="$2"

    if [[ -z "$changes" ]]; then
        return 1
    fi

    log_info "Updating existing component: $component_name with changes: $changes"

    local temp_file
    temp_file=$(mktemp)

    # Find the component section and add change note to 关键特性
    awk -v name="$component_name" -v change="$changes" -v branch="$CURRENT_BRANCH" '
    BEGIN { in_component = 0; added_change = 0 }

    # Detect component section start
    /^### [0-9]*\. / {
        if ($0 ~ name) {
            in_component = 1
            added_change = 0
        } else {
            in_component = 0
        }
    }

    # Add change note after 关键特性 section
    /^\*\*关键特性\*\*:/ {
        if (in_component && !added_change) {
            print
            getline
            print
            print "- **[" branch "]** " change
            added_change = 1
            next
        }
    }

    # Print all lines
    { print }
    ' "$COMPONENT_LIST" > "$temp_file"

    mv "$temp_file" "$COMPONENT_LIST"
    log_success "Updated component $component_name documentation"
    return 0
}

update_component_list_timestamp() {
    if [[ -f "$COMPONENT_LIST" ]]; then
        local current_date="$(date +%Y-%m-%d)"

        # Update last modified timestamp if it exists
        if grep -q "最后更新:" "$COMPONENT_LIST"; then
            sed -i.bak "s/最后更新:.*$/最后更新: $current_date/" "$COMPONENT_LIST"
            rm -f "$COMPONENT_LIST.bak"
        fi
    fi
}

#==============================================================================
# Main Processing Function
#==============================================================================

process_components() {
    local changes_detected=false

    log_info "Scanning components in $COMPONENTS_DIR"

    # Get all component files
    local component_files
    component_files=$(detect_component_files)

    if [[ -z "$component_files" ]]; then
        log_info "No components found"
        return 0
    fi

    # Process each component
    while IFS= read -r component_file; do
        local component_name
        component_name=$(extract_component_name "$component_file")

        log_info "Checking component: $component_name"

        # Check if component is mentioned in plan or related to current feature
        if check_component_in_plan "$component_name"; then
            log_info "Component $component_name is related to current feature"

            # Extract change description from plan
            local component_changes
            component_changes=$(extract_component_changes "$component_name")

            # Check if component exists in list
            if ! component_exists_in_list "$component_name"; then
                add_component_to_list "$component_name" "$component_file"
                changes_detected=true
            else
                log_info "Component $component_name already in list"
                # Update existing component with changes
                if [[ -n "$component_changes" ]]; then
                    if update_existing_component "$component_name" "$component_changes"; then
                        changes_detected=true
                    fi
                fi
            fi
        fi
    done <<< "$component_files"

    # Update timestamp if changes were made
    if [[ "$changes_detected" == true ]]; then
        update_component_list_timestamp
        log_success "Component list updated successfully"
    else
        log_info "No component changes detected"
    fi
}

#==============================================================================
# Main Execution
#==============================================================================

main() {
    log_info "=== Updating component list for feature $CURRENT_BRANCH ==="

    # Validate environment
    validate_environment

    # Process components
    process_components

    log_success "Component list update completed"
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
