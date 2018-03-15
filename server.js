var express = require('express');
var app = express();
var path = require('path');

/*
/
/user
/user/edit
/user/create

/login
/logout
/register
/recoverpassword

/auctions
/auctions/:auctionid/bid


*/
var userLoggedIn = true;

var authUser = function (req, res, next) {
    //Visszakuld ha nem vagyunk  bejelentkezve
    if (userLoggedIn) { next(); }
    else res.redirect('/');
}

app.use(express.static('public'))

app.get('/', function (req, res) {
    
     res.sendFile(path.join(__dirname + "/public/login.html"));
    
})

app.listen(1337);