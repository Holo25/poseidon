var User=require("./models").User;
var Auction=require("./models").Auction;
var Item=require("./models").Item;
var Auction=require("./models").Auction;
var validator = require('validator');


module.exports.createAuction = function (req, res, next) {
    var auction=new Auction({
        expireTime:new Date(Date.now()+req.body.expireTime*1000),
        price:req.body.price,
        item:req.body.item,
        owner:req.user._id
    });
    auction.save(function(err){
        if(err) console.log(err);
        return next();
    })
    
};

module.exports.stopAuction = function (req, res, next) {
    console.log("---Stopped---");
    req.locals.auction.expireTime=new Date();
    req.locals.auction.save(function(err){
        if(err) console.log(err);
        return next();
    })
    
};

module.exports.getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.find().where('expireTime').gt(Date.now()).populate('item owner').exec(function(err,auctions){
        console.log("---getAuctionList---");
        req.locals={auctions:auctions};
        
        next();
    });
    
};

module.exports.getUserAuctions = function(req, res, next){
    Auction.find().where('owner').equals(req.user._id).populate('item owner').exec(function(err,auctions){
        console.log("---getActiveAuctions---");
        req.locals={auctions:auctions};
        
        next();
    });
};



module.exports.getAuction = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.findOne({_id:req.params.id}).populate('item owner').exec(function(err,auction){
        console.log("---getAuction---");
        req.locals={auction:auction};
        next();
    });
    
};

module.exports.getItems = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Item.find().exec(function(err,items){
        console.log("---getItems---");
        req.locals.items=items;
        
        next();
    });
    
};

module.exports.makeBid = function(req,res,next){
    if(req.query.val){
        console.log("---makeBid---");
        var auction=req.locals.auction;
        if(req.query.val > auction.price){
            var oldOwner=auction.owner;
            var newOwner=req.user;
            if(oldOwner.id==newOwner.id){
                newOwner.credit-=req.query.val-auction.price;
                if(newOwner.credit<0) return next();
                oldOwner.credit=newOwner.credit;
                auction.price=req.query.val;
            }else{
                auction.owner=newOwner;
                auction.owner.credit-=req.query.val;
                if(auction.owner.credit<0) return next();
                oldOwner.credit+=auction.price;
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
                
        }else return next();
    }else return next();
};

module.exports.getUser=function(req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    if(req.session && req.session.userID){
        User.findById(req.session.userID,function(err, user){
            console.log("---getUser---");
            req.user=user;
            return next();
        });
    }else res.redirect('/login');
};

module.exports.getAdmin=function(req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    if(req.session && req.session.userID){
        User.findById(req.session.userID,function(err, user){
            console.log("---getAdmin---");
            if(user.neptun!=="admin1")
                res.redirect('/auctions');
            req.user=user;
            return next();
        });
    }else res.redirect('/login');
};

module.exports.authUser=function(req, res, next){
    console.log("---authUser---");
    User.findOne().where('neptun').equals(req.body.username).where('password').equals(req.body.password).exec(function(err,user){
        if(user){
            req.session.userID=user._id;
            return next();
        }
        else res.render("login",{error:"Rossz felhasználónév vagy jelszó!"});
    });
};

module.exports.logoutUser=function(req, res, next){
    console.log("---logoutUser---");
    if(req.session && req.session.userID)
        req.session.destroy(function(err) {
            return next();
        });
    else next();
};

module.exports.validateUser=function(req, res, next){
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
};

module.exports.registerUser=function(req, res, next){
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
};

module.exports.updateUser=function(req, res, next){
    if(validator.isEmail(req.body.email) && validator.equals(req.body.password,req.body.passwordRe) && validator.isLength(req.body.password,{min:6, max: undefined})){
        req.user.email=validator.normalizeEmail(req.body.email);
        req.user.password=validator.escape(req.body.password);
        req.user.save(function(err){
            return next();
        });
    }else res.redirect('/user');
}

module.exports.renderMW = function (viewName) {
    
      return function (req, res) {
        res.render(viewName, {data:req.locals, user:req.user, error:undefined});
        console.log("-----RENDERED------");
      };
    
    };