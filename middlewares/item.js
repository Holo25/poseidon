var Item=require("../models").Item;

module.exports.getItems = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Item.find().exec(function(err,items){
        console.log("---getItems---");
        req.locals.items=items;
        
        next();
    });
    
};