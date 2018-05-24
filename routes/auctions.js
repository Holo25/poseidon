var getAuction=require("../middlewares/auctions").getAuction;
var makeBid=require("../middlewares/generic").makeBid;
var getUser=require("../middlewares/user").getUser;
var getAdmin=require("../middlewares/generic").getAdmin;
var getAuctionList=require("../middlewares/auctions").getAuctionList;
var renderMW=require("../middlewares/generic").renderMW;
var createAuction=require("../middlewares/auctions").createAuction;
var stopAuction=require("../middlewares/auctions").stopAuction;

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
