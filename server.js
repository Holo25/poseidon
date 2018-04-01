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
/auctions/:auctionid/start
/auctions/:auctionid/delete

Az adatokat a getUser és getAuctionList middlewareben definiáltam.

*/
var userLoggedIn = true;  //TESZT VÁLTOZÓ

var finishAuction = function(req, res, next){
    //A nyertesnek jóváírja a megvett tantárgyat majd törli a az árverést.
    next();
}

var startAuction = function(req, res, next){
    //Elkezd egy új árverést ha kevesebb számú van aktív mind a maximális megengedett
    next();
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
    res.data={
            user:{
                id:1,
                username:"sutemeny",
                name:"Szilvás Bukta",
                credit:4201,
                neptun:"C3F4IM",
                email:"mertazt@szeretem.hu",
                items:[
                    {name:"Grafika",
                    credit:3,
                    price:400
                    },
                    {name:"BSz2",
                    credit:4,
                    price:600
                    }
                ]
                }
            };
    console.log("User Goted ");
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

var renderMW = function (viewName) {
    
      return function (req, res) {
        res.render(viewName, {data:res.data});
      };
    
    };

var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    var item1={name:"Grafika", credit:3, price:400 };
    var item2={name:"Szerveroldali Javascript", credit:2, price:700 };
    var item3={name:"Mérnök leszek", credit:5, price:10 };
    res.data["auctions"]=[
        {id:1,expireTime:30, item:item1},
        {id:2,expireTime:90, item:item2},
        {id:3,expireTime:1,  item:item3}
    ]

    console.log("Auction List Getted");
    next();
}

var getAuction = function (req, res, next) {
    //Visszaadja a megadott árverést
    console.log("Auction Getted");
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
app.set('view engine', 'ejs');


app.use('/user',
    getUser,
    authUser,
    renderMW("profil")
);

app.use('/user/edit',
    getUser,
    authUser,
    editUser,
    renderMW("profil")
);

app.use('/login',
    reverseAuthUser,
    validateUser,
    renderMW("login")
);

app.use('/logout',
    authUser,
    logoutUser,
    function (req, res, next) {
        res.redirect('/login');
        next();
    }
);

app.use('/register',
    reverseAuthUser,
    checkUserRegistration,
    addUser,
    renderMW("register")
);

app.use('/recover',
    reverseAuthUser,
    recoverPassword,
    renderMW("Recover")
);

app.use('/admin',
    getUser,
    checkAdmin,
    getAuctionList,
    renderMW("admin")
);

app.use('/auctions',
    getUser,
    authUser,
    getAuctionList,
    renderMW("auctions")
);

app.post('/auctions/:auctionid/bid',
    getUser,
    authUser,
    getAuction,
    validateBid,
    makeBid,
);

app.post('/auctions/:auctionid/start',
getUser,
checkAdmin,
getAuction,
startAuction
);

app.post('/auctions/:auctionid/stop',
getUser,
checkAdmin,
getAuction,
finishAuction
);
 
app.use('/',
    function (req, res, next) {
        
        next();
    }
    
);


app.listen(80);