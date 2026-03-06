const fs = require("fs");
const path = require("path");

const distDir = path.resolve(process.argv[2] || "apps/web/dist");

if (!fs.existsSync(distDir)) {
  process.stderr.write(`✖ dist directory not found: ${distDir}\n`);
  process.exit(1);
}

// Accept both Next-style and legacy filenames during migration.
const targetPages = [
  {
    label: "en",
    candidates: ["en.html", "index.html"],
    requiredGroups: [
      ["/privacy", "legal.html", "privacyModal"],
      ["/terms", "legal.html", "Terms of Service"]
    ]
  },
  {
    label: "ar",
    candidates: ["ar.html", "arabic.html"],
    requiredGroups: [
      ["/privacy", "legal.html", "privacyModal", "سياسة الخصوصية"]
    ]
  },
  {
    label: "booking",
    candidates: ["booking.html"],
    requiredGroups: [
      ["/privacy"],
      ["/terms"],
      ["/cancellation"],
      ["/insurance"],
      ["/licensing"]
    ]
  }
];

let passed = true;

for (const target of targetPages) {
  const found = target.candidates.find((candidate) =>
    fs.existsSync(path.join(distDir, candidate))
  );

  if (!found) {
    process.stderr.write(`✖ missing page: ${target.candidates[0]}\n`);
    passed = false;
    continue;
  }

  const file = found;
  const full = path.join(distDir, file);

  const html = fs.readFileSync(full, "utf8");

  // Since we inject the footer dynamically via shared-footer.js, we also check that file
  // if the script is included in the html.
  let contentToCheck = html;
  if (html.includes("shared-footer.js")) {
    const sharedFooterPath = path.join(distDir, "shared-footer.js");
    if (fs.existsSync(sharedFooterPath)) {
      contentToCheck += fs.readFileSync(sharedFooterPath, "utf8");
    } else {
      const rootSharedFooterPath = path.join(path.dirname(distDir), "..", "..", "shared-footer.js");
      if(fs.existsSync(rootSharedFooterPath)){
        contentToCheck += fs.readFileSync(rootSharedFooterPath, "utf8");
      }
    }
  }

  for (const tokenGroup of target.requiredGroups) {
    const hasAnyToken = tokenGroup.some((token) => contentToCheck.includes(token));
    if (!hasAnyToken) {
      process.stderr.write(
        `✖ ${file}: missing legal link token (expected one of: ${tokenGroup.join(", ")})\n`
      );
      passed = false;
    }
  }
}

if (!passed) process.exit(1);
process.stdout.write("✔ legal link presence check passed\n");
