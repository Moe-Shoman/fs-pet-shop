'use strict';
const fs = require('fs');
const express = require('express');
const app = express();
const port = 8000;
const petsJSON = JSON.parse(fs.readFileSync('pets.json'));
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/pets', function (req, res) {
    res.send(petsJSON);
});
app.get('/pets/:id', function (req, res) {
  if(petsJSON[req.params.id]){
    res.send(petsJSON[req.params.id]);
  }else {
    res.sendStatus(404);
  }
});
app.post('/pets', function (req, res) {
  let name = req.body.name;
  let age = req.body.age;
  let kind = req.body.kind;
  if(name.length !== 0 && age.length !== 0 && kind.length !== 0) {
    petsJSON.push(req.body);
    fs.writeFileSync('./pets.json', petsJSON);
    res.send(req.body);
  }else {
    res.sendStatus(400);
  }
});
app.get('*', function(req, res){
  res.sendStatus(404);
});

module.exports = app;
