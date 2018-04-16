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

Az adatokat a getUser és getAuctionList middlewareben definiáltam.

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
    expireTime: Number,
    price: Number,
    owner: {type: Schema.ObjectId, ref:'User'},
    item: {type: Schema.ObjectId, ref:'Item'}
});

var Auction = mongoose.model('Auction', AuctionSchema);
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
        console.log(res.data);
        next();
    });
    
}

var makeBid = function(req,res,next){
    if(req.query.val){
        if(req.query.val > res.data.auctions[req.params.id].item.price){
            auctionData[req.params.id].item.price=req.query.val;
        }
    }
    else
        res.send("Bocs. NO val param!");
    next();
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
        getAuctionList,
        makeBid,
        function(req,res){
            res.redirect('/auctions');
        });




app.listen(80);