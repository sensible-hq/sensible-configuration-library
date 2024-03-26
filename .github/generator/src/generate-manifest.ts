#!/usr/bin/env -S npx ts-node -T

async function main() {
  console.log("Hello, World!");
}


main().catch((error) => {
  console.error(error);
  process.exit(1);
});