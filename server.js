var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');


/*
/
/user
/user/edit

/login
/logout
/register
/recover
/admin

/auctions
/auctions/:auctionid/bid
/auctions/:auctionid/start
/auctions/:auctionid/delete


*/

var mongoDB = 'mongodb://localhost/c3f4im';
mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));





//Database init
require("./init_script")();




app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({ secret: 'macskajaj', cookie: {maxAge: 3600000},resave:true, saveUninitialized:false}));


app.get('/',
    
    function(req,res){
        res.redirect('/auctions');
    });

require("./routes/generic")(app);
require("./routes/auctions")(app);
require("./routes/user")(app);



app.listen(process.env.PORT||80);