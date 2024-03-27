import assert from "assert";
import { generateManifest, type Manifest } from "./helpers";

describe("generate-manifest", () => {
  let manifest: string;
  let parsedManifest: Manifest;

  beforeAll(async () => {
    manifest = await generateManifest();
    parsedManifest = JSON.parse(manifest);
  });

  it("should generate manifest", () => {
    expect(parsedManifest).toBeInstanceOf(Array);
    expect(parsedManifest.length).toBeGreaterThan(0);
  });

  it("should have valid entries", () => {
    for (const entry of parsedManifest) {
      expect(entry).toHaveProperty("config_data");
      expect(entry.config_data).toBeInstanceOf(Object);
      expect(entry.config_data).toHaveProperty("path");
      expect(entry.config_data).toHaveProperty("category");
      expect(entry.config_data).toHaveProperty("description");
      expect(entry.config_data).toHaveProperty("display_name");
      expect(entry.config_data).toHaveProperty("featured");
      expect(entry.config_data?.featured).toHaveProperty("primary");
      expect(entry.config_data?.featured).toHaveProperty("secondary");
      expect(entry.config_data?.featured.primary).toMatch(/.*_sample\.png/);
      expect(entry).toHaveProperty("files");
      expect(entry.files).toBeInstanceOf(Array);
      expect(entry.files?.length).toBeGreaterThanOrEqual(3);
      assert(entry.files);
      for (const file of entry.files) {
        expect(file).toHaveProperty("path");
        expect(file).toHaveProperty("download_url");
        if (file.path.includes(".pdf")) {
          expect(
            entry.files.find(
              (png) => png.path === `${file.path.split(".pdf")[0]}.png`
            )
          ).toBeDefined();
        }
      }
    }
  });
});
