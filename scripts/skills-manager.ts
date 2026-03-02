import { execSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'

type SkillType = 'manual' | 'external'

interface SkillConfig {
  type: SkillType
  repo?: string
  source?: string
}

interface MetaConfig {
  skills: Record<string, SkillConfig>
}

interface SyncOptions {
  replace?: boolean
}

const root = resolve(dirname(new URL(import.meta.url).pathname), '..')
const metaPath = join(root, 'meta.json')

function run(command: string, cwd = root): string {
  return execSync(command, { cwd, encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] }).trim()
}

function loadMeta(): MetaConfig {
  if (!existsSync(metaPath)) {
    throw new Error('meta.json not found at repository root')
  }

  const parsed = JSON.parse(readFileSync(metaPath, 'utf8')) as MetaConfig
  if (!parsed.skills || typeof parsed.skills !== 'object') {
    throw new Error('meta.json must contain a top-level "skills" object')
  }
  return parsed
}

function getExternalEntries(meta: MetaConfig): Array<[string, SkillConfig]> {
  return Object.entries(meta.skills).filter(([, config]) => config.type === 'external')
}

function getRemoteHeadSha(repo: string): string {
  const output = run(`git ls-remote ${repo} HEAD`)
  return output.split(/\s+/)[0]
}

function parseMetaFile(skillDir: string): string | null {
  const metaFile = join(skillDir, 'META.md')
  if (!existsSync(metaFile)) {
    return null
  }

  const content = readFileSync(metaFile, 'utf8')
  const shaLine = content.split('\n').find(line => line.startsWith('- SHA: '))
  if (!shaLine) {
    return null
  }

  return shaLine.replace('- SHA: ', '').trim()
}

function writeMetaFile(skillName: string, config: SkillConfig, sha: string): void {
  const skillDir = join(root, skillName)
  const today = new Date().toISOString().split('T')[0]
  const lines = [
    '# Meta',
    '',
    '- Type: external',
    `- Source: ${config.source!}`,
    `- Repo: ${config.repo!}`,
    `- SHA: ${sha}`,
    `- Synced: ${today}`,
    '',
  ]
  writeFileSync(join(skillDir, 'META.md'), lines.join('\n'))
}

function copyDirRecursive(srcDir: string, dstDir: string): void {
  const entries = readdirSync(srcDir, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const dstPath = join(dstDir, entry.name)
    if (entry.isDirectory()) {
      mkdirSync(dstPath, { recursive: true })
      copyDirRecursive(srcPath, dstPath)
      continue
    }
    cpSync(srcPath, dstPath)
  }
}

function validateExternalConfig(skillName: string, config: SkillConfig): asserts config is SkillConfig & { repo: string, source: string } {
  const required = ['repo', 'source'] as const
  for (const key of required) {
    if (!config[key] || typeof config[key] !== 'string') {
      throw new Error(`skills.${skillName} is external and must define string field "${key}"`)
    }
  }
}

function syncOne(skillName: string, config: SkillConfig, options: SyncOptions = {}): void {
  validateExternalConfig(skillName, config)
  const replace = options.replace ?? true

  const tempRoot = mkdtempSync(join(tmpdir(), 'skills-sync-'))
  const cloneDir = join(tempRoot, 'repo')
  const targetDir = join(root, skillName)

  try {
    if (!replace && existsSync(targetDir)) {
      console.log(`skipped ${skillName}: already exists`)
      return
    }

    run(`git clone --depth 1 ${config.repo} ${cloneDir}`)
    const sha = run('git rev-parse HEAD', cloneDir)
    const sourceDir = join(cloneDir, config.source)

    if (!existsSync(sourceDir)) {
      throw new Error(`source path not found in cloned repo: ${config.source}`)
    }

    rmSync(targetDir, { recursive: true, force: true })
    mkdirSync(targetDir, { recursive: true })
    copyDirRecursive(sourceDir, targetDir)
    writeMetaFile(skillName, config, sha)

    console.log(`synced ${skillName} @ ${sha.slice(0, 12)}`)
  }
  finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
}

function createManualSkillTemplate(skillName: string): void {
  const skillDir = join(root, skillName)
  const skillFile = join(skillDir, 'SKILL.md')
  mkdirSync(skillDir, { recursive: true })

  if (existsSync(skillFile)) {
    return
  }

  const content = [
    '---',
    `name: ${skillName}`,
    'description: Describe when this skill should be used.',
    '---',
    '',
    `# ${skillName}`,
    '',
    'Add instructions for agents here.',
    '',
  ].join('\n')

  writeFileSync(skillFile, content)
}

function getCandidateSkillDirs(): string[] {
  const reserved = new Set(['docs', 'scripts', 'dist', 'node_modules'])
  return readdirSync(root, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name)
    .filter(name => !name.startsWith('.') && !reserved.has(name))
    .filter(name => {
      const dir = join(root, name)
      return existsSync(join(dir, 'SKILL.md')) || existsSync(join(dir, 'META.md'))
    })
}

function cmdList(meta: MetaConfig): void {
  for (const [name, config] of Object.entries(meta.skills)) {
    console.log(`${name}: ${config.type}`)
  }
}

function cmdCheck(meta: MetaConfig): void {
  const external = getExternalEntries(meta)
  if (!external.length) {
    console.log('No external skills configured.')
    return
  }

  for (const [skillName, config] of external) {
    validateExternalConfig(skillName, config)
    const localSha = parseMetaFile(join(root, skillName))
    const remoteSha = getRemoteHeadSha(config.repo)
    const status = localSha === remoteSha ? 'up-to-date' : 'update available'
    const localShort = localSha ? localSha.slice(0, 12) : 'none'
    console.log(`${skillName}: ${status} (local=${localShort}, remote=${remoteSha.slice(0, 12)})`)
  }
}

function cmdSync(meta: MetaConfig, target = 'all'): void {
  const external = getExternalEntries(meta)
  if (!external.length) {
    console.log('No external skills configured.')
    return
  }

  if (target === 'all') {
    for (const [skillName, config] of external) {
      syncOne(skillName, config)
    }
    return
  }

  const config = meta.skills[target]
  if (!config) {
    throw new Error(`Unknown skill: ${target}`)
  }
  if (config.type !== 'external') {
    throw new Error(`Skill is not external: ${target}`)
  }

  syncOne(target, config)
}

function cmdInit(meta: MetaConfig, target = 'all'): void {
  const entries = target === 'all'
    ? Object.entries(meta.skills)
    : [[target, meta.skills[target]] as [string, SkillConfig | undefined]]

  if (target !== 'all' && !meta.skills[target]) {
    throw new Error(`Unknown skill: ${target}`)
  }

  for (const [skillName, config] of entries) {
    if (!config) {
      continue
    }

    if (config.type === 'manual') {
      const skillDir = join(root, skillName)
      if (existsSync(skillDir)) {
        console.log(`skipped ${skillName}: already exists`)
        continue
      }

      createManualSkillTemplate(skillName)
      console.log(`initialized manual skill: ${skillName}`)
      continue
    }

    syncOne(skillName, config, { replace: false })
  }
}

function cmdCleanup(meta: MetaConfig, target = 'all', apply = false, dryRun = false): void {
  const configured = new Set(Object.keys(meta.skills))
  const candidates = getCandidateSkillDirs().filter(name => !configured.has(name))

  const extraDirs = target === 'all'
    ? candidates
    : candidates.filter(name => name === target)

  if (target !== 'all' && !extraDirs.length) {
    if (configured.has(target)) {
      throw new Error(`Cannot cleanup configured skill: ${target}`)
    }
    throw new Error(`No unmanaged skill directory found: ${target}`)
  }

  if (!extraDirs.length) {
    console.log('No unmanaged skill directories found.')
    return
  }

  for (const dir of extraDirs) {
    console.log(`unmanaged: ${dir}`)
  }

  if (dryRun) {
    console.log('Dry run mode: no files removed.')
    return
  }

  if (!apply) {
    console.log('Run cleanup with --yes to remove these directories.')
    return
  }

  for (const dir of extraDirs) {
    rmSync(join(root, dir), { recursive: true, force: true })
    console.log(`removed: ${dir}`)
  }
}

function printHelp(): void {
  console.log('Usage: bun scripts/skills-manager.ts <command> [skill-name] [--yes] [--dry-run]')
  console.log('')
  console.log('Commands:')
  console.log('  list             List all configured skills')
  console.log('  init [name|all]  Initialize missing manual skills and bootstrap missing external skills')
  console.log('  check            Check external skill update status')
  console.log('  sync [name|all]  Sync one external skill or all external skills')
  console.log('  cleanup [target] Show unmanaged skill directories, optionally remove with --yes')
}

function main(): void {
  try {
    const meta = loadMeta()
    const [command, ...rest] = process.argv.slice(2)
    const arg = rest.find(token => !token.startsWith('-'))
    const apply = rest.includes('--yes') || rest.includes('-y')
    const dryRun = rest.includes('--dry-run')

    if (!command || command === 'help' || command === '--help' || command === '-h') {
      printHelp()
      return
    }

    if (command === 'list') {
      cmdList(meta)
      return
    }
    if (command === 'init') {
      cmdInit(meta, arg ?? 'all')
      return
    }
    if (command === 'check') {
      cmdCheck(meta)
      return
    }
    if (command === 'sync') {
      cmdSync(meta, arg ?? 'all')
      return
    }
    if (command === 'cleanup') {
      cmdCleanup(meta, arg ?? 'all', apply, dryRun)
      return
    }

    throw new Error(`Unknown command: ${command}`)
  }
  catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

main()
