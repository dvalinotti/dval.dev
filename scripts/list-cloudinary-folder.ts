/**
 * Lists all Cloudinary resources in a given folder and prints a
 * ready-to-paste YAML block for a content/photos/*.md file.
 *
 * Usage: yarn cloudinary:list <folder>
 *   e.g. yarn cloudinary:list dval-photos/iceland
 */
import {
  configureCloudinary,
  fetchFolderResources,
  photosYamlBlock,
  sortByPublicId,
  FOLDER_NOT_FOUND_HINT
} from './_cloudinary'

async function main() {
  const folder = process.argv[2]
  if (!folder) {
    console.error('Usage: yarn cloudinary:list <folder>')
    console.error('Example: yarn cloudinary:list dval-photos/iceland')
    process.exit(1)
  }
  configureCloudinary()

  const resources = await fetchFolderResources(folder)
  if (resources.length === 0) {
    console.error(`No resources found in folder "${folder}".\n${FOLDER_NOT_FOUND_HINT}`)
    process.exit(1)
  }

  console.log(photosYamlBlock(sortByPublicId(resources)))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
