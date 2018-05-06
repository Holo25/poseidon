var getUser=require("../middlewares").getUser;
var getUserAuctions=require("../middlewares").getUserAuctions;
var renderMW=require("../middlewares").renderMW;
var updateUser=require("../middlewares").updateUser;
var getAdmin=require("../middlewares").getAdmin;
var getAuctionList=require("../middlewares").getAuctionList;
var getItems=require("../middlewares").getItems;

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