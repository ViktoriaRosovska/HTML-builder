const fs = require("fs");
const path = require("path");

async function copyDir(inputDir, outputDir) {
    try {
        
        await fs.promises.mkdir(outputDir, { recursive: true, force: true });
       
        const copyItems = await fs.promises.readdir(inputDir, { withFileTypes: true });
        items = [];
        
        for (const file of copyItems) { 
             items.push(file.name);
            if (file.isDirectory()) {
                copyDir(path.join(inputDir, file.name), path.join(outputDir, file.name));
            }
             else if (file.isFile()) {
                await fs.promises.copyFile(path.join(inputDir, file.name), path.join(outputDir, file.name));
            }
        }
        const copyOutputItems = await fs.promises.readdir(outputDir, { withFileTypes: true });
        for (const file of copyOutputItems) { 
            if (!items.includes(file.name)) {
                await fs.promises.rm(path.join(outputDir, file.name), { recursive: true, force: true }, err => {
                    if (err) {
                        throw err;
                    }
                    console.log(`${path.join(outputDir, file.name)} is deleted!`);
                });
            }
        }
    } catch (error) {
        console.log(error);
    }
}

copyDir(path.join(__dirname, "files"), path.join(__dirname, "files-copy"));
