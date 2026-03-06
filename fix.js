const fs = require('fs');
let code = fs.readFileSync('shared-navbar.js', 'utf8');
code = code.replace(/document\.documentElement\.style\.setProperty\('--gh-nav-height', [^\)]+\);/, "document.documentElement.style.setProperty('--gh-nav-height', navHeight + 'px');");
fs.writeFileSync('shared-navbar.js', code);
