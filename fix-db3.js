const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, level) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    if (level === 2) {
        // From core/auth/authController.js, it needs ../../shared/database
        content = content.replace(/['"]\.\.\/shared\/database['"]/g, "'../../shared/database'");
        content = content.replace(/['"]\.\.\/\.\.\/shared\/database['"]/g, "'../../shared/database'");
    } else if (level === 3) {
        // From asset-management/controllers/asetController.js, it needs ../../../shared/database
        content = content.replace(/['"]\.\.\/shared\/database['"]/g, "'../../../shared/database'");
        content = content.replace(/['"]\.\.\/\.\.\/shared\/database['"]/g, "'../../../shared/database'");
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

function walk(dir, level) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, level);
        } else {
            if (filepath.endsWith('.js')) {
                replaceInFile(filepath, level);
            }
        }
    });
}

walk(path.join(__dirname, 'backend', 'src', 'modules', 'core'), 2);
walk(path.join(__dirname, 'backend', 'src', 'modules', 'asset-management', 'controllers'), 3);
