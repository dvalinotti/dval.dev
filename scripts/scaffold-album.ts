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
import { v2 as cloudinary } from 'cloudinary'
import { existsSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface Resource {
  public_id: string
  width: number
  height: number
}

const DATE_RE = /^\d{4}-\d{2}(-\d{2})?$/
const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/
const CONTENT_DIR = resolve('content/photos')

function yamlString(s: string): string {
  // Wrap in single quotes; escape embedded single quotes by doubling.
  return `'${s.replace(/'/g, "''")}'`
}

/**
 * Fetch resources from a Cloudinary folder, handling both folder modes:
 * - "Dynamic folder mode" (newer accounts): folder is metadata, not a
 *   public_id prefix. Queried via resources_by_asset_folder.
 * - "Fixed folder mode" (legacy): folder prefixes the public_id. Queried
 *   via resources({ prefix }).
 *
 * Tries dynamic mode first, falls back to fixed. Returns whichever yields
 * results.
 */
async function fetchFolderResources(folder: string): Promise<Resource[]> {
  // Dynamic folder mode
  try {
    const res = (await cloudinary.api.resources_by_asset_folder(folder, {
      max_results: 500
    })) as { resources: Resource[] }
    if (res.resources.length > 0) {
      console.log(`Found ${res.resources.length} via asset_folder (dynamic mode)`)
      return res.resources
    }
  } catch (err) {
    // Method may not exist on older SDK; ignore and fall through.
    if (!(err instanceof TypeError)) {
      console.debug('asset_folder lookup error (continuing):', err)
    }
  }

  // Fixed folder mode (prefix)
  const res = (await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500
  })) as { resources: Resource[] }
  if (res.resources.length > 0) {
    console.log(`Found ${res.resources.length} via prefix (fixed mode)`)
  }
  return res.resources
}

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: yarn album:scaffold <cloudinary-folder>')
    console.error('Example: yarn album:scaffold dval-photos/iceland-2025')
    process.exit(1)
  }
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in .env')
    process.exit(1)
  }

  const resources = await fetchFolderResources(folder)

  if (resources.length === 0) {
    console.error(
      `No resources found in folder "${folder}".\n` +
        'Checked both asset-folder (dynamic mode) and prefix (fixed mode).\n' +
        'Make sure the folder path exactly matches what appears in the Cloudinary Media Library.'
    )
    process.exit(1)
  }

  const sorted = [...resources].sort((a, b) =>
    a.public_id.localeCompare(b.public_id)
  )

  console.log(`Found ${sorted.length} photos in ${folder}\n`)

  const defaultSlug = folder
    .split('/')
    .pop()!
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const defaultPosition = existsSync(CONTENT_DIR)
    ? readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md')).length + 1
    : 1

  const rl = readline.createInterface({ input, output })

  async function ask(q: string, defaultVal = ''): Promise<string> {
    const suffix = defaultVal ? ` [${defaultVal}]` : ''
    const answer = (await rl.question(`${q}${suffix}: `)).trim()
    return answer || defaultVal
  }

  // Slug
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

  // Title
  let title = ''
  while (!title) {
    title = await ask('Title (required)')
    if (!title) console.error('Title is required.')
  }

  // Description
  const description = await ask('Description (optional)')

  // Date
  let date = ''
  while (!DATE_RE.test(date)) {
    date = await ask('Date (YYYY-MM or YYYY-MM-DD)')
    if (!DATE_RE.test(date)) {
      console.error('Date must match YYYY-MM or YYYY-MM-DD.')
    }
  }

  // Position
  let position = NaN
  while (!Number.isInteger(position) || position < 0) {
    const raw = await ask('Position', String(defaultPosition))
    position = parseInt(raw, 10)
    if (!Number.isInteger(position) || position < 0) {
      console.error('Position must be a non-negative integer.')
    }
  }

  // Cover image
  console.log('\nSelect cover image:')
  sorted.forEach((r, i) => console.log(`  [${i}] ${r.public_id}`))
  let coverIdx = NaN
  while (
    !Number.isInteger(coverIdx) ||
    coverIdx < 0 ||
    coverIdx >= sorted.length
  ) {
    const raw = await ask('Cover image index', '0')
    coverIdx = parseInt(raw, 10)
    if (
      !Number.isInteger(coverIdx) ||
      coverIdx < 0 ||
      coverIdx >= sorted.length
    ) {
      console.error(`Index must be between 0 and ${sorted.length - 1}.`)
    }
  }

  rl.close()

  const photosBlock = sorted
    .map(
      r =>
        `  - publicId: ${r.public_id}\n    alt: ''\n    width: ${r.width}\n    height: ${r.height}`
    )
    .join('\n')

  const lines: string[] = [
    '---',
    `title: ${yamlString(title)}`
  ]
  if (description) lines.push(`description: ${yamlString(description)}`)
  lines.push(
    `date: ${yamlString(date)}`,
    `position: ${position}`,
    `coverImage: ${sorted[coverIdx].public_id}`,
    'photos:',
    photosBlock,
    '---',
    ''
  )

  if (!existsSync(CONTENT_DIR)) mkdirSync(CONTENT_DIR, { recursive: true })
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
