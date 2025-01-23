const fs = require("fs");
const path = require("path");

async function copyDir(inputDir, outputDir) {
    try {
        
       await fs.promises.mkdir(outputDir, { recursive: true, force: true }, error => {
            if (error) throw error;
            console.log("New folder create succesful");
        });
       
        const copyItems = await fs.promises.readdir(inputDir, { withFileTypes: true });
        
        for (const file of copyItems) { 
            if (file.isDirectory()) {
                await copyDir(path.join(inputDir, file.name), path.join(outputDir, file.name));
            }
            else if (file.isFile()) {
                await fs.promises.copyFile(path.join(inputDir, file.name), path.join(outputDir, file.name));
            }
        }
    } catch (error) {
        console.log(error);
    }
}

copyDir(path.join(__dirname, "files"), path.join(__dirname, "files-copy"));
