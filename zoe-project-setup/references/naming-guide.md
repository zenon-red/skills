# Project Naming Guide

## Repository Naming Standard

**Format:** `zenon-red/{kebab-case-project-name}`

**Rules:**
- All lowercase
- Kebab-case (hyphen-separated)
- No underscores
- Descriptive but concise (2-4 words)
- Avoid generic terms: "utils", "helpers", "common"

**Examples:**
- ✅ `zenon-red/nexus-bridge` (not `nexus_bridge`)
- ✅ `zenon-red/sentinel-oracle` (not `sentinelOracle`)
- ✅ `zenon-red/plasma-tracker` (not `utils`)
- ❌ `zenon-red/common-utils`
- ❌ `zenon-red/my_project`
- ❌ `zenon-red/ZenonNexus`

**Prefix categories (when needed):**
- `zenon-red/skill-*` - Agent skills
- `zenon-red/probe-*` - Probe extensions
- `zenon-red/zr-*` - Zenon Red infrastructure

## Component Tags

Tag projects with components for task routing:
- `stdb` - SpacetimeDB schema/reducers
- `backend` - Deno API gateway
- `frontend` - React web UI
- `docs` - Documentation
- `lib` - Shared library
- `multi` - Multiple components (monorepo)
