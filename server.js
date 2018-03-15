var express = require('express');
var app = express();
var path = require('path');

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


*/
var userLoggedIn = true;

var authUser = function (req, res, next) {
    //Visszaküld ha nem vagyunk  bejelentkezve
    if (userLoggedIn) { next(); }
    else res.redirect('/login');
}

var reverseAuthUser = function (req, res, next) {
    //Visszaküld ha be vagyunk  jelentkezve
    if (!userLoggedIn) { next(); }
    else res.redirect('/');
}
var getUser = function (req, res, next) {
    //megkeresi a jelenleg loginolt usert
}

var editUser = function (req, res, next) {
    //A változásokat elmenti a user profiljában 
}

var addUser = function (req, res, next) {
    //Új usert készít 
}

var validateUser = function (req, res, next) {
    //Megnézi hogy ok a megadott bejelentkezési adatok
}

var logoutUser = function (req, res, next) {
    //Kijelentkezteti a usert
}

var checkUserRegistration = function (req, res, next) {
    //Megnézi hogy jók-e a regisztráló felhasználó adatai
}

var recoverPassword = function (req, res, next) {
    //Elfelejtett jelszó middleware
}

var checkAdmin = function (req, res, next) {
    //Megnézi hogy admin-e a felhasználó
}
var renderMW = function (req, res, next) {
    //Rendereli az adott oldalt
}

var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
}

app.use(express.static('public'))

app.use('/',authUser,
    function (req, res) {
        res.redirect('/auctions');
    }
);
app.use('/user',
    authUser,
    getUser,
    renderMW
);

app.use('/user/edit',
    authUser,
    getUser,
    editUser,
    renderMW
);

app.use('/login',
    reverseAuthUser,
    validateUser,
    renderMW
);
app.use('/logout',
    authUser,
    logoutUser,
    function (req, res) {
        res.redirect('/login');
    }
);

app.use('/register',
    reverseAuthUser,
    checkUserRegistration,
    addUser,
    renderMW
);

app.use('/recover',
    reverseAuthUser,
    recoverPassword,
    renderMW
);

app.use('/admin',
    checkAdmin,
    renderMW
);

app.get('/', function (req, res) {
    
     res.sendFile(path.join(__dirname + "/public/login.html"));
    
})

app.listen(80);