const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    const inCore = filePath.includes(path.join('modules', 'core', 'pages'));
    const inAsset = filePath.includes(path.join('modules', 'asset-management', 'pages'));
    const inShared = filePath.includes(path.join('modules', 'shared'));
    const inAssetAset = filePath.includes(path.join('modules', 'asset-management', 'pages', 'Aset'));
    const inCoreSub = filePath.includes(path.join('modules', 'core', 'pages', 'UserManagement')) || filePath.includes(path.join('modules', 'core', 'pages', 'RolePermission'));

    // Adjusting deep levels
    let up1 = '../';
    let up2 = '../../';
    let up3 = '../../../';

    if (inAssetAset || inCoreSub) {
        // they are at src/modules/*/pages/SubDir/ -> to reach src, they need ../../../../
        content = content.replace(/['"]\.\.\/\.\.\/services\/api['"]/g, "'../../../../services/api'");
        content = content.replace(/['"]\.\.\/\.\.\/components\/Layout['"]/g, "'../../../shared/components/Layout'");
        content = content.replace(/['"]\.\.\/\.\.\/components\/Header['"]/g, "'../../../shared/components/Header'");
        content = content.replace(/['"]\.\.\/\.\.\/components\/Sidebar['"]/g, "'../../../shared/components/Sidebar'");
        content = content.replace(/['"]\.\.\/\.\.\/context\/AuthContext['"]/g, "'../../../shared/context/AuthContext'");
    } else if (inCore || inAsset) {
        // they are at src/modules/*/pages/ -> to reach src, they need ../../../
        content = content.replace(/['"]\.\.\/services\/api['"]/g, "'../../../services/api'");
        content = content.replace(/['"]\.\.\/components\/Layout['"]/g, "'../../shared/components/Layout'");
        content = content.replace(/['"]\.\.\/components\/Header['"]/g, "'../../shared/components/Header'");
        content = content.replace(/['"]\.\.\/components\/Sidebar['"]/g, "'../../shared/components/Sidebar'");
        content = content.replace(/['"]\.\.\/context\/AuthContext['"]/g, "'../../shared/context/AuthContext'");
        content = content.replace(/['"]\.\.\/components\/QRScannerModal['"]/g, "'../components/QRScannerModal'"); // asset to asset
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated ' + filePath);
    }
}

function walkSync(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(function(file) {
        const filepath = path.join(dir, file);
        if (fs.statSync(filepath).isDirectory()) {
            walkSync(filepath);
        } else {
            if (filepath.endsWith('.jsx') || filepath.endsWith('.js')) {
                replaceInFile(filepath);
            }
        }
    });
}

walkSync(path.join(__dirname, 'frontend', 'src', 'modules'));
