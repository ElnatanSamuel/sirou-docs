import { getDocSections } from "./lib/docs-utils.js";

async function test() {
  const sections = await getDocSections();
  console.log(JSON.stringify(sections, null, 2));
}

test();
