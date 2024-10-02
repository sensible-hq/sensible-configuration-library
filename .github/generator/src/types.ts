// extended json-logic RulesLogic
export type RulesLogic =
  | boolean
  | string
  | number

  // AccessingData
  | { var: RulesLogic | [RulesLogic] | [RulesLogic, unknown] }
  | { missing: RulesLogic | unknown[] }
  | { missing_some: [RulesLogic, RulesLogic | unknown[]] }

  // LogicBooleanOperations
  | { if: [unknown, unknown, unknown, ...unknown[]] }
  | { "==": [unknown, unknown] }
  | { "===": [unknown, unknown] }
  | { "!=": [unknown, unknown] }
  | { "!==": [unknown, unknown] }
  | { "!": unknown }
  | { "!!": unknown }
  | { or: RulesLogic[] }
  | { and: RulesLogic[] }

  // NumericOperations
  | { ">": [RulesLogic, RulesLogic] }
  | { ">=": [RulesLogic, RulesLogic] }
  | { "<": [RulesLogic, RulesLogic] | [RulesLogic, RulesLogic, RulesLogic] }
  | { "<=": [RulesLogic, RulesLogic] | [RulesLogic, RulesLogic, RulesLogic] }
  | { max: RulesLogic[] }
  | { min: RulesLogic[] }
  | { "+": RulesLogic[] | RulesLogic }
  | { "-": RulesLogic[] | RulesLogic }
  | { "*": RulesLogic[] | RulesLogic }
  | { "/": RulesLogic[] | RulesLogic }
  | { "%": [RulesLogic, RulesLogic] }

  // ArrayOperations
  | { map: [RulesLogic, RulesLogic] }
  | { filter: [RulesLogic, RulesLogic] }
  | { reduce: [RulesLogic, RulesLogic, RulesLogic] }
  | { all: [RulesLogic[], RulesLogic] | [RulesLogic, RulesLogic] }
  | { none: [RulesLogic[], RulesLogic] | [RulesLogic, RulesLogic] }
  | { some: [RulesLogic[], RulesLogic] | [RulesLogic, RulesLogic] }
  | { merge: Array<RulesLogic[] | RulesLogic> }
  | { in: [RulesLogic, RulesLogic[]] }

  // StringOperations
  | { in: [RulesLogic, RulesLogic] }
  | { cat: RulesLogic[] }
  | { substr: [RulesLogic, RulesLogic] | [RulesLogic, RulesLogic, RulesLogic] }

  // MiscOperations
  | { log: RulesLogic }

  // Sensible operations
  | { match: [RulesLogic, string] }
  | { exists: [RulesLogic] }
  | { replace: ReplaceConfig };

export type ReplaceConfig = {
  source: RulesLogic;
  replace: RulesLogic;
} & (
  | {
      find_regex: string;
      flags?: string;
    }
  | { find: RulesLogic }
);

export interface DocumentValidation {
  description: string;
  condition: RulesLogic;
  severity?: "warning" | "error";
  scope?: string[];
  fields?: string[];
  needs_review?: true;
}

export type OcrEngineType =
  | "amazon"
  | "google"
  | "lazarus"
  | "microsoft"
  | "pdf";

export type OCRLevel = 0 | 2 | 4 | 5 | 6;

export type ReviewTriggers = {
  coverage_threshold?: number;
  validation_errors_threshold?: number;
  validation_warnings_threshold?: number;
  selected_validations?: true;
};

export type OutputSchema = {
  ocr_engine?: OcrEngineType;
  ocr_level?: OCRLevel; // Default 2
  fingerprint_mode?: "strict" | "fallback_to_all"; // Default fallback_to_all
  validations?: DocumentValidation[];
  prevent_default_merge_lines?: boolean;
  review_triggers?: ReviewTriggers;
  description?: string;
};

export type Library = {
  baseUrl: string;
  library: Record<string, LibraryGroup>;
};

export type LibraryGroup = {
  children: Record<string, LibraryGroup | LibraryDocType>;
  thumbnails: string[];
};

export type LibraryDocType = {
  schema?: OutputSchema;
  templates: LibraryTemplate[];
  thumbnails: string[];
};

export type LibraryTemplate = {
  name: string;
  refDocs: string[];
};
