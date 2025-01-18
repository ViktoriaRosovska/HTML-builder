const fs = require('fs');
const path = require('path');

fs.readdir(path.join(__dirname, "secret-folder"),
    (error, files) => {
        console.log("\nSecret-folder files:");
        if (error)
            console.error(error.message);
        else {
            files.forEach(file => {
                
                fs.stat(path.join(__dirname, "secret-folder", `${file}`), (error, stats) => {
                    if (error) console.error(error.message);
                    if (stats.isDirectory()) return;
                    console.log(path.parse(file).name + " - " + path.parse(file).ext.slice(1) + " - " + stats.size / 1000 + "kb");
                });
    })
  }
});