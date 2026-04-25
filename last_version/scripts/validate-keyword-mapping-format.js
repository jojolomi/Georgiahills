const fs = require("fs");
const path = require("path");

const filePath = path.resolve(process.argv[2] || "seo/keyword-mapping.csv");
const expectedHeader = "page_path,language,primary_keyword,secondary_keywords,search_intent,priority,meta_title_example,meta_description_example";

if (!fs.existsSync(filePath)) {
  process.stderr.write(`✖ keyword mapping file not found: ${filePath}\n`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, "utf8").trim();
if (!content) {
  process.stderr.write(`✖ keyword mapping file is empty: ${filePath}\n`);
  process.exit(1);
}

const [header, ...rows] = content.split(/\r?\n/);
if (header.trim() !== expectedHeader) {
  process.stderr.write(`✖ invalid keyword mapping header\nExpected: ${expectedHeader}\nFound:    ${header.trim()}\n`);
  process.exit(1);
}

if (!rows.length) {
  process.stderr.write("✖ keyword mapping must include at least one row\n");
  process.exit(1);
}

process.stdout.write(`✔ keyword mapping format passed for ${rows.length} row(s)\n`);
