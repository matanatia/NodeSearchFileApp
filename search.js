const fs = require('fs');
const path = require('path');
const args = process.argv;

//search in the file the word sent by the user - return true or false 
function searchInFile(file, word) {
    //convert the file to string
    var file_str = fs.readFileSync(file , 'utf8');
    
    if (file_str.includes(word)) {
        return true;
    }
    
    return false;
    
}

//search in the dir the file that contain the word sent by the user - return true or false
function searchInDir(dirPath, fileExt, word) {
    var found = false;
    var subDirPath = [];

    //search in the dir
    fs.readdirSync(dirPath)
        .forEach(filename => {

            var ext = path.parse(filename).ext;
            var filePath = dirPath + '\\' + filename;

            //check only the files with the same ext the user send to the app
            if (ext == '.'+fileExt) {
                //if the file contain the word - print the path and change found to TRUE
                if (searchInFile( filePath , word)) {
                    found = true;
                    console.log( filePath + '\n');
                }
            }//else cheack if this is a sub directory
            else if (fs.lstatSync(filePath).isDirectory()) {
                //push its path to the subDirPath array
                subDirPath.push(filePath); 
            }

        });

    //search also in the sub diractorys if have any
    subDirPath.forEach(subDir => {
        var result = searchInDir(subDir, fileExt, word);
        //change a Flase to True if we found the word in the sub directory
        found = found || result;
    });

    return found;
}


function main(params) {
    //check  if the vars sent to the app is in the right format search.js [ext] [text]
    if (args.length != 4) {

        console.log('USAG: node search [EXT] [TEXT]\n');
    }
    else {// start searching in the directory  - if not found print alert
        if (!searchInDir(__dirname, args[2], args[3])) 
        { 
            console.log('\n No file was found \n');  
        }
    }
}


//start the app    
main();
