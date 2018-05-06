var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var validator = require('validator');


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

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    credit: Number
});

var Item = mongoose.model('Item', ItemSchema );

var UserSchema = new Schema({
    username: String,
    password: String,
    credit: Number,
    neptun: String,
    email: String,
});

var User = mongoose.model('User', UserSchema);



var AuctionSchema = new Schema({
    expireTime: Date,
    price: Number,
    owner: {type: Schema.ObjectId, ref:'User'},
    item: {type: Schema.ObjectId, ref:'Item'}
});

var Auction = mongoose.model('Auction', AuctionSchema);
//Database init
User.findOne({username:"Suti"},function(err, user){
    if(user === null){ // Suti nelkul nincs az eletnek ertelme.
        var user1= new User({
            username:"Suti",
            password:"bukta1",
            credit:4201,
            neptun:"C3F4IM",
            email:"mertazt@szeretem.hu"
            
        });
        user1.save(function (err) {
            var user2= new User({
                username:"Pretender",
                password:"bunko2",
                credit:111,
                neptun:"BATMAN",
                email:"haha@ha.ha"
                
            });
            user2.save(function (err) {
                var item1= new Item({
                    name: "BSZ",
                    credit: 4
                });
                item1.save(function (err) {
                    var item2= new Item({
                        name: "Grafika",
                        credit: 3
                    });
                    item2.save(function (err) {
                        var auction1 = new Auction({
                            expireTime: new Date,
                            price: 300,
                            owner: user1._id,
                            item: item1._id
                        });
                        
                        auction1.save(function (err) {
                            var auction2 = new Auction({
                                expireTime: new Date,
                                price: 540,
                                owner: user2._id,
                                item: item2._id
                            });
                            
                            auction2.save(function (err) {
                                if (err) return handleError(err);
                                });
                            });
                    });
                });
            });
        });
    }
});

/*
var user= new User({
            username:"sutemeny",
            name:"Szilvás Bukta",
            credit:4201,
            neptun:"C3F4IM",
            email:"mertazt@szeretem.hu"
            
        });
user.save(function (err) {
    if (err) return handleError(err);
  });


var item= new Item({
    name: "BSZ",
    credit: 200
});
item.save(function (err) {
    if (err) return handleError(err);
});

var auction = new Auction({
    expireTime: 90,
    price: 300,
    owner: mongoose.Types.ObjectId("5ad4c39422f51616782d2f3f"),
    item: mongoose.Types.ObjectId("5ad4c549d0c8661f5c780f76")
});

auction.save(function (err) {
    if (err) return handleError(err);
    });
*/


var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.find().where('expireTime').gt(Date.now()).populate('item owner').exec(function(err,auctions){
        console.log("---getAuctionList---");
        req.locals={auctions:auctions};
        
        next();
    });
    
}

var getUserAuctions = function(req, res, next){
    Auction.find().where('owner').equals(req.user._id).populate('item owner').exec(function(err,auctions){
        console.log("---getActiveAuctions---");
        req.locals={auctions:auctions};
        
        next();
    });
}



var getAuction = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.findOne({_id:req.params.id}).populate('item owner').exec(function(err,auction){
        console.log("---getAuction---");
        req.locals={auction:auction};
        next();
    });
    
}

var makeBid = function(req,res,next){
    if(req.query.val){
        console.log("---makeBid---");
        var auction=req.locals.auction;
        if(req.query.val > auction.price){
            var oldOwner=auction.owner;
            var newOwner=req.user;
            if(oldOwner.id==newOwner.id){
                newOwner.credit-=req.query.val-auction.price;
                oldOwner.credit=newOwner.credit;
                auction.price=req.query.val;
            }else{
                oldOwner.credit+=auction.price;
                auction.owner=newOwner;
                auction.owner.credit-=req.query.val;
                auction.price=req.query.val;
            }
            auction.owner.save(function (err) {
                if (err) return handleError(err);
                oldOwner.save(function (err) {
                    if (err) return handleError(err);
                    auction.save(function (err) {
                        if (err) return handleError(err);
                        return next();
                        });
                    });
                });
                
        }
    }else return next();
}

function getUser(req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    if(req.session && req.session.userID){
        User.findById(req.session.userID,function(err, user){
            console.log("---getUser---");
            req.user=user;
            return next();
        });
    }else res.redirect('/login');
}

function authUser(req, res, next){
    console.log("---authUser---");
    User.findOne().where('neptun').equals(req.body.username).where('password').equals(req.body.password).exec(function(err,user){
        if(user){
            req.session.userID=user._id;
            return next();
        }
        else res.render("login",{error:"Rossz felhasználónév vagy jelszó!"});
    });
}

function logoutUser(req, res, next){
    console.log("---logoutUser---");
    if(req.session && req.session.userID)
        req.session.destroy(function(err) {
            return next();
        });
    else next();
}

function validateUser(req, res, next){
    if(validator.isAlphanumeric(req.body.username) && validator.isAlphanumeric(req.body.neptun)&& validator.isLength(req.body.neptun,{min:6, max: 6}) && validator.isEmail(req.body.mail)){
        if(validator.isAlphanumeric(req.body.password)&& validator.isLength(req.body.password,{min:6, max: undefined}) && validator.equals(req.body.password,req.body.passwordRe)){
            req.locals={username:validator.escape(req.body.username),
            neptun:validator.escape(req.body.neptun),
            mail:validator.normalizeEmail(req.body.mail),
            password:validator.escape(req.body.password)};
            return next();
        }
    }
    res.render("register",{error:"Hibás adatok!"});
}

function registerUser(req, res, next){
    User.findOne().where('neptun').equals(req.locals.neptun).exec(function(err,user){
        if(user) res.render("register",{error:"Felhasználó már létezik!"});
        else{
            new User({
                username:req.locals.username,
                neptun:req.locals.neptun,
                email:req.locals.mail,
                credit:1000,
                password:req.locals.password
            }).save(function(err){
                if(err) console.log(err);
                next();
            });
        }
    });
}

var renderMW = function (viewName) {
    
      return function (req, res) {
        res.render(viewName, {data:req.locals, user:req.user, error:undefined});
        console.log("-----RENDERED------");
      };
    
    };

app.use(express.static('public'))
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({ secret: 'macskajaj', cookie: {maxAge: 60000},resave:true, saveUninitialized:false}));


app.get('/',
    
    function(req,res){
        res.redirect('/auctions');
    });

//----Auctions

app.get('/auctions',
    getUser,
    getAuctionList,
    renderMW("auctions"));

app.get('/auctions/:id/bid',
        getUser,
        getAuction,
        makeBid,
        function(req,res){
            res.redirect('/auctions');
        });


//----User

app.get('/user',
    getUser,
    getUserAuctions,
    renderMW("profil"));

app.post('/user/edit',
    getUser,
    updateUser);


//----Login/Logout/Register

app.get('/login',renderMW("login"));

app.post('/login',authUser,function(req, res){
    res.redirect('/auctions');
});

app.get('/logout',logoutUser,function(req, res){
    res.redirect('/login');
});

app.get('/register',renderMW("register"));

app.post('/register',validateUser,registerUser,function(req, res){
    res.redirect('/login');
});

app.listen(80);