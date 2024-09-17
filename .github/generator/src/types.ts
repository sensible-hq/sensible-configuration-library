export type Library = {
  baseUrl: string;
  library: LibraryGroup["children"];
};

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
};

export type LibraryTemplate = {
  name: string;
  refDocs: string[];
};
