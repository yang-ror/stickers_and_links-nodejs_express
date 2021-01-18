// =============================================================================
//  javascript.js
//  project: Stickers and Notes
//  author: Zifan Yang
//  date created: 2020-10-11
//  last modified: 2021-01-15
// =============================================================================
var newNoteColor = "yellow";
var notes = [];
var links = [];

$( document ).ready(function() {
    //do not cache data as it may change frequently
    $.ajaxSetup({cache: false,});
    addListener();
    loadNotes();
    loadLinks();
});

//add click listener to new note color buttons and add link/note buttons
function addListener(){
    $("#new-note-color-yellow-btn").click(function(event){
        $("#newNote").removeClass();
        $("#newNote").addClass("stickers note-color-yellow");
        $("#add-note-btn").removeClass();
        $("#add-note-btn").addClass("note-color-green apply-shadow");
        $(".color-buttons").removeClass("color-buttons-selected");
        $("#new-note-color-yellow-btn").addClass("color-buttons-selected");
        newNoteColor = "yellow";
    });

    $("#new-note-color-green-btn").click(function(event){
        $("#newNote").removeClass();
        $("#newNote").addClass("stickers note-color-green");
        $("#add-note-btn").removeClass();
        $("#add-note-btn").addClass("note-color-blue apply-shadow");
        $(".color-buttons").removeClass("color-buttons-selected");
        $("#new-note-color-green-btn").addClass("color-buttons-selected");
        newNoteColor = "green";
    });

    $("#new-note-color-blue-btn").click(function(event){
        $("#newNote").removeClass();
        $("#newNote").addClass("stickers note-color-blue");
        $("#add-note-btn").removeClass();
        $("#add-note-btn").addClass("note-color-red apply-shadow");
        $(".color-buttons").removeClass("color-buttons-selected");
        $("#new-note-color-blue-btn").addClass("color-buttons-selected");
        newNoteColor = "blue";
    });

    $("#new-note-color-red-btn").click(function(event){
        $("#newNote").removeClass();
        $("#newNote").addClass("stickers note-color-red");
        $("#add-note-btn").removeClass();
        $("#add-note-btn").addClass("note-color-blue apply-shadow");
        $(".color-buttons").removeClass("color-buttons-selected");
        $("#new-note-color-red-btn").addClass("color-buttons-selected");
        newNoteColor = "red";
    });

    $("#new-note-color-purple-btn").click(function(event){
        $("#newNote").removeClass();
        $("#newNote").addClass("stickers note-color-purple");
        $("#add-note-btn").removeClass();
        $("#add-note-btn").addClass("note-color-green apply-shadow");
        $(".color-buttons").removeClass("color-buttons-selected");
        $("#new-note-color-purple-btn").addClass("color-buttons-selected");
        newNoteColor = "purple";
    });

    $("#add-note-btn").click(function(event){
        var newNoteText = $("#new-note-input").val();
        if(newNoteText !== ""){
            newNote(newNoteText, newNoteColor);
        }
    });

    $("#add-link-btn-holder").click(function(event){
        var url = $("#new-link-input").val();
        if(url !== ""){
            newLink(url);
        }
    });
}

//send a post request with note content to backend to create new note
function newNote(content, color){
    var data = {};
    data.content = content;
    data.color = color;
    $.ajax({
        type: "POST",
        url: "./newNote",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            $("#new-note-input").val("");
            if(notes.length == 0){
                loadNotes();
            }
            else{
                playNewNoteAnimation();
            }
        }
    });
}

//Animation: push existed note backward and make the new note appear
function playNewNoteAnimation(){
    let invisibleNote = $("<div id = 'invisible-note' class = 'existed-note invisible-stickers'></div>");
    $("#stickers-panel").append(invisibleNote);

    for(let i = 0; i < notes.length; i++){
        let note = notes[i];
        let noteDiv = $('#' + note.id + '-note');
        let notePosition = noteDiv.position();
        let nextNoteId;
        let nextNotePosition;
        if(i == 0){
            nextNotePosition = invisibleNote.position();
        }
        else{
            nextNoteId = notes[i-1].id;
            nextNotePosition = $("#" + nextNoteId +'-note').position();
        }

        let zIndex = notePosition.top - nextNotePosition.top == 0 ? 1 : 2;
        noteDiv.css('z-index', zIndex);

        noteDiv.animate({
            top: '-=' + (notePosition.top - nextNotePosition.top), 
            left: '-=' + (notePosition.left - nextNotePosition.left)
        });
    }

    setTimeout(function(){
        loadNotes();
    }, 500);
}

//send a post request with link url to backend to create new link
function newLink(url){
    var data = {};
    data.url = url;
    $.ajax({
        type: "POST",
        url: "./newLink",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            $("#new-link-input").val('');
            playNewLinkAnimation();
        }
    });
}

//Animation: push existed link down and make the new link appear
function playNewLinkAnimation(){
    if(links.length > 0){
        $('.existed-links').animate({top: "+=60"}, function(){
            loadLinks();
        });
    }
    else{
        loadLinks();
    }
}

//load note data from notes.json
function loadNotes(){
    $.ajax({
        dataType: 'json',
        url: 'json/notes.json',
        error: function (e){
            alert("An error occurred while load json");
            console.log("json reading Failed: ", e);
        },
        success: function(data){
            notes = [];
            if(data.length > 0){
                for(var note of data){
                    let content;
                    content = note.content.replaceAll('\n', '<br>');
                    notes.push({
                        'id': note.id,
                        'content': content,
                        'color': note.color
                    });
                }
            }
        },
        complete: function(){
            displayNotes();
            addNoteListener();
        }
    });
}

//load link data from links.json
function loadLinks(){
    $.ajax({
        dataType: 'json',
        url: 'json/links.json',
        error: function (e){
            alert("An error occurred while load json");
            console.log("json reading Failed: ", e);
        },
        success: function(data){
            links = [];
            if(data.length > 0){
                for(var link of data){
                    links.push({
                        'id': link.id,
                        'url': link.url,
                        'name': link.name
                    });
                }
            }
        },
        complete: function(){
            displayLinks();
            addLinkListener();
        }
    });
}

//construct note card and display
function displayNotes(){
    $(".existed-note").remove();
    if(notes.length > 0){
        for(let i = notes.length - 1; i >= 0; i--){
            let note = notes[i];
            let newNoteDiv = $("<div id = '" + note.id + "-note' class = 'existed-note stickers note-color-" + note.color + "'></div>");
            newNoteDiv.append("<div class = 'note-content-div'><p class = 'note-content'>" + note.content + "</p></div>");
            
            // let colorBtnDiv = $('<div style = "display:none" id ="'+ note.id +'-color-btns-div" class = "color-buttons-div"></div>');
            
            // colorBtnDiv.append('<button id = "'+ note.id +'-note-color-yellow-btn" class = "color-buttons apply-shadow note-color-yellow"></button>');
            // colorBtnDiv.append('<button id = "'+ note.id +'-note-color-green-btn" class = "color-buttons apply-shadow note-color-green"></button>');
            // colorBtnDiv.append('<button id = "'+ note.id +'-note-color-blue-btn" class = "color-buttons apply-shadow note-color-blue"></button>');
            // colorBtnDiv.append('<button id = "'+ note.id +'-note-color-red-btn" class = "color-buttons apply-shadow note-color-red"></button>');
            // colorBtnDiv.append('<button id = "'+ note.id +'-note-color-purple-btn" class = "color-buttons apply-shadow note-color-purple"></button>');
            
            // newNoteDiv.append(colorBtnDiv);

            newNoteDiv.append("<div id = '" + note.id + "-note-btn-holder' class = 'note-btn-holder'>" + 

            "<button id = '" + note.id + "-note-save-btn' class = 'save-note-btns note-btns apply-shadow' style = 'display: none'>" +
                '<span id = "' + note.id + '-save-note-icon" class="ui-icon ui-icon-check"></span>' + 
            "</button>" + 

            "<button id = '" + note.id + "-note-edit-btn' class = 'edit-note-btns note-btns apply-shadow'>" +
                '<span id = "' + note.id + '-edit-note-icon" class="ui-icon ui-icon-pencil"></span>' + 
            "</button>" + 

            "<button id = '" + note.id + "-note-cancel-btn' class = 'cancel-note-btns note-btns apply-shadow' style = 'display: none'>" + 
                '<span id = "' + note.id + '-cancel-note-icon" class="ui-icon ui-icon-cancel"></span>' +
            "</button>" + 

            "<button id = '" + note.id + "-note-delete-btn' class = 'delete-note-btns note-btns apply-shadow'>" + 
                '<span id = "' + note.id + '-delete-note-icon" class="ui-icon ui-icon-trash"></span>' + 
            "</button>" + 
            
            "</div>");

            $("#stickers-panel").append(newNoteDiv);
        }
    }
}

//add listener to buttons on note cards
function addNoteListener(){
    $(".note-btns").click(function(event){
        let element = event.target.id;
        let indexOfDash = element.indexOf('-');
        let id = element.substring(0, indexOfDash);

        if(element.includes("edit")){
            editNote(id);
        }
        else if(element.includes("save")){
            saveNote(id);
        }
        else if(element.includes("cancel")){
            cancelEditNote(id);
        }
        else if(element.includes("delete")){
            deleteNote(id);
        }
    });
}

function getNoteColorById(id){
    for(var note of notes){
        if(id == note.id){
            return note.color;
        }
    }
}

function getNoteContentById(id){
    for(var note of notes){
        if(id == note.id){
            return note.content;
        }
    }
}

//begin note editing by change <p> to <textarea>
function editNote(id){
    $("#" + id + "-note-edit-btn").hide();
    $("#" + id + "-note-save-btn").show();

    $("#" + id + "-note-delete-btn").hide();
    $("#" + id + "-note-cancel-btn").show();

    let contentDiv = $("#" + id + "-note").find(".note-content-div");
    contentDiv.empty();

    contentDiv.append('<textarea id = "' + id + '-note-input" class = "note-input" name="note-input">' + getNoteContentById(id) + '</textarea>');
    $("#" + id + "-note-input").focus();

    $("#" + id + "-color-btns-div").show(100);
}

//obtain note content from <textarea>
function saveNote(id){
    $("#" + id + "-color-btns-div").hide(100);
    let newContent = $("#" + id + "-note-input").val();
    if(getNoteContentById(id) != newContent){
        saveEditNote(id, newContent);
    }
    else{
        cancelEditNote(id);
    }
}

//edit note content by sending new note content and the id to backend
function saveEditNote(id, newContent){
    var data = {};
    data.id = id;
    data.newContent = newContent;
    $.ajax({
        type: "POST",
        url: "./editNote",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            loadNotes();
        }
    });
}

//cancel editing note by change <textarea> back to <p>
function cancelEditNote(id){
    $("#" + id + "-note-save-btn").hide();
    $("#" + id + "-note-edit-btn").show();
    
    $("#" + id + "-note-cancel-btn").hide();
    $("#" + id + "-note-delete-btn").show();

    $("#" + id + "-color-btns-div").hide(100);
    
    let contentDiv = $("#" + id + "-note").find(".note-content-div");
    contentDiv.empty();
    contentDiv.append("<p class = 'note-content'>" + getNoteContentById(id) + "</p>");
}

//delete note by sending its id to backend
function deleteNote(id){
    var data = {};
    data.id = id;
    $.ajax({
        type: "POST",
        url: "./deleteNote",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            playDeleteNoteAnimation(id);
        }
    });
}

//animation: hide a note card and pull back any existing note card after current note
function playDeleteNoteAnimation(id){
    $("#" + id +'-note').fadeTo(500, 0.01, function(){
        if(notes.length > 1 && id != notes[0].id){
            for(let i = 0; i < notes.length; i++){
                let note = notes[i];
                let noteDiv = $('#' + note.id + '-note');
                let notePosition = noteDiv.position();
                let previousNoteId = notes[i+1].id;
                let previousNotePosition = $("#" + previousNoteId +'-note').position();

                let zIndex = notePosition.top - previousNotePosition.top == 0 ? 1 : 2;
                noteDiv.css('z-index', zIndex);

                noteDiv.animate({
                    top: '-=' + (notePosition.top - previousNotePosition.top), 
                    left: '-=' + (notePosition.left - previousNotePosition.left)
                });

                if(previousNoteId == id){
                    break;
                }
            }
            setTimeout(function(){
                loadNotes();
            }, 500);
        }
    });
}

//construct link cards
function displayLinks(){
    $(".existed-links").remove();
    if(links.length > 0){
        for(let i = links.length - 1; i >= 0; i--){
            let link = links[i];
            let newLinkDiv = $("<div id = '" + link.id + "-link' class = 'existed-links links'></div>");
            newLinkDiv.append("<div class = 'link-content-div'><a class = 'link-label' href = '" + link.url + "'>" + link.name + "</a></div>");
            
            newLinkDiv.append("<div id = '" + link.id + "-link-btn-holder' class = 'link-btn-holder'>" + 

                '<div id = "' + link.id + '-save-link-btn-holder" class = "upper-link-btns-holder sub-link-btns-holder" style = "display: none">' +
                    "<button id = '" + link.id + "-link-save-btn' class = 'link-btns'>" + 
                        '<span id = "' + link.id + '-save-link-icon" class="ui-icon ui-icon-check"></span>' + 
                    "</button>" + 
                "</div>" +

                '<div id = "' + link.id + '-edit-link-btn-holder" class = "upper-link-btns-holder sub-link-btns-holder">' +
                    "<button id = '" + link.id + "-link-edit-btn' class = 'link-btns'>" +
                        '<span id = "' + link.id + '-edit-link-icon" class="ui-icon ui-icon-pencil"></span>' +
                    "</button>" + 
                "</div>" +

                '<div id = "' + link.id + '-cancel-link-btn-holder" class = "lower-link-btns-holder sub-link-btns-holder" style = "display: none">' +
                    "<button id = '" + link.id + "-link-cancel-btn' class = 'link-btns'>" +
                        '<span id = "' + link.id + '-cancel-link-icon" class="ui-icon ui-icon-cancel"></span>' +
                    "</button>" +
                "</div>" +
                
                '<div id = "' + link.id + '-delete-link-btn-holder" class = "lower-link-btns-holder sub-link-btns-holder">' +
                    "<button id = '" + link.id + "-link-delete-btn' class = 'link-btns'>" +
                        '<span id = "' + link.id + '-delete-link-icon" class="ui-icon ui-icon-trash"></span>' + 
                    "</button>" + 
                "</div>" +
            
            "</div>");
            
            $("#links-panel").append(newLinkDiv);
        }
    }
}

//add listeners to buttons on link cards
function addLinkListener(){
    $(".sub-link-btns-holder").click(function(event){
        let element = event.target.id;
        let indexOfDash = element.indexOf('-');
        let id = element.substring(0, indexOfDash);

        if(element.includes("edit")){
            editLink(id);
        }
        else if(element.includes("save")){
            saveLink(id);
        }
        else if(element.includes("cancel")){
            cancelEditLink(id);
        }
        else if(element.includes("delete")){
            deleteLink(id);
        }
    });
}

function getLinkUrlById(id){
    for(var link of links){
        if(link.id == id){
            return link.url;
        }
    }
}

function getLinkNameById(id){
    for(var link of links){
        if(link.id == id){
            return link.name;
        }
    }
}

//begin edit link by change <a> to <input>
//This only change the name of the link instead of the url, url cannot be changed once added.
function editLink(id){
    $("#" + id + "-edit-link-btn-holder").hide();
    $("#" + id + "-save-link-btn-holder").show();

    $("#" + id + "-delete-link-btn-holder").hide();
    $("#" + id + "-cancel-link-btn-holder").show();

    let contentDiv = $("#" + id + "-link").find(".link-content-div");
    contentDiv.empty();

    contentDiv.append('<input type="text" id="' + id + '-link-input" class="link-input" name="link-input" value="' + getLinkNameById(id) + '">');
    $("#" + id + "-link-input").focus();
}

//begin save link by obtain new link name from input and send it to the next step
function saveLink(id){
    let newName = $("#" + id + "-link-input").val();
    if(getLinkNameById(id) != newName){
        saveEditLink(id, newName);
    }
    else{
        cancelEditLink(id);
    }
}

//send new link name and its id to backend
function saveEditLink(id, newName){
    var data = {};
    data.id = id;
    data.newName = newName;
    $.ajax({
        type: "POST",
        url: "./editLink",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            loadLinks();
        }
    });
}

//cancel editing link by change <input> back to <a>
function cancelEditLink(id){
    $("#" + id + "-save-link-btn-holder").hide();
    $("#" + id + "-edit-link-btn-holder").show();
    
    $("#" + id + "-cancel-link-btn-holder").hide();
    $("#" + id + "-delete-link-btn-holder").show();
    
    let contentDiv = $("#" + id + "-link").find(".link-content-div");
    contentDiv.empty();
    contentDiv.append("<a class = 'link-label' href = '" + getLinkUrlById(id) + "'>" + getLinkNameById(id) + "</a>");
}

//delete a link by sending its id to backend
function deleteLink(id){
    var data = {};
    data.id = id;
    $.ajax({
        type: "POST",
        url: "./deleteLink",
        data: JSON.stringify(data),
        contentType: 'application/json',
        complete: function(){
            playDeleteLinkAnimation(id);
        }
    });
}

//animation: hide current link card and pull up any existed link cards after
function playDeleteLinkAnimation(id){
    $('#' + id + '-link').fadeTo(300, 0.01, function(){
        $('#' + id + '-link ~ .existed-links').animate({top: "-=60"}, function(){
            loadLinks();
        });
    });
}