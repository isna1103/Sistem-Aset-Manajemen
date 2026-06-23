const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    content = content.replace(/['"]\.\.\/\.\.\/\.\.\/shared\/database['"]/g, "'../../shared/database'");

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath);
        } else {
            if (filepath.endsWith('.js')) {
                replaceInFile(filepath);
            }
        }
    });
}

walk(path.join(__dirname, 'backend', 'src', 'modules', 'asset-management', 'controllers'));
