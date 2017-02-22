'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
let ind = process.argv[3];
if (cmd === 'read') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(data);
        if (pets[ind]) {
            console.log(pets[ind]);
            // process.exit(1);
        } else if (ind) {
            console.log('Usage: node pets.js read INDEX');
            process.exit(1);
        } else {
            console.log(pets);
            // process.exit(1);
        }
    });
} else if (cmd === 'create') {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(data);
        let age = process.argv[3];
        let kind = process.argv[4];
        let name = process.argv[5];
        let pet;
        if (age && kind && name) {
            pet = {
                age: Number(age),
                kind: kind,
                name: name
            };
            pets.push(pet);
            let petsJSON = JSON.stringify(pets);
            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
                console.log(pet);
            });
        } else {
            console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
            process.exit(1);
        }
    })
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
