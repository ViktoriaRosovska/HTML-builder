const path = require("path");
const fs = require("fs");

async function mergeStyles(inputDir, outputFile){
    const bundleCssItems = await fs.promises.readdir(inputDir, { withFileTypes: true }, 'utf8');

    let first = true;
    for (const file of bundleCssItems) {
        if (path.extname(file.name) === ".css" && file.isFile()) {
            const readFile = await fs.promises.readFile(path.join(inputDir, `${file.name}`));
            if (first) {
                first = false;
                await fs.promises.writeFile(outputFile, readFile);
            }
            else {
                await fs.promises.appendFile(outputFile, readFile);
            }
        }
    }
}

mergeStyles(path.join(__dirname, "styles"), path.join(__dirname, "project-dist", "bundle.css"));