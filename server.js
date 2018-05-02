var express = require('express');
var app = express();
var path = require('path');
var mongoose = require('mongoose');


/*
/
/user
/user/edit

/login
/logout
/register
/recover
/admin

/auctions
/auctions/:auctionid/bid
/auctions/:auctionid/start
/auctions/:auctionid/delete


*/

var mongoDB = 'mongodb://localhost/c3f4im';
mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var Schema = mongoose.Schema;

var ItemSchema = new Schema({
    name: String,
    credit: Number
});

var Item = mongoose.model('Item', ItemSchema );

var UserSchema = new Schema({
    username: String,
    name: String,
    credit: Number,
    neptun: String,
    email: String,
});

var User = mongoose.model('User', UserSchema);



var AuctionSchema = new Schema({
    expireTime: Date,
    price: Number,
    owner: {type: Schema.ObjectId, ref:'User'},
    item: {type: Schema.ObjectId, ref:'Item'}
});

var Auction = mongoose.model('Auction', AuctionSchema);
//Database init
User.findOne({username:"Suti"},function(err, user){
    if(user === null){ // Suti nelkul nincs az eletnek ertelme.
        var user1= new User({
            username:"Suti",
            name:"Szilvás Bukta",
            credit:4201,
            neptun:"C3F4IM",
            email:"mertazt@szeretem.hu"
            
        });
        user1.save(function (err) {
            var user2= new User({
                username:"Pretender",
                name:"Epres Bukta",
                credit:111,
                neptun:"BATMAN",
                email:"haha@ha.ha"
                
            });
            user2.save(function (err) {
                var item1= new Item({
                    name: "BSZ",
                    credit: 4
                });
                item1.save(function (err) {
                    var item2= new Item({
                        name: "Grafika",
                        credit: 3
                    });
                    item2.save(function (err) {
                        var auction1 = new Auction({
                            expireTime: new Date,
                            price: 300,
                            owner: user1._id,
                            item: item1._id
                        });
                        
                        auction1.save(function (err) {
                            var auction2 = new Auction({
                                expireTime: new Date,
                                price: 540,
                                owner: user2._id,
                                item: item2._id
                            });
                            
                            auction2.save(function (err) {
                                if (err) return handleError(err);
                                });
                            });
                    });
                });
            });
        });
    }
});

/*
var user= new User({
            username:"sutemeny",
            name:"Szilvás Bukta",
            credit:4201,
            neptun:"C3F4IM",
            email:"mertazt@szeretem.hu"
            
        });
user.save(function (err) {
    if (err) return handleError(err);
  });


var item= new Item({
    name: "BSZ",
    credit: 200
});
item.save(function (err) {
    if (err) return handleError(err);
});

var auction = new Auction({
    expireTime: 90,
    price: 300,
    owner: mongoose.Types.ObjectId("5ad4c39422f51616782d2f3f"),
    item: mongoose.Types.ObjectId("5ad4c549d0c8661f5c780f76")
});

auction.save(function (err) {
    if (err) return handleError(err);
    });
*/

var getUser = function (req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    User.findOne({},function(err, user){
        console.log("---getUser---");
        console.log(user);
        res.data={user:user};
        next();
    });
}



var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.find({}).populate('item owner').exec(function(err,auctions){
        console.log("---getAuctionList---");
        console.log(auctions);
        res.data["auctions"]=auctions;
        
        next();
    });
    
}

var getAuction = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    Auction.findOne({_id:req.params.id}).populate('item owner').exec(function(err,auction){
        console.log("---getAuction---");
        console.log(auction);
        res.data["auction"]=auction;
        next();
    });
    
}

var makeBid = function(req,res,next){
    if(req.query.val){
        console.log("---makeBid---");
        var auction=res.data.auction;
        if(req.query.val > auction.price){
            console.log(req.query.val +">"+auction.price);
            var oldOwner=auction.owner;
            var newOwner=res.data.user;
            if(oldOwner.id==newOwner.id){
                newOwner.credit-=req.query.val-auction.price;
                oldOwner.credit=newOwner.credit;
                auction.price=req.query.val;
            }else{
                oldOwner.credit+=auction.price;
                auction.owner=newOwner;
                auction.owner.credit-=req.query.val;
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
                
        }
    }else return next();
}

var renderMW = function (viewName) {
    
      return function (req, res) {
        res.render(viewName, {data:res.data});
        console.log("-----RENDERED------");
      };
    
    };

app.use(express.static('public'))
app.set('view engine', 'ejs');



app.get('/',
    
    function(req,res){
        res.redirect('/auctions');
    });

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




app.listen(80);