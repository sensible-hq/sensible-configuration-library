import assert from "assert";
import { createTemplateLibrary } from "./create-template-library";
import { Library, LibraryGroup } from "./types";

describe("createTemplateLibrary", () => {
  let templateLibrary: string;
  let parsedLibrary: Library;
  let library: Library["library"];

  beforeAll(async () => {
    templateLibrary = await createTemplateLibrary();
    parsedLibrary = JSON.parse(templateLibrary);
    library = parsedLibrary.library;
  });

  it("should create the library with a nested structure", () => {
    expect(parsedLibrary).toHaveProperty("baseUrl");

    expect(library).toHaveProperty("Financial Services");
    expect(library).toHaveProperty("Healthcare");
    expect(library).toHaveProperty("Human Resources");
    expect(library).toHaveProperty("Identification");
    expect(library).toHaveProperty("Insurance");
    expect(library).toHaveProperty("Logistics");
    expect(library).toHaveProperty("Real Estate");
    expect(library).toHaveProperty("Tax Forms");

    recursiveChildrenAssertions(library);
  });
});

function recursiveChildrenAssertions(children: LibraryGroup["children"]): void {
  const childKeys = Object.keys(children);
  for (const key of childKeys) {
    const child = children[key];
    expect(child).not.toBeUndefined();
    expect(child).toHaveProperty("thumbnails");
    expect(child?.thumbnails.length).toBeGreaterThanOrEqual(1);
    assert(child);

    if ("schema" in child) {
      expect(child).toHaveProperty("templates");
      expect(child.templates.length).toBeGreaterThanOrEqual(1);
      child.templates.forEach((template) => {
        expect(template).toHaveProperty("name");
        expect(template.name.length).toBeGreaterThanOrEqual(1);
        expect(template).toHaveProperty("refDocs");
        expect(template.refDocs).toBeInstanceOf(Array);
        expect(template.refDocs.length).toBeGreaterThanOrEqual(1);
      });
    } else if ("children" in child) {
      expect(Object.keys(child.children).length).toBeGreaterThanOrEqual(1);
      recursiveChildrenAssertions(child.children);
    }
  }
}
