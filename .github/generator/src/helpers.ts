import { Dirent } from "fs";
import path from "path";
import * as fs from "fs/promises";

const REPO_NAME = 'sensible-configuration-library'
const DOWNLOAD_URL_PREFIX =
  `https://raw.githubusercontent.com/sensible-hq/${REPO_NAME}/main`;

export type Library = {
  baseUrl: string;
  library: LibraryGroup['children'];
}

export type LibraryGroup = {
  children: Record<string, LibraryGroup | LibraryDocType>;
  thumbnails: string[];
};

export type LibraryDocType = {
  schema?: LibraryDocTypeSchema;
  templates: LibraryTemplate[];
  thumbnails: string[];
};

export type LibraryDocTypeSchema = {
  description: string;
}

export type LibraryTemplate = {
  name: string;
  refDocs: string[];
}

export async function createTemplateLibrary() {
  const root = path.join(__dirname, "..", "..", "..", "templates");
  const directories = await fs.readdir(root, {
    withFileTypes: true,
  })

  const templateLibrary: Library = {
    baseUrl: DOWNLOAD_URL_PREFIX,
    library: {}
  }

  await Promise.all(directories.map(async (dirent) => {
    const path = [dirent.path, dirent.name].join('/')
    const subgroup = await getLibrarySubGroup(path)
    templateLibrary.library[dirent.name] = subgroup
  }))

  return JSON.stringify(templateLibrary)
}

export async function getLibrarySubGroup(path: string) {
  const files = await fs.readdir(path, {
    withFileTypes: true
  })

  const refDocsDirent = files.find((dirent) => dirent.name === 'refdocs')
  const configurationsDirent = files.find((dirent) => dirent.name === 'configurations')
  const schemaDirent = files.find((dirent) => dirent.name === 'schema.json')
  const isDocType = !!(refDocsDirent && configurationsDirent && schemaDirent)

  const groupPathParts = path.split('/')
  const groupName = groupPathParts.at(-1)
  if (!groupName) throw new Error('Invalid Library Group Path')

  if (isDocType) {
    const refDocs = await fs.readdir(`${refDocsDirent.path}/${refDocsDirent.name}`, {
      withFileTypes: true
    })
    const configurations = await fs.readdir(
      `${configurationsDirent.path}/${configurationsDirent.name}`,
      { withFileTypes: true }
    )
    const schemaFile = await fs.readFile(`${schemaDirent.path}/${schemaDirent.name}`, 'utf8')
    const schemaObj = JSON.parse(schemaFile) as LibraryDocTypeSchema

    const docTypeThumbnails = refDocs
      .filter((refDoc) => refDoc.name.match(/.*\.png$/i))
      .slice(0, 2)
      .map((refDoc) => getFileDownloadUrl(refDoc))

    const libraryDocType: LibraryDocType = {
      schema: schemaObj,
      thumbnails: docTypeThumbnails,
      templates: []
    }

    for (const jsonFile of configurations) {
      const templateName = jsonFile.name.replace('.json', '')
      const refDocRegex = new RegExp(`^${templateName}.*\\.pdf$`, 'i')

      const templateRefDocs = refDocs
        .filter((refDoc) => refDoc.name.match(refDocRegex))
        .map((refDoc) => refDoc.name.replace('.pdf', ''))

      if (templateRefDocs.length) {
        const libraryTemplate: LibraryTemplate = {
          name: templateName,
          refDocs: templateRefDocs
        }
        libraryDocType.templates.push(libraryTemplate)
      }
    }

    return libraryDocType
  } else {
    const libraryGroupChildren: LibraryGroup['children'] = {}

    for (const file of files) {
      if (!file.isDirectory()) continue

      const librarySubGroup = await getLibrarySubGroup([file.path, file.name].join('/'))
      const isValidSubGroup = 'children' in librarySubGroup && !!Object.keys(librarySubGroup.children).length
      const isValidDocType = 'templates' in librarySubGroup && !!librarySubGroup.templates.length

      if (isValidSubGroup || isValidDocType) {
        libraryGroupChildren[file.name] = librarySubGroup
      }
    }

    const thumbnails = Object.values(libraryGroupChildren)
      .flatMap((child) => child.thumbnails)
      .slice(0, 2)

    const libraryGroup: LibraryGroup = {
      thumbnails: thumbnails,
      children: libraryGroupChildren,
    }

    return libraryGroup
  }
}

function getDocTypePath(dirent: Dirent): string {
  const fileSystemPathSplit = dirent.path.split(REPO_NAME)
  const docTypePath = fileSystemPathSplit.at(-1)

  if (!docTypePath) throw new Error('Invalid reference doc path')
  return docTypePath
}

function getFileDownloadUrl(dirent: Dirent): string {
  const path = getDocTypePath(dirent)

  return `${DOWNLOAD_URL_PREFIX}${encodeURI(path)}/${dirent.name}`
}

