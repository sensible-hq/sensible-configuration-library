#!/usr/bin/env -S npx ts-node -T

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createHash } from "crypto";
import { createTemplateLibrary } from "./create-template-library";

const targets: Record<string, readonly string[]> = {
  "us-west-2": ["prod", "dev", "exp1"],
  "eu-west-2": ["prod"],
  "ca-central-1": ["prod"],
} as const;

async function uploadLibrary(library: string) {
  const ContentMD5 = createHash("md5").update(library).digest("base64");
  await Promise.all(
    Object.entries(targets).flatMap(async ([region, stages]) => {
      const s3 = new S3Client({ region });
      return stages.map(async (stage) =>
        s3.send(
          new PutObjectCommand({
            Bucket: `sensible-so-utility-bucket-${stage}-${region}`,
            Key: "CONFIG_LIBRARY/manifest_v3.json",
            Body: library,
            ContentMD5,
            ContentType: "application/json",
          }),
        ),
      );
    }),
  );
}

async function main() {
  const library = await createTemplateLibrary();
  await uploadLibrary(library);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
