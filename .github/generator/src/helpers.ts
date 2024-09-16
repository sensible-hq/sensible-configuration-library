import { Dirent } from "fs";
import path from "path";
import * as fs from "fs/promises";

const REPO_NAME = 'sensible-configuration-library'
const DOWNLOAD_URL_PREFIX =
  "https://raw.githubusercontent.com/sensible-hq/sensible-configuration-library/main";

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

function getTitleCase(line: string) {
  return line.split(' ').map((word) => word[0]?.toUpperCase() + word.slice(1)).join(' ')
}

//types
export type Manifest = Entry[];

type Entry = {
  config_data?: ConfigDataReturn & { path: string };
  files?: RepoFile[];
};

type ConfigDataReturn = {
  path: string;
  category: string;
  description: string;
  display_name: string;
  featured: {
    primary: string;
    secondary: string;
  };
};

type RepoFile = {
  path: string;
  download_url: string;
};

type LibraryGroup = {
  name: string;
  children: (LibraryGroup | LibraryDocType)[];
  thumbnails: string[];
};

type LibraryDocType = {
  name: string;
  schema?: LibraryDocTypeSchema;
  templates: LibraryTemplate[];
  thumbnails: string[];
};

type LibraryDocTypeSchema = {
  description: string;
}

type LibraryTemplate = {
  name: string;
  refDocs: string[];
}

export async function createTemplateLibrary() {
  const root = path.join(__dirname, "..", "..", "..", "templates");
  const directories = await fs.readdir(root, {
    withFileTypes: true,
  })

  const templateLibrary = await Promise.all(directories.map((dirent) => {
    const path = [dirent.path, dirent.name].join('/')
    return getLibrarySubGroup(path)
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
    const schemaObj = JSON.parse(schemaFile)

    const docTypeThumbnails = refDocs
      .filter((refDoc) => refDoc.name.match(/.*\.png$/i))
      .slice(0, 2)
      .map((refDoc) => getFileDownloadUrl(refDoc))

    const libraryDocType: LibraryDocType = {
      name: groupName,
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

      if (!templateRefDocs.length) continue

      const libraryTemplate: LibraryTemplate = {
        name: templateName,
        refDocs: templateRefDocs
      }

      libraryDocType.templates.push(libraryTemplate)
    }

    return libraryDocType
  } else {
    const libraryGroup: LibraryGroup = {
      name: groupName,
      thumbnails: [],
      children: [],
    }
    const libraryGroupChildren: (LibraryGroup | LibraryDocType)[] = []

    for (const file of files) {
      if (!file.isDirectory()) continue

      const librarySubGroup = await getLibrarySubGroup([file.path, file.name].join('/'))
      const isValidSubGroup = 'children' in librarySubGroup && !!librarySubGroup.children.length
      const isValidDocType = 'templates' in librarySubGroup && !!librarySubGroup.templates.length
      if (isValidSubGroup || isValidDocType) {
        libraryGroupChildren.push(librarySubGroup)
      }
    }

    const thumbnails = libraryGroupChildren.flatMap((child) => child.thumbnails).slice(0, 2)

    libraryGroup.children = libraryGroupChildren
    libraryGroup.thumbnails = thumbnails

    return libraryGroup
  }
}

export async function generateManifest(): Promise<string> {
  const root = path.join(__dirname, "..", "..", "..");

  //helpers
  const isRepoFile = (dir: Dirent): boolean => {
    return !dir.path?.includes(".") && !!dir.name.match(/.*\.(pdf|png|json)/);
  };

  const isConfigFile = (dir: Dirent): boolean => {
    return isRepoFile(dir) && dir.name === "config.json";
  };

  const getRelativePath = (path: string) => path.split(`${root}/`)[1];

  const getConfigFolder = (path: string) =>
    getRelativePath(path)?.split("/")[0];

  const getFileInfo = (path: string, name: string) => ({
    path: `${getRelativePath(path)}/${name}`,
    download_url: `${DOWNLOAD_URL_PREFIX}/${getRelativePath(path)}/${name}`,
  });

  //read all files in repo
  const directory = await fs.readdir(root, {
    withFileTypes: true,
    recursive: true,
  });

  const configFiles = directory.filter(isConfigFile)

  const manifest: Manifest = [];

  //loop through config.json files
  for (const config of configFiles) {
    const entry: Entry = {};
    const files: RepoFile[] = [];

    //set entry config data
    entry.config_data = {
      path: getConfigFolder(config.path),
      ...JSON.parse(
        await fs.readFile(`${config.path}/${config.name}`, "utf-8")
      ),
    };

    //format config data featured file names
    if (entry.config_data?.featured.primary) {
      entry.config_data.featured.primary = `${entry.config_data?.featured.primary}_sample.png`;
    }
    if (entry.config_data?.featured.secondary) {
      entry.config_data.featured.secondary = `${entry.config_data?.featured.secondary}_sample.png`;
    }

    //get all files associated with config
    const associatedFiles = directory.filter(
      (f) =>
        getConfigFolder(f.path) == getConfigFolder(config.path) &&
        isRepoFile(f) &&
        !isConfigFile(f)
    );
    const associatedJsons = associatedFiles.filter((f) =>
      f.name.includes(".json")
    );

    //loop through senseML config files and find associated pdfs and pngs
    for (const json of associatedJsons) {
      let jsonIncluded = false;
      const jsonName = json.name.split(".")[0];

      const pdfRegex = new RegExp(`^${jsonName}_sample.*\\.pdf$`)
      const pngRegex = new RegExp(`^${jsonName}_sample.*\\.png$`)

      const associatedPDFs = associatedFiles.filter(
        (pdf) =>
          getRelativePath(pdf.path) == getRelativePath(json.path) &&
          pdf.name.match(pdfRegex)
      );
      const associatedPNGs = associatedFiles.filter(
        (png) =>
          getRelativePath(png.path) == getRelativePath(json.path) &&
          png.name.match(pngRegex)
      );

      associatedPDFs.forEach((pdf) => {
        const pdfName = pdf.name.split(".")[0];
        const png = associatedPNGs.find(
          (png) => png.path === pdf.path && png.name == `${pdfName}.png`
        );

        //there has to be a pdf and png for each senseML config
        if (png) {
          if (!jsonIncluded) {
            //only add senseML json once
            files.push(getFileInfo(json.path, json.name));
            jsonIncluded = true;
          }
          files.push(
            getFileInfo(pdf.path, pdf.name),
            getFileInfo(png.path, png.name)
          );
        }
      });
    }
    //entry is only valid if it has at least 3 files
    if (files.length >= 3) {
      entry.files = files;
      manifest.push(entry);
    }
  }
  return JSON.stringify(manifest);
}
