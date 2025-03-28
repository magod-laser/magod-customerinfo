//const fs = require('fs');
const path = require('path');
const fs = require('fs').promises;

let folderBase = process.env.FOLDERBASE; // "C:/Magod/Jigani"

let checkdrawings = async (qtnNo, callback) => {
    qtnNo = qtnNo.replaceAll('/', '_');
    // await fs.exists(folderBase + `/QtnDwg/`+qtnNo, async (exists) => {
    //     callback(exists);
    // })
    let month = qtnNo.split("_")[1]
    let monthName = ["January", "Febraury", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"][parseInt(month) - 1]
    let startPath = folderBase + `/QtnDwg/` + monthName + "/" + qtnNo;
    let filter = '.dxf'
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        callback(false)
    }

    var files = fs.readdirSync(startPath);
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        if (filename.endsWith(filter)) {
            callback(true)
        };
    };
}

// let createFolder = async (SrlType, qno, newQno, month, callback) => {
let createFolder = async (SrlType, qno, dwgfolder, newQno, month, callback) => {
    console.log("Create Folder: ", SrlType, qno,dwgfolder, newQno, month);
    console.log(typeof (qno));
    try {

        // Check and convert path arguments to strings 
        const checkAndConvertToString = (arg, argName) => {
            if (typeof arg !== 'string') {
                console.log(`${argName} is not a string. Converting to string.`);
                return String(arg);
            } return arg;
        };
        folderBase = checkAndConvertToString(folderBase, 'folderBase');
        qno = checkAndConvertToString(qno, 'qno');
        newQno = checkAndConvertToString(newQno, 'newQno');
        month = checkAndConvertToString(month, 'month');
      
        switch (SrlType) {
            case "Quotation": {
                await fs.exists(folderBase + `/QtnDwg`, async (exists) => {
                    if (!exists) {
                        await fs.mkdirSync(folderBase + `/QtnDwg`)
                    }
                    await fs.exists(folderBase + `/QtnDwg/${month}`, async (ex) => {
                        if (!ex) {
                            await fs.mkdirSync(folderBase + `/QtnDwg/${month}`)
                        }
                        await fs.exists(folderBase + `/QtnDwg/${month}/${qno}`, async (exist) => {
                            if (!exist) {
                                await fs.mkdirSync(folderBase + `/QtnDwg/${month}/${qno}`)
                            }
                        })
                    })
                })
                break;
            }
            case "Order": {
                await fs.exists(folderBase + `/Wo`, async (exists) => {
                    if (!exists) {
                        await fs.mkdirSync(folderBase + `/Wo`)
                    }
                    await fs.exists(folderBase + `/Wo`, async (ex) => {
                        if (!ex) {
                            await fs.mkdirSync(folderBase + `/Wo/${qno}`)
                        }
                        //   await fs.mkdirSync(folderBase + `/Wo/${qno}`)
                    })
                })
                break;
            }
            case "Customer": {
                let custDwgPath = path.join(folderBase, 'CustDwg', qno);
              
                let exists = await folderExists(folderBase + '/CustDwg');
            
                if (!exists) {
                    await fs.mkdir(`${folderBase}/CustDwg`);
                }
                exists = await folderExists(custDwgPath);
    
                if (!exists) {
                    
                    let custdwg = path.join(folderBase, 'CustDwg', dwgfolder);

                   let custdwgexists = await folderExists(folderBase, '/CustDwg', dwgfolder);
               
                    if (custdwgexists) {
                        await fs.mkdir(custdwg, { recursive: true });
                        await fs.mkdir(path.join(custdwg, 'Accts'));
                        await fs.mkdir(path.join(custdwg, 'BOM'));
                        await fs.mkdir(path.join(custdwg, 'DWG'));
                        await fs.mkdir(path.join(custdwg, 'DXF'));
                        await fs.mkdir(path.join(custdwg, 'Material'));
                        await fs.mkdir(path.join(custdwg, 'Parts'));
                        await fs.mkdir(path.join(custdwg, 'Qtn'));
                        await fs.mkdir(path.join(custdwg, 'WOL'));
                        console.log("Created folder ");
                        callback(null, "success");
                 
                     }

                } else {
                    renameFolderIfExists(folderBase, qno, newQno, callback);
                    //  folderDelete(custDwgPath, callback);
                }

                break;
            }
            default: {
                callback("Invalid SrlType", null);
                break;
            }
        }
    } catch (error) {
        callback(error, null);
    }
}

let folderDelete = async (folderPath, callback) => {
    // Delete the old folder 
    try {
        fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
                console.error(`Error deleting ${folderPath}:`, err);
            } else {
                console.log(`${folderPath} deleted successfully.`);
            }
        });
    }
    catch (error) {
        callback(error, null);
    }
};


const folderExists = async (folderPath) => {
    try {
        await fs.access(folderPath);
        return true; // Folder exists 
    } catch (error) {
        return false; // Folder does not exist 
    }
};
//basePath = process.env.FILE_SERVER_PDF_PATH;
const renameFolderIfExists = async (basePath, oldName, newName, callback) => {
    try {
        let oldPath = path.join(basePath, 'CustDwg', oldName);
        let newPath = path.join(basePath, 'CustDwg', newName);
        let newExists = await folderExists(newPath);
        if (newExists) {
            //   callback("New folder name already exists", null); 
            return;
        }
        await fs.rename(oldPath, newPath);
        callback(null, "Folder renamed successfully");
    } catch (error) {
        callback(error, null);
    }
};

// const renameFolderIfExists = async (folderBase, oldQno, newQno, callback) => {
//     const oldFolderPath = path.join(folderBase, `/CustDwg/${oldQno}`);
//     const newFolderPath = path.join(folderBase, `/CustDwg/${newQno}`); // Check if the old folder exists 
//     if (fs.existsSync(oldFolderPath)) { // Check if the new folder already exists 
//         if (!fs.existsSync(newFolderPath)) { // Rename the folder await 
//             fs.renameSync(oldFolderPath, newFolderPath);
//             console.log(`Folder renamed to: ${newFolderPath}`);
//             callback(null, "success");
//         }
//         else {
//             callback("New folder already exists", null);
//         }
//     }
//     else {
//         callback("Old folder not found", null);
//     }
// };


const copyfiles = async (source, destination, callback) => {
    try {
        var files = fs.readdirSync(source);
        for (var i = 0; i < files.length; i++) {
            var filename = path.join(startPath, files[i]);
            if (filename.endsWith(".dxf")) {
                fs.copyFile(filename, destination);
            };
        };
        callback(null, true);
    } catch (error) {
        callback(error, null);
    }
}

const copyallfiles = async (DocType, source, destination) => {
    try {
        switch (DocType) {
            case "Customer": {
                let subfolders = ["Accts", "BOM", "DWG", "DXF", "Material", "Parts", "Qtn", "WOL"]
                let fromsource = folderBase + `/CustDwg/${source}`
                if (!fromsource.exists) {
                    break;
                }
                let todestination = folderBase + `/CustDwg/${destination}`
                for (let p = 0; p < subfolders.length; p++) {
                    console.log(fromsource + "/" + subfolders[p])
                    await fs.exists(fromsource + "/" + subfolders[p], async (exists) => {
                        if (exists) {
                            var srcfldr = fromsource + "/" + subfolders[p] + "/";
                            var dstfldr = todestination + "/" + subfolders[p] + "/";
                            var files = fs.readdirSync(srcfldr);
                            for (var i = 0; i < files.length; i++) {
                                var filename = path.join(srcfldr, files[i]);
                                if (filename) {
                                    fs.copyFile(filename, dstfldr);
                                }
                            };

                        }
                    })
                }
                fs.rmdir(fromsource, { recursive: true }, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
                break;
            }
            // case "Quotation": {
            // }
            // case "Order": {
            // }
            default:
                break;
        }
        // callback(null, true);
    } catch (error) {
        console.log(error);
        //  callback(error, null);
    }
}

// const removefiles = async (source, callback) => {
//     try {
//         var files = fs.readdirSync(source);
//         for (var i = 0; i < files.length; i++) {
//             var filename = path.join(startPath, files[i]);
//             if (filename.endsWith(".dxf")) {
//                 fs.rename()    .rmdir(filename);

//             };

const writetofile = async (qtnNo, filename, content, callback) => {
    fs.appendFile(folderBase + `/QtnDwg/${month}/${qtnNo}/${filename}`, content).then(res => {
        callback(null, res);
    }).catch(err => {
        callback(err, null);
    })
}
module.exports = { createFolder, checkdrawings, copyfiles, copyallfiles, writetofile };