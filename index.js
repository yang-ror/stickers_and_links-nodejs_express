// =============================================================================
//  index.js
//  project: Stickers and Notes
//  author: Zifan Yang
//  date created: 2020-10-11
//  last modified: 2021-01-15
// =============================================================================
import express from 'express';

// import notes from './public/json/notes.json';
// import links from './public/json/links.json';

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

const fs = require('fs');
const app = express();
const PORT = 80;

app.use(express.static('public'));

app.listen(PORT, () =>{
    console.log(`Your server os running on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

// =============================================================================
// Data are stored in json files, functions below create, edit and delete those data.
// =============================================================================
app.post('/newNote', jsonParser, (req, res) => {
    newNote(req.body.content, req.body.color);
    res.send('success');
});

app.post('/editNote', jsonParser, (req, res) => {
    editNote(req.body.id, req.body.newContent);
    res.send('success');
});

app.post('/deleteNote', jsonParser, (req, res) => {
    deleteNote(req.body.id);
    res.send('success');
});

app.post('/newLink', jsonParser, (req, res) => {
    newLink(req.body.url);
    res.send('success');
});

app.post('/editLink', jsonParser, (req, res) => {
    editLink(req.body.newName, req.body.id);
    res.send('success');
});

app.post('/deleteLink', jsonParser, (req, res) => {
    deleteLink(req.body.id);
    res.send('success');           
});

//write new note content to notes.json
function newNote(content, color){
    let rawdata = fs.readFileSync('./public/json/notes.json');
    let notes = JSON.parse(rawdata);

    var id = 0;
    if(notes.length != 0){
        id = notes[notes.length - 1].id + 1;
    }

    let newNote = {
        id: id,
        content: content,
        color: color
    };
    notes.push(newNote);

    let data = JSON.stringify(notes);
    fs.writeFileSync('./public/json/notes.json', data);
}

//edit note content in notes.json
function editNote(id, content){
    let rawdata = fs.readFileSync('./public/json/notes.json');
    let notes = JSON.parse(rawdata);

    let newNotes = [];

    for(let i = 0; i < notes.length; i++){
        if(notes[i].id != id){
            newNotes.push(notes[i]);
        }
        else{
            let newNote = {
                id: parseInt(id, 10),
                content: content,
                color: notes[i].color
            };
            newNotes.push(newNote);
        }
    }

    let data = JSON.stringify(newNotes);
    fs.writeFileSync('./public/json/notes.json', data);
}

//delete note content in notes.json
function deleteNote(id){
    let rawdata = fs.readFileSync('./public/json/notes.json');
    let notes = JSON.parse(rawdata);

    let newNotes = [];

    for(let i = 0; i < notes.length; i++){
        if(notes[i].id != id){
            newNotes.push(notes[i]);
        }
    }

    let data = JSON.stringify(newNotes);
    fs.writeFileSync('./public/json/notes.json', data);
}

//write new link content to links.json
function newLink(url){
    let rawdata = fs.readFileSync('./public/json/links.json');
    let links = JSON.parse(rawdata);

    let id = 0;

    if(links.length != 0){
        id = links[links.length - 1].id + 1;
    }

    let newLink = {
        id: id,
        url: url,
        name: url
    };

    links.push(newLink);

    let data = JSON.stringify(links);
    fs.writeFileSync('./public/json/links.json', data);
}

//edit link content in links.json
function editLink(name, id){
    let rawdata = fs.readFileSync('./public/json/links.json');
    let links = JSON.parse(rawdata);

    let newLinks = [];

    for(let i = 0; i < links.length; i++){
        if(links[i].id != id){
            newLinks.push(links[i]);
        }
        else{
            let newLink = {
                id: parseInt(id, 10),
                url: links[i].url,
                name: name
            };
            newLinks.push(newLink);
        }
    }

    let data = JSON.stringify(newLinks);
    fs.writeFileSync('./public/json/links.json', data);
}

//delete link content in links.json
function deleteLink(id){
    let rawdata = fs.readFileSync('./public/json/links.json');
    let links = JSON.parse(rawdata);

    let newLinks = [];

    for(let i = 0; i < links.length; i++){
        if(links[i].id != id){
            newLinks.push(links[i]);
        }
    }

    let data = JSON.stringify(newLinks);
    fs.writeFileSync('./public/json/links.json', data);
}