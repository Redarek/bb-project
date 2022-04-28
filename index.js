const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'bbDB',
    multipleStatements: true
});

const PORT = 3000;

mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection was successful');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.listen(PORT, () => console.log('Server started on port ' + PORT))

//Get all nfts
app.get('/nfts', (req, res) => {
    mysqlConnection.query('SELECT * FROM nfts', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Get a NFT
app.get('/nfts/:id', (req, res) => {
    mysqlConnection.query('SELECT * FROM nfts WHERE nftID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete a NFT
app.delete('/nfts/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM nfts WHERE nftID = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully.');
        else
            console.log(err);
    })
});


//Insert a NFT
app.post('/nfts', (req, res) => {
    let nft = req.body;
    var sql = "SET @nftID = ?;SET @Name = ?;SET @url = ?; \
    CALL nftAddOrEdit(@nftID,@Name,@url);";
    mysqlConnection.query(sql, [nft.nftID, nft.Name, nft.url], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Inserted NFT id : '+element[0].nftID);
            });
        else
            console.log(err);
    })  
});

//Update a NFT
app.put('/nfts', (req, res) => {
    let nft = req.body;
    var sql = "SET @nftID = ?;SET @Name = ?;SET @url = ?; \
    CALL nftAddOrEdit(@nftID,@Name,@url);";
    mysqlConnection.query(sql, [nft.nftID, nft.Name, nft.url], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                res.send('Successfully updated NFT id : '+element[0].nftID);
            });
        else
            console.log(err);
    })  
});