var getAuction=require("../middlewares").getAuction;
var makeBid=require("../middlewares").makeBid;
var getUser=require("../middlewares").getUser;
var getAuctionList=require("../middlewares").getAuctionList;
var renderMW=require("../middlewares").renderMW;
var createAuction=require("../middlewares").createAuction;

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
        getUser,
        createAuction,
        function(req, res){
            res.redirect('/admin');
        });
};
