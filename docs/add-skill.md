# Adding a New Skill 

1. **Add entry to `meta.json`:**
   ```json
   {
     "skills": {
       "my-skill": { "type": "manual" }
     }
   }
   ```

2. **Build and initialize:**
   ```bash
   npm run build
   npm run skills:init
   ```

3. **Edit `my-skill/SKILL.md`:**
   - Set `name` and `description` in YAML frontmatter
   - Add instructions for agents

4. **Commit your changes.**

## Adding an External Skill

1. **Add entry to `meta.json`:**
   ```json
   {
     "skills": {
       "external-skill": {
         "type": "external",
         "repo": "https://github.com/org/repo",
         "source": "skills/external-skill"
       }
     }
   }
   ```

2. **Build and sync:**
   ```bash
   npm run build
   npm run skills:sync
   ```

Real-world examples from this repo:

```json
"probe": {
  "type": "external",
  "repo": "https://github.com/zenon-red/probe",
  "source": "skills/probe"
},
"voize": {
  "type": "external",
  "repo": "https://github.com/zenon-red/voize",
  "source": "skills/voize"
}
```

## Skill Guidelines

- One concept per skill
- Include code examples
- Be concise - agents have limited context
- Use YAML frontmatter for metadata
