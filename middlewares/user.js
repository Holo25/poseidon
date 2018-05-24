var User=require("../models").User;
var validator = require('validator');

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
    else res.redirect('/login');
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