const fs = require('fs');
let code = fs.readFileSync('shared-footer.js', 'utf8');

if (!code.includes('function toRootPath')) {
    const rootPathStr = "function toRootPath(path) { if (!path || path.startsWith('/') || path.startsWith('#') || path.startsWith('javascript:')) { return path; } if (/^https?:\\/\\//i.test(path)) { return path; } return '/' + path; }\n";
    code = code.replace('function getConfig(isArabic)', rootPathStr + '  function getConfig(isArabic)');
}

code = code.replace(/homeLink:\s*isArabic\s*\?\s*'arabic\.html'\s*:\s*'index\.html',/g, "homeLink: toRootPath(isArabic ? 'arabic.html' : 'index.html'),");
code = code.replace(/bookLink:\s*isArabic\s*\?\s*'booking-ar\.html'\s*:\s*'booking\.html',/g, "bookLink: toRootPath(isArabic ? 'booking-ar.html' : 'booking.html'),");
code = code.replace(/legalLink:\s*'legal\.html',/g, "legalLink: toRootPath('legal.html'),");

fs.writeFileSync('shared-footer.js', code);
