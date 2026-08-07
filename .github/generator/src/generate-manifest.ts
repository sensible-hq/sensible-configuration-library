#!/usr/bin/env -S npx ts-node -T

import { mkdirSync, writeFileSync } from "fs";
import path from "path";
import { createTemplateLibrary } from "./create-template-library";

// Repo-root output/ (gitignored). The CI workflow uploads this manifest and
// syncs the templates/ tree to the config-library bucket.
const OUTPUT_DIR = path.join(__dirname, "..", "..", "..", "output");
const MANIFEST_OUTPUT_PATH = path.join(OUTPUT_DIR, "manifest_v3.json");

async function main() {
  const library = await createTemplateLibrary();
  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(MANIFEST_OUTPUT_PATH, library);
  console.log(`Wrote manifest to ${MANIFEST_OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
