var getUser=require("../middlewares/user").getUser;
var getUserAuctions=require("../middlewares/auctions").getUserAuctions;
var renderMW=require("../middlewares/generic").renderMW;
var updateUser=require("../middlewares/user").updateUser;
var getAdmin=require("../middlewares/generic").getAdmin;
var getAuctionList=require("../middlewares/auctions").getAuctionList;
var getItems=require("../middlewares/item").getItems;

module.exports=function(app){
    app.get('/user',
    getUser,
    getUserAuctions,
    renderMW("profil"));

    app.post('/user/edit',
        getUser,
        updateUser,
        function(req,res){
            res.redirect('/user');
        });

    app.get('/admin',
        getAdmin,
        getAuctionList,
        getItems,
        renderMW("admin"));
};