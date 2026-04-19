/**
 * Scaffolds a new album markdown file from a Cloudinary folder.
 *
 * Fetches all photos in the given folder, prompts for album metadata,
 * and writes content/photos/<slug>.md with the photos list pre-populated
 * (alt fields blank for you to fill in).
 *
 * Usage: yarn album:scaffold <cloudinary-folder>
 *   e.g. yarn album:scaffold dval-photos/iceland-2025
 */
import { existsSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'
import {
  configureCloudinary,
  fetchFolderResources,
  photosYamlBlock,
  sortByPublicId,
  FOLDER_NOT_FOUND_HINT
} from './_cloudinary'

const DATE_RE = /^\d{4}-\d{2}(-\d{2})?$/
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/
const CONTENT_DIR = resolve('content/photos')

function yamlString(s: string): string {
  return `'${s.replace(/'/g, "''")}'`
}

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: yarn album:scaffold <cloudinary-folder>')
    console.error('Example: yarn album:scaffold dval-photos/iceland-2025')
    process.exit(1)
  }
  configureCloudinary()

  const resources = await fetchFolderResources(folder)
  if (resources.length === 0) {
    console.error(`No resources found in folder "${folder}".\n${FOLDER_NOT_FOUND_HINT}`)
    process.exit(1)
  }

  const sorted = sortByPublicId(resources)
  console.log(`Found ${sorted.length} photos in ${folder}\n`)

  const defaultSlug = folder
    .split('/')
    .pop()!
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  mkdirSync(CONTENT_DIR, { recursive: true })
  const defaultPosition
    = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md')).length + 1

  const rl = readline.createInterface({ input, output })

  async function ask(q: string, defaultVal = ''): Promise<string> {
    const suffix = defaultVal ? ` [${defaultVal}]` : ''
    const answer = (await rl.question(`${q}${suffix}: `)).trim()
    return answer || defaultVal
  }

  let slug = await ask('Slug (URL path segment)', defaultSlug)
  while (!SLUG_RE.test(slug)) {
    console.error('Slug must be lowercase letters, numbers, and hyphens only.')
    slug = await ask('Slug', defaultSlug)
  }
  const outPath = resolve(CONTENT_DIR, `${slug}.md`)
  if (existsSync(outPath)) {
    rl.close()
    console.error(`File already exists: ${outPath}`)
    console.error('Choose a different slug or remove the existing file first.')
    process.exit(1)
  }

  let title = ''
  while (!title) {
    title = await ask('Title (required)')
    if (!title) console.error('Title is required.')
  }

  const description = await ask('Description (optional)')

  let date = ''
  while (!DATE_RE.test(date)) {
    date = await ask('Date (YYYY-MM or YYYY-MM-DD)')
    if (!DATE_RE.test(date)) {
      console.error('Date must match YYYY-MM or YYYY-MM-DD.')
    }
  }

  let position = NaN
  while (!Number.isInteger(position) || position < 0) {
    const raw = await ask('Position', String(defaultPosition))
    position = parseInt(raw, 10)
    if (!Number.isInteger(position) || position < 0) {
      console.error('Position must be a non-negative integer.')
    }
  }

  console.log('\nSelect cover image:')
  sorted.forEach((r, i) => console.log(`  [${i}] ${r.public_id}`))
  let coverIdx = NaN
  while (
    !Number.isInteger(coverIdx)
    || coverIdx < 0
    || coverIdx >= sorted.length
  ) {
    const raw = await ask('Cover image index', '0')
    coverIdx = parseInt(raw, 10)
    if (
      !Number.isInteger(coverIdx)
      || coverIdx < 0
      || coverIdx >= sorted.length
    ) {
      console.error(`Index must be between 0 and ${sorted.length - 1}.`)
    }
  }

  rl.close()

  const lines: string[] = ['---', `title: ${yamlString(title)}`]
  if (description) lines.push(`description: ${yamlString(description)}`)
  lines.push(
    `date: ${yamlString(date)}`,
    `position: ${position}`,
    `coverImage: ${sorted[coverIdx].public_id}`,
    'photos:',
    photosYamlBlock(sorted),
    '---',
    ''
  )

  writeFileSync(outPath, lines.join('\n'))

  console.log(`\nWrote ${outPath}`)
  console.log('Next steps:')
  console.log(`  1. Fill in the 'alt' fields for each photo.`)
  console.log(`  2. Add optional 'caption:' lines for notable shots.`)
  console.log(`  3. git add ${outPath} && git commit && git push`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
