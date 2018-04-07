var express = require('express');
var app = express();
var path = require('path');

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

var userData={
        user:{
            id:1,
            username:"sutemeny",
            name:"Szilvás Bukta",
            credit:4201,
            neptun:"C3F4IM",
            email:"mertazt@szeretem.hu",
            items:[
                {name:"Grafika",
                credit:3,
                price:400
                },
                {name:"BSz2",
                credit:4,
                price:600
                }
            ]
        }
    };

var item1={name:"Grafika", credit:3, price:400 };
var item2={name:"Szerveroldali Javascript", credit:2, price:700 };
var item3={name:"Mérnök leszek", credit:5, price:10 };

var auctionData=[
    {id:0,expireTime:30, owner:userData, item:item1},
    {id:1,expireTime:90, owner:userData, item:item2},
    {id:2,expireTime:1,  owner:userData, item:item3}
];

var getUser = function (req, res, next) {
    //Megkeresi a jelenleg loginolt usert
    res.data=userData;
    console.log("User Goted ");
    next();
}



var getAuctionList = function (req, res, next) {
    //Visszaadja az árverések listáját(aka főoldal tartalmát)
    
    res.data["auctions"]=auctionData;

    console.log("Auction List Getted");
    next();
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
        console.log("-----RENDERED------");
        res.render(viewName, {data:res.data});
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