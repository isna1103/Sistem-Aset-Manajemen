const fs = require('fs');
const path = require('path');

function fixModelDbPath(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/['"]\.\.\/config\/database['"]/g, "'../../../../config/database'");
    fs.writeFileSync(filePath, content, 'utf8');
}

function walkModels(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkModels(filepath);
        } else {
            if (filepath.endsWith('.js')) {
                fixModelDbPath(filepath);
            }
        }
    });
}

walkModels(path.join(__dirname, 'backend', 'src', 'modules', 'core'));
walkModels(path.join(__dirname, 'backend', 'src', 'modules', 'asset-management', 'models'));
