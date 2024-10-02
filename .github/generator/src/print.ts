import { createTemplateLibrary } from "./create-template-library";

async function main() {
  const result = await createTemplateLibrary();
  console.log(result);
}

main();
