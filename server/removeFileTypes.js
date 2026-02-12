#!/usr/bin/env node

/*# Remove .json files
node server/removeFileTypes.js ./public .json

# Remove multiple file types
node server/removeFileTypes.js ./public .json .tmp .log

# Without the dot (also works)
node server/removeFileTypes.js ./src js css
*/
const fs = require('fs');
const path = require('path');

// Get arguments from command line
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('Usage: node removeFileTypes.js <folder> <extension1> [extension2] ...');
    console.log('Example: node removeFileTypes.js ./public .json .tmp');
    process.exit(1);
}

const folderPath = args[0];
const extensionsToRemove = args.slice(1).map(ext => {
    // Ensure extensions start with a dot
    return ext.startsWith('.') ? ext : '.' + ext;
});

console.log(`\nRemoving file types: ${extensionsToRemove.join(', ')}`);
console.log(`From folder: ${folderPath}\n`);

let removedCount = 0;
let errorCount = 0;

function removeFilesByType(dir) {
    try {
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                // Recursively process subfolders
                removeFilesByType(filePath);
            } else if (stat.isFile()) {
                const ext = path.extname(file);
                if (extensionsToRemove.includes(ext.toLowerCase())) {
                    try {
                        fs.unlinkSync(filePath);
                        console.log(`✓ Removed: ${filePath}`);
                        removedCount++;
                    } catch (err) {
                        console.error(`✗ Error removing ${filePath}: ${err.message}`);
                        errorCount++;
                    }
                }
            }
        });
    } catch (err) {
        console.error(`✗ Error reading directory ${dir}: ${err.message}`);
        errorCount++;
    }
}

// Validate folder exists
if (!fs.existsSync(folderPath)) {
    console.error(`✗ Folder not found: ${folderPath}`);
    process.exit(1);
}

// Run the removal
removeFilesByType(folderPath);

console.log(`\n📊 Summary:`);
console.log(`Removed: ${removedCount} files`);
if (errorCount > 0) {
    console.log(`Errors: ${errorCount}`);
}
console.log('Done!\n');
