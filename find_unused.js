const fs = require('fs');
const path = require('path');

const getAllFiles = (dir, extn, files, result, regex) => {
    files = files || fs.readdirSync(dir);
    result = result || [];
    regex = regex || new RegExp(`\\${extn}$`);

    for (let i = 0; i < files.length; i++) {
        let file = path.join(dir, files[i]);
        if (fs.statSync(file).isDirectory() && !file.includes('node_modules') && !file.includes('.git') && !file.includes('dist')) {
            try {
                result = getAllFiles(file, extn, fs.readdirSync(file), result, regex);
            } catch (error) {
                continue;
            }
        } else {
            if (regex.test(file)) {
                result.push(file);
            }
        }
    }
    return result;
};

const allBackendJs = getAllFiles(path.join(__dirname, 'backend'), '.js');
const allFrontendJs = getAllFiles(path.join(__dirname, 'frontend', 'src'), '.(js|jsx)');

function findUnused(files, allFiles) {
    const unused = [];
    files.forEach(file => {
        const basename = path.basename(file, path.extname(file));
        if (basename === 'index' || basename === 'server' || basename === 'main' || basename === 'App') return; // Entry points

        // Check if basename is mentioned in ANY other file
        let isUsed = false;
        for (const checkFile of allFiles) {
            if (checkFile === file) continue;
            const content = fs.readFileSync(checkFile, 'utf8');
            if (content.includes(basename)) {
                isUsed = true;
                break;
            }
        }
        if (!isUsed) {
            unused.push(file);
        }
    });
    return unused;
}

console.log("Unused Backend Files:");
const unusedBackend = findUnused(allBackendJs, allBackendJs);
unusedBackend.forEach(f => console.log(f.replace(__dirname, '')));

console.log("\nUnused Frontend Files:");
const unusedFrontend = findUnused(allFrontendJs, allFrontendJs);
unusedFrontend.forEach(f => console.log(f.replace(__dirname, '')));

