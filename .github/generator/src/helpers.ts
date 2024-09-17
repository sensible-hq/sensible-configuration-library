import { Dirent } from "fs";
import path from "path";
import * as fs from "fs/promises";
import {
  Library,
  LibraryDocType,
  LibraryDocTypeSchema,
  LibraryGroup,
  LibraryTemplate,
} from "./types";

const REPO_NAME = "sensible-configuration-library";
const DOWNLOAD_URL_PREFIX = `https://raw.githubusercontent.com/sensible-hq/${REPO_NAME}/main`;

export async function createTemplateLibrary() {
  const root = path.join(__dirname, "..", "..", "..", "templates");
  const directories = await fs.readdir(root, { withFileTypes: true });

  const templateLibrary: Library = {
    baseUrl: DOWNLOAD_URL_PREFIX,
    library: {},
  };

  await Promise.all(
    directories.map(async (dirent) => {
      const path = [dirent.path, dirent.name].join("/");
      const subgroup = await getLibrarySubGroup(path);
      templateLibrary.library[dirent.name] = subgroup;
    }),
  );

  return JSON.stringify(templateLibrary);
}

export async function getLibrarySubGroup(
  path: string,
): Promise<LibraryGroup | LibraryDocType> {
  const groupPathParts = path.split("/");
  const groupName = groupPathParts.at(-1);
  if (!groupName) throw new Error("Invalid Library Group Path");

  const directoryEntries = await fs.readdir(path, {
    withFileTypes: true,
  });

  const refDocsDirectory = directoryEntries.find(
    (dirent) => dirent.name === "refdocs",
  );
  const configurationsDirectory = directoryEntries.find(
    (dirent) => dirent.name === "configurations",
  );
  const schemaFile = directoryEntries.find(
    (dirent) => dirent.name === "schema.json",
  );
  const isDocType = !!(
    refDocsDirectory &&
    configurationsDirectory &&
    schemaFile
  );

  // base case - reached a "leaf-node" directory containing details of a doc type
  if (isDocType) {
    const libraryDocType = await getLibraryDocType({
      refDocsDirectory,
      configurationsDirectory,
      schemaFile,
    });
    return libraryDocType;
  }

  const libraryGroupChildren: LibraryGroup["children"] = {};

  // recurse on child directories push any valid sub groups or doc types
  for (const entry of directoryEntries) {
    if (!entry.isDirectory()) continue;

    const librarySubGroup = await getLibrarySubGroup(
      [entry.path, entry.name].join("/"),
    );

    const isValidSubGroup =
      "children" in librarySubGroup &&
      !!Object.keys(librarySubGroup.children).length;

    const isValidDocType =
      "templates" in librarySubGroup && !!librarySubGroup.templates.length;

    if (isValidSubGroup || isValidDocType) {
      libraryGroupChildren[entry.name] = librarySubGroup;
    }
  }

  // grab the first two thumbnails from the children
  const thumbnails = Object.values(libraryGroupChildren)
    .flatMap((child) => child.thumbnails)
    .slice(0, 2);

  const libraryGroup: LibraryGroup = {
    thumbnails: thumbnails,
    children: libraryGroupChildren,
  };

  return libraryGroup;
}

async function getLibraryDocType({
  refDocsDirectory,
  configurationsDirectory,
  schemaFile,
}: {
  refDocsDirectory: Dirent;
  configurationsDirectory: Dirent;
  schemaFile: Dirent;
}) {
  // grab doc type refdocs, configs, and the doctype schema object
  const refDocs = await fs.readdir(
    `${refDocsDirectory.path}/${refDocsDirectory.name}`,
    { withFileTypes: true },
  );
  const configurations = await fs.readdir(
    `${configurationsDirectory.path}/${configurationsDirectory.name}`,
    { withFileTypes: true },
  );
  const schema = await fs.readFile(
    `${schemaFile.path}/${schemaFile.name}`,
    "utf8",
  );
  const schemaObj = JSON.parse(schema) as LibraryDocTypeSchema;

  // grab the first two available thumbnails from child files
  const docTypeThumbnails = refDocs
    .filter((refDoc) => refDoc.name.match(/.*\.png$/i))
    .slice(0, 2)
    .map((refDoc) => getFileDownloadUrl(refDoc));

  const libraryDocType: LibraryDocType = {
    schema: schemaObj,
    thumbnails: docTypeThumbnails,
    templates: [],
  };

  // push each json file paried with its reference documents into the templates array
  for (const jsonFile of configurations) {
    const templateName = jsonFile.name.replace(".json", "");
    const refDocRegex = new RegExp(`^${templateName}.*\\.pdf$`, "i");

    const templateRefDocs = refDocs
      .filter((refDoc) => refDoc.name.match(refDocRegex))
      .map((refDoc) => refDoc.name.replace(".pdf", ""));

    if (templateRefDocs.length) {
      const libraryTemplate: LibraryTemplate = {
        name: templateName,
        refDocs: templateRefDocs,
      };
      libraryDocType.templates.push(libraryTemplate);
    }
  }

  return libraryDocType;
}

function getDocTypePath(dirent: Dirent): string {
  const fileSystemPathSplit = dirent.path.split(REPO_NAME);
  const docTypePath = fileSystemPathSplit.at(-1);

  if (!docTypePath) throw new Error("Invalid reference doc path");
  return docTypePath;
}

function getFileDownloadUrl(dirent: Dirent): string {
  const path = getDocTypePath(dirent);

  return `${DOWNLOAD_URL_PREFIX}${encodeURI(path)}/${dirent.name}`;
}
