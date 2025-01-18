const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const writableStream = fs.createWriteStream(path.join(__dirname, "text.txt"));
stdout.write("Enter your message. If you want to exit press ctrl + c or type 'exit':\n");
stdin.on("data", (data) => {
    if (data.toString().trim().toLowerCase() == "exit") {
        console.log('You are exit with "exit". See you leter...');
        process.exit();
    } else {
        writableStream.write(data);
        stdout.write("Enter your message:\n"); 
    }    
});

process.on('SIGINT', () => {
  console.log('You are exit with ctrl + c. See you leter...');
  process.exit();
});       
       
   
    

