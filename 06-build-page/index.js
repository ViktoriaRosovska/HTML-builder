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

async function build(inputFile, ouputDir) {

    copyDir(path.join(__dirname, "assets"), path.join(ouputDir, "assets"));
    mergeStyles(path.join(__dirname, "styles"), path.join(ouputDir, "style.css"))

    await fs.promises.mkdir(ouputDir, { recursive: true, force: true });

    let template = (await fs.promises.readFile(inputFile)).toString();

    const componentsItems = await fs.promises.readdir(path.join(__dirname, "components"), { withFileTypes: true }, 'utf8');
    
    for (const file of componentsItems) {
        if (path.extname(file.name) === ".html" && file.isFile()) {
            const templateTag = file.name.split(".")[0];
            const tempFile = await fs.promises.readFile(path.join(__dirname, "components", file.name))
            
            template = template.replace(`{{${templateTag}}}`, tempFile.toString());
            
        } else throw new Error(`Invalid template file ${file.name}. File must have ".html" extension`);
    }
    await fs.promises.writeFile(path.join(ouputDir, "index.html"), template);
}

build(path.join(__dirname, "template.html"), path.join(__dirname, "project-dist"));
