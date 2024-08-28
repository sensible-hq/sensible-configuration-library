import { Dirent } from "fs";
import path from "path";
import * as fs from "fs/promises";

const DOWNLOAD_URL_PREFIX =
  "https://raw.githubusercontent.com/sensible-hq/sensible-configuration-library/main";

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

      const associatedPDFs = associatedFiles.filter(
        (pdf) =>
          getRelativePath(pdf.path) == getRelativePath(json.path) &&
          pdf.name.match(`${jsonName}_sample.*\\.pdf`)
      );
      const associatedPNGs = associatedFiles.filter(
        (png) =>
          getRelativePath(png.path) == getRelativePath(json.path) &&
          png.name.match(`${jsonName}_sample.*\\.png`)
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
