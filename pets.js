'use strict';

const fs = require('fs');
const path = require('path');
const petsPath = path.join(__dirname, 'pets.json');
const node = path.basename(process.argv[0]);
const file = path.basename(process.argv[1]);
const cmd = process.argv[2];
let ind = process.argv[3];
const parsedPets = JSON.parse(fs.readFileSync('pets.json'));

function makePet(age, kind, name) {
    let pet = {};
    pet.age = Number(age);
    pet.kind = kind;
    pet.name = name;
    return pet;
}
if (cmd === "read") {
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
} else if (cmd === "create") {
    fs.readFile(petsPath, 'utf8', function(err, data) {
        if (err) {
            throw err;
        }
        let pets = JSON.parse(data);
        let age = process.argv[3];
        let kind = process.argv[4];
        let name = process.argv[5];
        if (age && kind && name) {
            pets.push(makePet(age, kind, name));
            let petsJSON = JSON.stringify(pets);
            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
                console.log(makePet(age, kind, name));
            });
        } else {
            console.error(`Usage: ${node} ${file} create AGE KIND NAME`);
            process.exit(1);
        }
    })
} else if (cmd === "update") {
    let ind = process.argv[3];
    let age = process.argv[4];
    let kind = process.argv[5];
    let name = process.argv[6];
    if (ind && age && kind && name) {
        fs.readFile(petsPath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            let pets = JSON.parse(data);
            pets.splice(ind, 0, makePet(age, kind, name));
            let petsJSON = JSON.stringify(pets);
            fs.writeFile(petsPath, petsJSON, function(writeErr) {
                if (writeErr) {
                    throw writeErr;
                }
                console.log(pets[ind]);
            });
        });
    } else {
        console.error(`Usage: ${node} ${file} update INDEX AGE KIND NAME`);
        process.exit(1);
    }
} else if (cmd === "destroy") {
    let ind = process.argv[3];
    if (ind) {
        fs.readFile(petsPath, 'utf8', function(err, data) {
            if (err) {
                throw err;
            }
            let pets = JSON.parse(data);
            let destroyedPet = pets.splice(ind, 1);
            console.log(destroyedPet);
            let petsJSON = JSON.stringify(pets);
        });
        fs.writeFile(petsPath, petsJSON, function(writeErr) {
            if (writeErr) {
                throw writeErr;
            }
        });
    } else {
        console.error(`Usage: ${node} ${file} destroy INDEX`);
        process.exit(1);
    }
} else {
    console.error(`Usage: ${node} ${file} [read | create | update | destroy]`);
    process.exit(1);
}
