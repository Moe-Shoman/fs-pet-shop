'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const port = 8000;
const path = require("path");
const petsPath = path.join(__dirname, 'pets.json');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

function nonEmptyObjKeys(obj) {
    return Object.values(obj).every(val => val.length !== 0);
}
app.get('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let parsedPets = JSON.parse(data);
        res.send(parsedPets);
    });
});
app.get('/pets/:id', function(req, res) {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let parsedPets = JSON.parse(data);
        if (parsedPets[req.params.id]) {
            res.send(parsedPets[req.params.id]);
        } else {
            res.sendStatus(404);
        }
    });
});

app.post('/pets', function(req, res) {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let parsedPets = JSON.parse(data);
        let petObj = req.body;
        if (nonEmptyObjKeys(petObj)) {
            parsedPets.push(req.body);
            let petsJSON = JSON.stringify(parsedPets);
            fs.writeFile('./pets.json', petsJSON, (err) => {
                if (err) {
                    throw err;
                }
                res.send(req.body);
            });
        } else {
            res.sendStatus(400);
        }
    });
});

app.patch("/pets/:id", (req, res) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let parsedPets = JSON.parse(data);
        let petObj = req.body;
        if (!isNaN(petObj.age) && nonEmptyObjKeys(petObj) && Object.values(petObj).length === 3) {
            parsedPets.splice(req.params.id, 0, petObj);
        } else {
            Object.keys(petObj).forEach(key => {
                parsedPets[req.params.id][key] = petObj[key];
            })
        }
        let petsJSON = JSON.stringify(parsedPets);
        fs.writeFile('./pets.json', petsJSON, (err) => {
            if (err) {
                throw err;
            }
            res.send(parsedPets[req.params.id]);
        })
    });
});

app.delete("/pets/:id", (req, res) => {
    fs.readFile(petsPath, 'utf8', (err, data) => {
        if (err) {
            throw err;
        }
        let parsedPets = JSON.parse(data);
        let slicedPet;
        if (parsedPets[req.params.id]) {
            slicedPet = parsedPets.splice(req.params.id, 1);
        } else {
            res.sendStatus(404);
        }
        let petsJSON = JSON.stringify(parsedPets);
        fs.writeFile("./pets.json", petsJSON, (err) => {
            if (err) {
                throw err;
            }
            res.send(slicedPet[0]);
        })
    })
});
app.get('*', function(req, res) {
    res.sendStatus(404);
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});

module.exports = app;
