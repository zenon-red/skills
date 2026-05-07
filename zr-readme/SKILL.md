---
name: zr-readme
description: Create consistent, formatted README files for zenon-red repositories. Use when writing or updating README.md files for any zenon-red project to ensure matching structure, section order, badge styling, and formatting conventions across all repos.
---

# Zenon Red README Creation

Generate README files that match the exact structure and style of zenon-red repositories.

## Template

Use the template at [assets/readme-template.md](assets/readme-template.md) as the base structure.

## Section Order (Required)

Every README must follow this exact order:

1. **Header** - Centered `<div>` with logo image, `# Title`, and tagline paragraph
2. **Why** - Explain the purpose and context
3. **Navigation** - Centered `<p>` with links to key docs
4. **Usage** - Installation, requirements, and examples
5. **Contributing** - Reference to CONTRIBUTING.md
6. **License** - Reference to LICENSE file

## Formatting Rules

### Header Section

```html
<div align="center">
<img width="128px" alt="{name} logo" src="./.github/{name}.png">

# {Name}

<p align="center">
{tagline line 1}.<br/>
{tagline line 2}.<br/>
Built by Aliens.
</p>

</div>
```

- Logo: 128px width, PNG in `.github/` folder
- Exception: in special repos that already keep logos at root (for example `zenon-red/.github`), use the existing repository convention.
- Title: Plain `#` heading, not markdown link
- Tagline: 2-3 lines, always end with "Built by Aliens."

### Requirements Badge

Centered with `<h3 align="center">REQUIREMENTS</h3>` and `<p align="center">` wrapper:

```html
<h3 align="center">REQUIREMENTS</h3>

<p align="center">
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://img.shields.io/badge/Node.js-%3E%3D22.0.0-339933?logo=nodedotjs&logoColor=white&style=for-the-badge" alt="Node.js">
  </a>
</p>
```

Badge format: `https://img.shields.io/badge/{Label}-{Version}-{Color}?logo={icon}&logoColor=white&style=for-the-badge`

### Navigation Links

Centered paragraph with middot separators:

```html
<p align="center">
  <a href="./docs/getting-started.md">Getting Started</a> ·
  <a href="./docs/commands.md">Commands</a> ·
  <a href="./docs/other.md">Other</a>
</p>
```

### Code Blocks

Always use `bash` language tag. Use `$ ` prefix for command output examples:

````markdown
```bash
$ probe task list
tasks[5]{id,title,status}:
  "1","Example task",OPEN
```
````

### Subsections

Use `###` for subsections under `## Usage`. Common subsections:
- Installation (with #### Node Package Manager, #### GitHub Releases)
- First Steps (numbered list)
- Querying/Usage examples
- Next Step (links to SKILL.md)

### Contributing Section

Standard text referencing Nexus:

```markdown
## Contributing

This project is intended to be maintained autonomously by agents in the future. Humans can contribute by routing changes through their agents via [Nexus](https://github.com/zenon-red/nexus). See [CONTRIBUTING.md](./CONTRIBUTING.md) for details.
```

### License Section

```markdown
## License

[MIT](./LICENSE)
```

## Process

1. Gather repository info: name, description, tech stack, key features
2. Generate logo placeholder note if no expected logo path exists (usually `.github/{name}.png`)
3. Write each section following the template structure
4. Ensure all badges use `style=for-the-badge`
5. Verify section order matches exactly

## Badge Color Reference

- Node.js: `339933` (green)
- Rust: `000000` (black)
- Python: `3776AB` (blue)
- TypeScript: `3178C6` (blue)
- Go: `00ADD8` (cyan)
