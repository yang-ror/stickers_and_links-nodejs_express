var MongoClient = require('mongodb').MongoClient;
const database_url = "mongodb://localhost:27017/";
// var url = "mongodb://localhost:27017/";

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;

//     var dbo = db.db("stickers");
//     var link = { id: 1, url: "https://www.youtube.com/", name: "https://www.youtube.com/" };

//     dbo.collection("links").insertOne(link, function(err, res) {
//         if (err) throw err;
//         console.log("1 link inserted");
//         db.close();
//     });
// });

// var url = "mongodb://localhost:27017/";
// var links;

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//         var dbo = db.db("stickers");
//         dbo.collection("links").find({}).toArray(function(err, result) {
//         if (err) throw err;
//         links = result;
//         db.close();
//     });
// });

// return links;

// MongoClient.connect(database_url, function(err, db) {
//     if (err) throw err;

//     var dbo = db.db("stickers");
//     var QueryLinkById = { _id: 'ObjectId("605988f397d43758d10f9471")' };

//     dbo.collection("links").deleteOne(QueryLinkById, function(err, obj) {
//         if (err) throw err;
//         db.close();
//     });
// });


// MongoClient.connect(database_url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("stickers");
//     var sortMethod = { id: -1 };
//     dbo.collection("links").find({}).sort(sortMethod).limit(1).toArray(function(err, result) {
//         if (err) throw err;
//         db.close();
//         console.log(result[0].id);
//     });
// });

// MongoClient.connect(database_url, function(err, db) {
//     if (err) throw err;

//     var dbo = db.db("stickers");
//     var QueryLinkById = { "id": 1 };


//     dbo.collection("links").deleteOne(QueryLinkById, function(err, obj) {
//         if (err) throw err;
//         // console.log("1 link delete");
//         db.close();
//     });
// });

MongoClient.connect(database_url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("stickers");
    var queryBy = { id: 1 };
    var newData = { $set: { name: "New link name" } };
    dbo.collection("links").updateOne(queryBy, newData, function(err, res) {
        if (err) throw err;
        // console.log("1 document updated");
        db.close();
    });
});