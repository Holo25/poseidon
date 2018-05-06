var getAuction=require("../middlewares").getAuction;
var makeBid=require("../middlewares").makeBid;
var getUser=require("../middlewares").getUser;
var getAdmin=require("../middlewares").getAdmin;
var getAuctionList=require("../middlewares").getAuctionList;
var renderMW=require("../middlewares").renderMW;
var createAuction=require("../middlewares").createAuction;
var stopAuction=require("../middlewares").stopAuction;

module.exports=function(app){
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

    app.post('/auctions/create',
        getAdmin,
        createAuction,
        function(req, res){
            res.redirect('/admin');
        });
    
    app.get('/auctions/:id/stop',
        getAdmin,
        getAuction,
        stopAuction,
        function(req,res){
            res.redirect('/admin');
        });
};
