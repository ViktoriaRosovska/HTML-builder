const path = require("path");
const fs = require("fs");


async function  mergeStyles(inputDir, outputFile){
    const bundleCssItems = await fs.promises.readdir(inputDir, { withFileTypes: true }, 'utf8');
    
    
    if (fs.existsSync(outputFile)) {
        fs.promises.rm(outputFile);
    };
    for (const file of bundleCssItems) {
         if (path.extname(file.name) === ".css" && file.isFile()) {
            const readFile = await fs.promises.readFile(path.join(inputDir, `${file.name}`));
            await fs.promises.appendFile(outputFile, readFile);
        }
    }
}

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


async function build(inputFile, ouputDir) {

    copyDir(path.join(__dirname, "assets"), path.join(ouputDir, "assets"));
    mergeStyles(path.join(__dirname, "styles"), path.join(ouputDir, "style.css"))

    await fs.promises.mkdir(ouputDir, { recursive: true, force: true });
    
    if (fs.existsSync(path.join(ouputDir, "index.html"))) {
        fs.promises.rm(path.join(ouputDir, "index.html"));
    };
     
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
