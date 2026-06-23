const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Controllers -> they are now in core/* or asset-management/controllers
    // But controllers are mostly imported in routes. Let's fix routes later manually.

    // Middlewares
    content = content.replace(/['"]\.\.\/middlewares\//g, "'../shared/middleware/");
    content = content.replace(/['"]\.\.\/\.\.\/middlewares\//g, "'../../shared/middleware/");
    content = content.replace(/['"]\.\/middlewares\//g, "'./modules/shared/middleware/"); 
    
    // Database
    content = content.replace(/['"]\.\.\/models['"]/g, "'../shared/database'");
    content = content.replace(/['"]\.\.\/\.\.\/models['"]/g, "'../../shared/database'");
    content = content.replace(/['"]\.\/models['"]/g, "'./modules/shared/database'"); 

    // Models
    const assetModels = ['Aset', 'JadwalOpname', 'Kategori', 'LaporanKerusakan', 'Lokasi', 'Maintenance', 'Mutasi', 'Peminjaman', 'Penghapusan', 'StockOpname'];
    assetModels.forEach(m => {
        const regex1 = new RegExp(`['"]\\.\\.\\/models\\/${m}['"]`, 'g');
        content = content.replace(regex1, `'../../asset-management/models/${m}'`); // From core/* or asset-management/controllers it will be ../../
        const regex2 = new RegExp(`['"]\\.\\.\\/\\.\\.\\/models\\/${m}['"]`, 'g');
        content = content.replace(regex2, `'../../../asset-management/models/${m}'`);
    });

    const coreModels = {
        'User': 'users',
        'Role': 'roles',
        'Permission': 'permissions',
        'RolePermission': 'permissions'
    };
    for (const [m, folder] of Object.entries(coreModels)) {
        const regex1 = new RegExp(`['"]\\.\\.\\/models\\/${m}['"]`, 'g');
        content = content.replace(regex1, `'../../core/${folder}/${m}'`);
        const regex2 = new RegExp(`['"]\\.\\.\\/\\.\\.\\/models\\/${m}['"]`, 'g');
        content = content.replace(regex2, `'../../../core/${folder}/${m}'`);
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
            if (filepath.endsWith('.js')) {
                replaceInFile(filepath);
            }
        }
    });
}

walkSync(path.join(__dirname, 'backend', 'src'));
replaceInFile(path.join(__dirname, 'backend', 'server.js'));
