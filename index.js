// =============================================================================
//  index.js
//  project: Stickers and Notes
//  author: Zifan Yang
//  date created: 2020-10-11
//  last modified: 2021-03-23
//  change log:
//      2021-03-23:
//          1. now using mongodb instead of read/write json file dict
// =============================================================================
import express from 'express';
var MongoClient = require('mongodb').MongoClient;

// import notes from './public/json/notes.json';
// import links from './public/json/links.json';

var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

// const fs = require('fs');
const app = express();
const PORT = 8000;

const database_url = "mongodb://localhost:27017/";

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

app.get('/links', jsonParser, (req, res) => {
    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stickers");
        dbo.collection("links").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
});

app.get('/notes', jsonParser, (req, res) => {
    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stickers");
        dbo.collection("notes").find({}).toArray(function(err, result) {
            if (err) throw err;
            res.send(result);
            db.close();
        });
    });
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
    // let rawdata = fs.readFileSync('./public/json/notes.json');
    // let notes = JSON.parse(rawdata);

    // var id = 0;
    // if(notes.length != 0){
    //     id = notes[notes.length - 1].id + 1;
    // }

    // let newNote = {
    //     id: id,
    //     content: content,
    //     color: color
    // };
    // notes.push(newNote);

    // let data = JSON.stringify(notes);
    // fs.writeFileSync('./public/json/notes.json', data);

    function setIDfornewNote(noteContent, noteColor){
        var id = 0;
        MongoClient.connect(database_url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("stickers");
            var sortMethod = { id: -1 };
            dbo.collection("notes").find({}).sort(sortMethod).limit(1).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                if(result.length != 0){
                    id = result[0].id+1;
                }
                insertToDatabase(id, noteContent, noteColor);
            });
        });
    }

    function insertToDatabase(id, noteContent, noteColor){
        MongoClient.connect(database_url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("stickers");
            var link = { id: id, content: noteContent, color: noteColor };
            dbo.collection("notes").insertOne(link, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
    }

    setIDfornewNote(content, color);
}

//edit note content in notes.json
function editNote(id, content){
    // let rawdata = fs.readFileSync('./public/json/notes.json');
    // let notes = JSON.parse(rawdata);

    // let newNotes = [];

    // for(let i = 0; i < notes.length; i++){
    //     if(notes[i].id != id){
    //         newNotes.push(notes[i]);
    //     }
    //     else{
    //         let newNote = {
    //             id: parseInt(id, 10),
    //             content: content,
    //             color: notes[i].color
    //         };
    //         newNotes.push(newNote);
    //     }
    // }

    // let data = JSON.stringify(newNotes);
    // fs.writeFileSync('./public/json/notes.json', data);

    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stickers");
        var queryBy = { id: parseInt(id) };
        var newData = { $set: { content: content } };
        dbo.collection("notes").updateOne(queryBy, newData, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
}

//delete note content in notes.json
function deleteNote(id){
    // let rawdata = fs.readFileSync('./public/json/notes.json');
    // let notes = JSON.parse(rawdata);

    // let newNotes = [];

    // for(let i = 0; i < notes.length; i++){
    //     if(notes[i].id != id){
    //         newNotes.push(notes[i]);
    //     }
    // }

    // let data = JSON.stringify(newNotes);
    // fs.writeFileSync('./public/json/notes.json', data);

    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("stickers");
        var QueryNoteById = { "id": parseInt(id) };

        dbo.collection("notes").deleteOne(QueryNoteById, function(err, obj) {
            if (err) throw err;
            db.close();
        });
    });
}

//write new link content to links.json
function newLink(url){
    // let rawdata = fs.readFileSync('./public/json/links.json');
    // let links = JSON.parse(rawdata);

    // let id = 0;

    // if(links.length != 0){
    //     id = links[links.length - 1].id + 1;
    // }

    // let newLink = {
    //     id: id,
    //     url: url,
    //     name: url
    // };

    // links.push(newLink);

    // let data = JSON.stringify(links);
    // fs.writeFileSync('./public/json/links.json', data);

    function setIDfornewLink(linkUrl){
        var id = 0;
        MongoClient.connect(database_url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("stickers");
            var sortMethod = { id: -1 };
            dbo.collection("links").find({}).sort(sortMethod).limit(1).toArray(function(err, result) {
                if (err) throw err;
                db.close();
                if(result.length != 0){
                    id = result[0].id+1;
                }
                insertToDatabase(id, linkUrl);
            });
        });
    }

    function insertToDatabase(id, linkUrl){
        MongoClient.connect(database_url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("stickers");
            var link = { id: id, url: linkUrl, name: linkUrl };
            dbo.collection("links").insertOne(link, function(err, res) {
                if (err) throw err;
                db.close();
            });
        });
    }

    setIDfornewLink(url);
}

//edit link content in links.json
function editLink(name, id){
    // let rawdata = fs.readFileSync('./public/json/links.json');
    // let links = JSON.parse(rawdata);

    // let newLinks = [];

    // for(let i = 0; i < links.length; i++){
    //     if(links[i].id != id){
    //         newLinks.push(links[i]);
    //     }
    //     else{
    //         let newLink = {
    //             id: parseInt(id, 10),
    //             url: links[i].url,
    //             name: name
    //         };
    //         newLinks.push(newLink);
    //     }
    // }

    // let data = JSON.stringify(newLinks);
    // fs.writeFileSync('./public/json/links.json', data);

    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("stickers");
        var queryBy = { id: parseInt(id) };
        var newData = { $set: { name: name } };
        dbo.collection("links").updateOne(queryBy, newData, function(err, res) {
            if (err) throw err;
            db.close();
        });
    });
}

//delete link content in links.json
function deleteLink(id){
    // let rawdata = fs.readFileSync('./public/json/links.json');
    // let links = JSON.parse(rawdata);

    // let newLinks = [];

    // for(let i = 0; i < links.length; i++){
    //     if(links[i].id != id){
    //         newLinks.push(links[i]);
    //     }
    // }

    // let data = JSON.stringify(newLinks);
    // fs.writeFileSync('./public/json/links.json', data);

    MongoClient.connect(database_url, function(err, db) {
        if (err) throw err;

        var dbo = db.db("stickers");
        var QueryLinkById = { "id": parseInt(id) };

        dbo.collection("links").deleteOne(QueryLinkById, function(err, obj) {
            if (err) throw err;
            db.close();
        });
    });
}