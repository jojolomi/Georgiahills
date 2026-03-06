const fs = require('fs');
let code = fs.readFileSync('style.css', 'utf8');
code = code.replace('.footer-contact-item { display: flex; align-items: center; gap: 0.75rem; }', '.footer-contact-item { display: flex; align-items: flex-start; gap: 0.75rem; }');
fs.writeFileSync('style.css', code);
