var User=require("../models").User;

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



module.exports.renderMW = function (viewName) {
    
      return function (req, res) {
        res.render(viewName, {data:req.locals, user:req.user, error:undefined});
        console.log("-----RENDERED------");
      };
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