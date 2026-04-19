/**
 * Lists all Cloudinary resources under a given folder prefix and prints a
 * ready-to-paste YAML block for pasting into a content/photos/*.md file.
 *
 * Usage: yarn cloudinary:list <folder>
 *   e.g. yarn cloudinary:list dval-photos/iceland
 */
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryResource {
  public_id: string
  width: number
  height: number
}

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: yarn cloudinary:list <folder>')
    console.error('Example: yarn cloudinary:list dval-photos/iceland')
    process.exit(1)
  }
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in .env')
    process.exit(1)
  }

  const result = await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500
  }) as { resources: CloudinaryResource[] }

  if (result.resources.length === 0) {
    console.error(`No resources found under prefix "${folder}".`)
    process.exit(1)
  }

  const sorted = [...result.resources].sort((a, b) =>
    a.public_id.localeCompare(b.public_id)
  )

  const yaml = sorted.map(r =>
    `  - publicId: ${r.public_id}\n    alt: ''\n    width: ${r.width}\n    height: ${r.height}`
  ).join('\n')

  console.log(yaml)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
