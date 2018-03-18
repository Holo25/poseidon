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
var userLoggedIn = true;  //teszt valtozo

var finishAuction = function(){
    //A nyertesnek jóváírja a megvett tantárgyat majd törli a az árverést.
}

var startAuction = function(){
    //Elkezd egy új árverést ha kevesebb számú van aktív mind a maximális megengedett
}

var authUser = function (req, res, next) {
    //Visszaküld a bejelentkező felületre ha nem vagyunk  bejelentkezve
    if (userLoggedIn) { next(); }
    else res.redirect('/login');
}

var reverseAuthUser = function (req, res, next) {
    //Visszaküld a főoldalra ha be vagyunk jelentkezve.
    if (!userLoggedIn) { next(); }
    else res.redirect('/');
}
var getUser = function (req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    next();
}

var editUser = function (req, res, next) {
    //Elmenti a felhasználó adatait
    next();
}

var addUser = function (req, res, next) {
    //Új usert készít 
    next();
}

var validateUser = function (req, res, next) {
    //Megnézi hogy OK a megadott bejelentkezési adatok
    next();
}

var logoutUser = function (req, res, next) {
    //Kijelentkezteti a usert
    next();
}

var checkUserRegistration = function (req, res, next) {
    //Megnézi hogy jók-e a regisztráló felhasználó adatai
    next();
}

var recoverPassword = function (req, res, next) {
    //Elfelejtett jelszó middleware
    next();
}

var checkAdmin = function (req, res, next) {
    //Megnézi hogy admin-e a felhasználó, ha nem akkor visszadobja a főoldalra
    if(true){
        //admin vagyok
        next();
    }else res.redirect('/auctions');
}

var renderMW = function (req, res, next) {
    //Rendereli az adott oldalt
    next();
}

var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    next();
}

var getAuction = function (req, res, next) {
    //Visszaadja a megadott árverést
    next();
}

var validateBid = function (req, res, next) {
    //Érvényes-e a licitálás: Létezik az licitált árverés, van-e elég creditje hozzá és nagyobb árat adott meg mint a jelenlegi ár?
    next();
}

var makeBid = function (req, res, next) {
    //Frissíti az árverés jelenleg vezető userét és árát, jelenlegi usertől levon, előző usernek pedig visszaad crediteket.
    next(); 
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

/*app.get('/', function (req, res) {
    
     res.sendFile(path.join(__dirname + "/public/login.html"));
    
})*/

app.listen(80);