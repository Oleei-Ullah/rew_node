import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const lib = {};
const dirname = path.dirname(fileURLToPath(import.meta.url));

lib.basedir = path.join(dirname, '/../.data/');

//write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        const stringData = JSON.stringify(data);
        if(!err && fileDescriptor) {
            fs.writeFile(fileDescriptor, stringData, (err) => {
                if(!err) {
                    fs.close(fileDescriptor, (err) => {
                        if(!err) {
                            callback(false)
                        } else {
                            callback('File isnot closed error-3')
                        }
                    })
                } else {
                    callback('Could not write on file error-2')
                }
            })
        }else {
            callback('File already exist so could make a new file')
        }
    })
}

//read data from file

lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data)
    })
}

//update data in the file

lib.update = (dir, file, data, callback) => {
    const stringData = JSON.stringify(data);
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            fs.ftruncate(fileDescriptor, (err) => {
                if(!err) {
                    fs.writeFile(fileDescriptor, stringData, (err) => {
                        if(!err) {
                            fs.close(fileDescriptor, (err, fileDescriptor) => {
                                if(!err) {
                                    callback(false)
                                } else {
                                    callback('Errror on closing the file')
                                }
                            })
                        } else {

                            callback('error on writing the file')
                        }
                    })
                } else {
                    callback('Error in erasing the data on the file')
                }
            })
        } else {
            callback(err)
        }
    })
}

//Delete file

lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if(!err) {
            callback(false)
        } else {
            callback(`Error on deleting file ${err}`)
        }
    })
}

export default lib;