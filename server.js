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


finishAuction(), startAuction()
Mivel az árverések befejezése egy belső esemény amit külső személy nem befolyásolhat, ezért ehhez nem készítettem külön route-t.
Timer segítségével tervezem ezeket a függvényeket meghívni.
*/
var userLoggedIn = false;  //TESZT VÁLTOZÓ

var finishAuction = function(){
    //A nyertesnek jóváírja a megvett tantárgyat majd törli a az árverést.
}

var startAuction = function(){
    //Elkezd egy új árverést ha kevesebb számú van aktív mind a maximális megengedett
}

var authUser = function (req, res, next) {
    //Visszaküld a bejelentkező felületre ha nem vagyunk  bejelentkezve
    console.log("Authed");
    if (userLoggedIn) { next(); }
    else res.redirect('/login');
}

var reverseAuthUser = function (req, res, next) {
    //Visszaküld a főoldalra ha be vagyunk jelentkezve.
    console.log("Reverse Authed");
    if (!userLoggedIn) { next(); }
    else res.redirect('/');
}
var getUser = function (req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    console.log("User Goted");
    next();
}

var editUser = function (req, res, next) {
    //Elmenti a felhasználó adatait
    console.log("User Edited");
    next();
}

var addUser = function (req, res, next) {
    //Új usert készít 
    console.log("User Added"); 
    next();
}

var validateUser = function (req, res, next) {
    //Megnézi hogy OK a megadott bejelentkezési adatok
    console.log("User Validated");
    next();
}

var logoutUser = function (req, res, next) {
    //Kijelentkezteti a usert
    console.log("User Logouted");
    next();
}

var checkUserRegistration = function (req, res, next) {
    //Megnézi hogy jók-e a regisztráló felhasználó adatai
    console.log("User Registration Checked");
    next();
}

var recoverPassword = function (req, res, next) {
    //Elfelejtett jelszó middleware
    console.log("User Password Recovered");
    next();
}

var checkAdmin = function (req, res, next) {
    //Megnézi hogy admin-e a felhasználó, ha nem akkor visszadobja a főoldalra
    console.log("Admin Checked");
    if(true){
        //admin vagyok
        next();
    }else res.redirect('/auctions');
}

var renderMW = function (req, res, next) {
    //Rendereli az adott oldalt
    console.log("Page Rendered");
    res.send('<h1>"pls rember that wen u feel scare or frigten<br>never forget ttimes wen u feeled happy<br>wen day is dark alway rember happy day"</h1>');
    next();
}

var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    console.log("Auction List Getted");
    next();
}

var getAuction = function (req, res, next) {
    //Visszaadja a megadott árverést
    console.log("Auction Getted");
    next();
}

var validateBid = function (req, res, next) {
    //Érvényes-e a licitálás: Létezik az licitált árverés, van-e elég creditje hozzá és nagyobb árat adott meg mint a jelenlegi ár?
    console.log("Bid Validated");
    next();
}

var makeBid = function (req, res, next) {
    //Frissíti az árverés jelenleg vezető userét és árát, jelenlegi usertől levon, előző usernek pedig visszaad crediteket.
    console.log("Bid maked");
    next(); 
}

app.use(express.static('public'))


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
        next();
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

app.use('/auctions',
    authUser,
    getAuctionList,
    renderMW
);

app.post('/auctions/bid',
    authUser,
    getAuction,
    validateBid,
    makeBid,
    renderMW
);
/* 
app.use('/',
    function (req, res, next) {
        res.redirect('/auctions'); Kiakad a böngésző a redirect miatt
        next();
    }
    
);

app.get('/', function (req, res) {
    
     res.sendFile(path.join(__dirname + "/public/login.html"));
    
})*/

app.listen(80);