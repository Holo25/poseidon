//----Login/Logout/Register
var authUser=require("../middlewares/user").authUser;
var logoutUser=require("../middlewares/user").logoutUser;
var validateUser=require("../middlewares/user").validateUser;
var registerUser=require("../middlewares/user").registerUser;
var renderMW=require("../middlewares/generic").renderMW;

module.exports=function(app){
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
};