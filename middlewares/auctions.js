var Auction=require("../models").Auction;



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

module.exports.getAuction = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.findOne({_id:req.params.id}).populate('item owner').exec(function(err,auction){
        console.log("---getAuction---");
        req.locals={auction:auction};
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