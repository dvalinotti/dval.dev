/**
 * Shared helpers for Cloudinary authoring scripts.
 */
import { v2 as cloudinary } from 'cloudinary'

export interface CloudinaryResource {
  public_id: string
  width: number
  height: number
}

export function configureCloudinary() {
  if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET in .env')
    process.exit(1)
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  })
}

/**
 * Handles both Cloudinary folder modes:
 * - Dynamic: folder is metadata (resources_by_asset_folder)
 * - Fixed: folder prefixes the public_id (resources with prefix)
 *
 * Tries dynamic first, falls back to fixed.
 */
export async function fetchFolderResources(
  folder: string
): Promise<CloudinaryResource[]> {
  try {
    const res = (await cloudinary.api.resources_by_asset_folder(folder, {
      max_results: 500
    })) as { resources: CloudinaryResource[] }
    if (res.resources.length > 0) return res.resources
  } catch (err) {
    if (!(err instanceof TypeError)) {
      console.debug('asset_folder lookup error (continuing):', err)
    }
  }

  const res = (await cloudinary.api.resources({
    type: 'upload',
    prefix: folder,
    max_results: 500
  })) as { resources: CloudinaryResource[] }
  return res.resources
}

export function photosYamlBlock(resources: CloudinaryResource[]): string {
  return resources
    .map(
      r =>
        `  - publicId: ${r.public_id}\n    alt: ''\n    width: ${r.width}\n    height: ${r.height}`
    )
    .join('\n')
}

export function sortByPublicId(
  resources: CloudinaryResource[]
): CloudinaryResource[] {
  return [...resources].sort((a, b) => a.public_id.localeCompare(b.public_id))
}

export const FOLDER_NOT_FOUND_HINT =
  'Checked both asset-folder (dynamic mode) and prefix (fixed mode).\n'
  + 'Make sure the folder path exactly matches what appears in the Cloudinary Media Library.'
